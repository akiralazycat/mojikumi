import {
  analyzeText,
  isPunctuationClass,
  segmentGraphemes,
  type MojikumiClass,
  type MojikumiToken
} from "@mojikumi/core";
import type {
  NativeFeatureSupport,
  ResolvedMojikumiOptions
} from "./types.js";

const GENERATED_SELECTOR = "[data-mjk-generated]";
const BLOCK_SELECTOR =
  "address,article,aside,blockquote,div,dd,dl,dt,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hr,li,main,nav,ol,p,pre,section,table,ul";

interface TokenDecoration {
  className: MojikumiClass;
  pairAfter: boolean;
  autospaceBefore: boolean;
  lineStartCandidate: boolean;
  lineEndCandidate: boolean;
}

function shouldFallback(
  precision: ResolvedMojikumiOptions["precision"],
  supported: boolean
): boolean {
  return precision === "full" || (precision === "auto" && !supported);
}

function isExcluded(node: Text, options: ResolvedMojikumiOptions): boolean {
  const parent = node.parentElement;
  if (!parent || parent.closest(GENERATED_SELECTOR)) return true;
  return options.exclude.some((selector) => parent.closest(selector));
}

function collectTextNodes(
  root: Element,
  options: ResolvedMojikumiOptions
): Text[] {
  const document = root.ownerDocument;
  const walker = document.createTreeWalker(
    root,
    document.defaultView?.NodeFilter.SHOW_TEXT ?? 4,
    {
      acceptNode(node) {
        const text = node as Text;
        return text.data.trim() && !isExcluded(text, options)
          ? (document.defaultView?.NodeFilter.FILTER_ACCEPT ?? 1)
          : (document.defaultView?.NodeFilter.FILTER_REJECT ?? 2);
      }
    }
  );
  const nodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) nodes.push(current as Text);
  return nodes;
}

function decorationsFor(
  text: string,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): Map<number, TokenDecoration> {
  const clusterFallback =
    options.preset.punctuationClusters &&
    shouldFallback(options.precision, support.textSpacingTrim);
  const autospaceFallback =
    options.preset.autospace &&
    shouldFallback(options.precision, support.textAutospace);
  const lineFallback =
    options.precision === "full" ||
    (options.precision === "auto" && !support.textSpacingTrim);

  if (!clusterFallback && !autospaceFallback && !lineFallback) return new Map();

  const analysis = analyzeText(text, {
    punctuationClusters: clusterFallback,
    autospace: autospaceFallback
  });
  const pairOffsets = new Set(
    analysis.pairAdjustments.map(({ left }) => left.offset)
  );
  const autospaceOffsets = new Set(
    analysis.autospaceBoundaries.map(({ right }) => right.offset)
  );
  const result = new Map<number, TokenDecoration>();

  for (const token of analysis.tokens) {
    const pairAfter = pairOffsets.has(token.offset);
    const autospaceBefore = autospaceOffsets.has(token.offset);
    const lineStartCandidate =
      lineFallback &&
      options.preset.lineStartTrim &&
      token.class === "opening";
    const lineEndCandidate =
      lineFallback &&
      Boolean(options.preset.lineEndTrim) &&
      (token.class === "closing" ||
        token.class === "comma" ||
        token.class === "period");

    if (
      pairAfter ||
      autospaceBefore ||
      lineStartCandidate ||
      lineEndCandidate
    ) {
      result.set(token.offset, {
        className: token.class,
        pairAfter,
        autospaceBefore,
        lineStartCandidate,
        lineEndCandidate
      });
    }
  }

  return result;
}

function createTokenSpan(
  document: Document,
  token: MojikumiToken,
  decoration: TokenDecoration
): HTMLSpanElement {
  const span = document.createElement("span");
  span.dataset.mjkGenerated = "";
  span.dataset.mjkClass = decoration.className;
  span.classList.add("mjk-token");
  if (decoration.pairAfter) span.classList.add("mjk-pair-after");
  if (decoration.autospaceBefore) {
    span.classList.add("mjk-autospace-before");
  }
  if (decoration.lineStartCandidate) {
    span.dataset.mjkLineStartCandidate = "";
  }
  if (decoration.lineEndCandidate) {
    span.dataset.mjkLineEndCandidate = "";
  }
  span.textContent = token.value;
  return span;
}

