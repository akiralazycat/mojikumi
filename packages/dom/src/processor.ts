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

export function requiresPunctuationFallback(
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): boolean {
  if (options.precision === "native" || !options.preset.fallback) return false;
  if (options.precision === "full") return true;

  return Boolean(
    (options.preset.punctuationClusters && !support.textSpacingTrim) ||
      (options.preset.lineStartTrim && !support.textSpacingTrimStart) ||
      (options.preset.lineEndTrim === "when-needed" &&
        !support.textSpacingTrim) ||
      (options.preset.lineEndTrim === true && !support.textSpacingTrimBoth)
  );
}

export function requiresAutospaceFallback(
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): boolean {
  return Boolean(
    options.preset.autospace &&
      options.preset.fallback &&
      shouldFallback(options.precision, support.textAutospace)
  );
}

function isExcluded(
  node: Text,
  root: Element,
  options: ResolvedMojikumiOptions
): boolean {
  const parent = node.parentElement;
  if (!parent || parent.closest(GENERATED_SELECTOR)) return true;
  const mojikumiRoot = parent.closest(".mjk");
  if (mojikumiRoot && mojikumiRoot !== root) return true;
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
        return text.data.trim() && !isExcluded(text, root, options)
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
    requiresPunctuationFallback(options, support);
  const autospaceFallback = requiresAutospaceFallback(options, support);
  const lineFallback = requiresPunctuationFallback(options, support);

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
  const generated = [
    ...root.querySelectorAll<HTMLElement>(GENERATED_SELECTOR)
  ].filter((element) => element.closest(".mjk") === root);
  for (const element of generated.reverse()) {
    element.replaceWith(element.textContent ?? "");
  }
  root.normalize();
}

function rectAt(rects: DOMRectList, index: number): DOMRect | undefined {
  if (typeof rects.item === "function") return rects.item(index) ?? undefined;
  return rects[index] ?? undefined;
}

/**
 * Line context is a question about one block. A neighbouring paragraph always
 * sits on another line, so letting the search escape the block would report
 * every block-final closing bracket as a line end wherever it happened to fall.
 */
function blockOf(root: Element, token: Element): Element {
  const block = token.closest(BLOCK_SELECTOR);
  return block && root.contains(block) ? block : root;
}

function getTextRect(
  root: Element,
  token: Element,
  direction: "previous" | "next"
): DOMRect | undefined {
  const document = root.ownerDocument;
  const walker = document.createTreeWalker(
    blockOf(root, token),
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
    ? rectAt(rects, rects.length - 1)
    : rectAt(rects, 0);
}

function hasPreviousTextInBlock(root: Element, token: Element): boolean {
  const range = root.ownerDocument.createRange();
  range.selectNodeContents(blockOf(root, token));
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

  const candidates = [
    ...root.querySelectorAll<HTMLElement>(
      "[data-mjk-line-start-candidate],[data-mjk-line-end-candidate]"
    )
  ].filter((token) => token.closest(".mjk") === root);
  for (const token of candidates) {
    token.classList.remove(
      "mjk-line-start",
      "mjk-wrapped-line-start",
      "mjk-line-end"
    );
    delete token.dataset.mjkContext;

    const rect = rectAt(token.getClientRects(), 0);
    if (!rect || (rect.width === 0 && rect.height === 0)) continue;
    const writingMode = view.getComputedStyle(token).writingMode;

    if (token.hasAttribute("data-mjk-line-start-candidate")) {
      const previous = getTextRect(root, token, "previous");
      const paragraphStart = !hasPreviousTextInBlock(root, token);
      const wrappedLineStart =
        !paragraphStart &&
        Boolean(previous && !sameLine(rect, previous, writingMode));
      token.classList.toggle("mjk-line-start", paragraphStart || wrappedLineStart);
      token.classList.toggle("mjk-wrapped-line-start", wrappedLineStart);
      if (paragraphStart) token.dataset.mjkContext = "paragraph-start";
      else if (wrappedLineStart) {
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