function transformTextNode(
  node: Text,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): void {
  const decorations = decorationsFor(node.data, options, support);
  if (decorations.size === 0) return;

  const tokens = analyzeText(node.data, {
    punctuationClusters: false,
    autospace: false
  }).tokens;
  const fragment = node.ownerDocument.createDocumentFragment();
  let textBuffer = "";

  const flush = () => {
    if (!textBuffer) return;
    fragment.append(node.ownerDocument.createTextNode(textBuffer));
    textBuffer = "";
  };

  for (const token of tokens) {
    const decoration = decorations.get(token.offset);
    if (!decoration) {
      textBuffer += token.value;
      continue;
    }
    flush();
    fragment.append(createTokenSpan(node.ownerDocument, token, decoration));
  }
  flush();
  node.replaceWith(fragment);
}

export function restoreGeneratedMarkup(root: Element): void {
  const generated = [...root.querySelectorAll<HTMLElement>(GENERATED_SELECTOR)];
  for (const element of generated.reverse()) {
    element.replaceWith(element.textContent ?? "");
  }
  root.normalize();
}

function getTextRect(
  root: Element,
  token: Element,
  direction: "previous" | "next"
): DOMRect | undefined {
  const document = root.ownerDocument;
  const walker = document.createTreeWalker(
    root,
    document.defaultView?.NodeFilter.SHOW_TEXT ?? 4
  );
  const nodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) nodes.push(current as Text);

  const ownText = token.firstChild;
  const ownIndex = ownText ? nodes.indexOf(ownText as Text) : -1;
  if (ownIndex < 0) return undefined;
  const adjacent = nodes[ownIndex + (direction === "previous" ? -1 : 1)];
  if (!adjacent || !adjacent.data.trim()) return undefined;

  const range = document.createRange();
  const segments = segmentGraphemes(adjacent.data);
  const segment =
    direction === "previous" ? segments.at(-1) : segments.at(0);
  if (!segment) return undefined;
  const start = segment.offset;
  const end = start + segment.value.length;
  range.setStart(adjacent, start);
  range.setEnd(adjacent, end);
  const getClientRects = (
    range as Range & { getClientRects?: () => DOMRectList }
  ).getClientRects;
  if (typeof getClientRects !== "function") return undefined;
  const rects = getClientRects.call(range);
  return direction === "previous"
    ? rects.item(rects.length - 1) ?? undefined
    : rects.item(0) ?? undefined;
}

function hasPreviousTextInBlock(root: Element, token: Element): boolean {
  const block = token.closest(BLOCK_SELECTOR) ?? root;
  const range = root.ownerDocument.createRange();
  range.selectNodeContents(block);
  range.setEndBefore(token);
  return Boolean(range.toString().trim());
}

function sameLine(
  current: DOMRect,
  adjacent: DOMRect,
  writingMode: string
): boolean {
  return writingMode.startsWith("vertical")
    ? Math.abs(current.left - adjacent.left) < 1
    : Math.abs(current.top - adjacent.top) < 1;
}

export function measureLineContext(root: Element): void {
  const view = root.ownerDocument.defaultView;
  if (!view) return;

  const candidates = root.querySelectorAll<HTMLElement>(
    "[data-mjk-line-start-candidate],[data-mjk-line-end-candidate]"
  );
  for (const token of candidates) {
    const rect = token.getClientRects().item(0);
    if (!rect || (rect.width === 0 && rect.height === 0)) continue;
    const writingMode = view.getComputedStyle(token).writingMode;

    if (token.hasAttribute("data-mjk-line-start-candidate")) {
      const previous = getTextRect(root, token, "previous");
      const paragraphStart = !hasPreviousTextInBlock(root, token);
      token.classList.toggle(
        "mjk-wrapped-line-start",
        !paragraphStart && Boolean(previous && !sameLine(rect, previous, writingMode))
      );
      if (paragraphStart) token.dataset.mjkContext = "paragraph-start";
      else if (token.classList.contains("mjk-wrapped-line-start")) {
        token.dataset.mjkContext = "wrapped-line-start";
      }
    }

    if (token.hasAttribute("data-mjk-line-end-candidate")) {
      const next = getTextRect(root, token, "next");
      const lineEnd = Boolean(next && !sameLine(rect, next, writingMode));
      token.classList.toggle("mjk-line-end", lineEnd);
      if (lineEnd) token.dataset.mjkContext = "line-end";
    }
  }
}

export function processElement(
  root: Element,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): void {
  for (const node of collectTextNodes(root, options)) {
    transformTextNode(node, options, support);
  }
}
