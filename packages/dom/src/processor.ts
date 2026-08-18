import {
  analyzeText,
  computeUnbreakableRuns,
  isPunctuationClass,
  MACHINE_MARK_PATTERN,
  segmentGraphemes,
  type MojikumiClass,
  type MojikumiToken,
  type UnbreakableRun
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

/**
 * Whether the DOM fallback is allowed to take on line ends.
 *
 * Only a justified preset qualifies. Trimming the half-em after a line-final
 * comma is invisible in ragged text — nothing sits to its right to be pulled in
 * — so in a ragged line the adjustment cannot improve the line, and the one
 * thing it can still do is persuade the browser to break somewhere else.
 */
export function trimsLineEnds(options: ResolvedMojikumiOptions): boolean {
  return Boolean(options.preset.lineEndTrim) && options.preset.justify;
}

export function requiresPunctuationFallback(
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): boolean {
  if (options.precision === "native") return false;
  if (options.precision === "full") return true;

  return Boolean(
    (options.preset.punctuationClusters && !support.textSpacingTrim) ||
      (options.preset.lineStartTrim && !support.textSpacingTrimStart) ||
      (trimsLineEnds(options) && !support.textSpacingTrimBoth)
  );
}

export function requiresAutospaceFallback(
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): boolean {
  return Boolean(
    options.preset.autospace &&
      options.precision !== "native" &&
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

interface TextPlan {
  tokens: readonly MojikumiToken[];
  decorations: Map<number, TokenDecoration>;
  /** Start offset of an unbreakable run, to the run itself. */
  runs: Map<number, UnbreakableRun>;
}

function planFor(
  text: string,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): TextPlan | undefined {
  const clusterFallback =
    options.preset.punctuationClusters &&
    requiresPunctuationFallback(options, support);
  const autospaceFallback = requiresAutospaceFallback(options, support);
  const lineFallback = requiresPunctuationFallback(options, support);
  /*
   * Only a justified block needs this: it is the stretching that makes a long
   * URL expensive, and breaking one in ragged text would cost the reader a
   * legible address for nothing.
   */
  const wantsRuns =
    options.preset.justify && MACHINE_MARK_PATTERN.test(text);

  if (!clusterFallback && !autospaceFallback && !lineFallback && !wantsRuns) {
    return undefined;
  }

  /*
   * Where the preset hangs punctuation and the browser can do it, the line-end
   * work is split by what each mechanism can reach: hanging takes the stops
   * and commas — every one of them, since the preset asks with `force-end` —
   * and the trim keeps the closing brackets, which hanging-punctuation has no
   * value for. Handing the stops over is not just avoiding double payment: a
   * hung glyph takes no space in the line, so it cannot re-break anything, and
   * the one class of line end the trim keeps losing to instability is exactly
   * the class hanging settles for free. `full` rehearses a browser that has
   * neither feature, so there the trim plays every part.
   */
  const hangsStops =
    Boolean(options.preset.hanging) &&
    support.hangingPunctuation &&
    options.precision !== "full";

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
      trimsLineEnds(options) &&
      (token.class === "closing" ||
        (!hangsStops &&
          (token.class === "comma" || token.class === "period")));

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

  const runs = new Map<number, UnbreakableRun>();
  if (wantsRuns) {
    for (const run of computeUnbreakableRuns(analysis.tokens)) {
      runs.set(run.offset, run);
    }
  }

  return { tokens: analysis.tokens, decorations: result, runs };
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

/**
 * Wraps a run whole, and marks the places inside it where a break would land
 * on a boundary the address itself has. `<wbr>` rather than a character: it is
 * an element, so it contributes nothing to `textContent` and nothing to what a
 * reader copies. Breaking it into one span per character would instead let the
 * browser break between any two of them, which is the opposite of the point.
 */
function createRunSpan(
  document: Document,
  value: string,
  run: UnbreakableRun,
  decoration: TokenDecoration | undefined
): HTMLSpanElement {
  const span = document.createElement("span");
  span.dataset.mjkGenerated = "";
  span.classList.add("mjk-long-run");
  if (decoration?.autospaceBefore) span.classList.add("mjk-autospace-before");

  let cursor = 0;
  for (const offset of run.breaks) {
    const at = offset - run.offset;
    span.append(document.createTextNode(value.slice(cursor, at)));
    span.append(document.createElement("wbr"));
    cursor = at;
  }
  span.append(document.createTextNode(value.slice(cursor)));
  return span;
}

function transformTextNode(
  node: Text,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): void {
  const plan = planFor(node.data, options, support);
  if (!plan || (plan.decorations.size === 0 && plan.runs.size === 0)) return;

  const { tokens, decorations, runs } = plan;
  const fragment = node.ownerDocument.createDocumentFragment();
  let textBuffer = "";

  const flush = () => {
    if (!textBuffer) return;
    fragment.append(node.ownerDocument.createTextNode(textBuffer));
    textBuffer = "";
  };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!;
    const run = runs.get(token.offset);

    if (run !== undefined) {
      const runEnd = run.offset + run.length;
      flush();
      while (index + 1 < tokens.length && tokens[index + 1]!.offset < runEnd) {
        index += 1;
      }
      fragment.append(
        createRunSpan(
          node.ownerDocument,
          node.data.slice(token.offset, runEnd),
          run,
          decorations.get(token.offset)
        )
      );
      continue;
    }

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
  for (const block of root.querySelectorAll(`.${OVERSTRETCHED}`)) {
    block.classList.remove(OVERSTRETCHED);
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

/**
 * How full the least-filled line of a block has to be for justification to be
 * worth keeping, as a fraction of the measure.
 *
 * Measured on Chromium 148 over widths from 12em to 30em: ordinary Japanese
 * fills every line to 95% or more, while the lines that justification wrecked —
 * the four or five characters left in front of something unbreakable — filled
 * about a quarter. There is a wide, empty gap between the two, so the threshold
 * does not have to be precise, only inside it.
 */
const JUSTIFY_MIN_FILL = 0.7;

const OVERSTRETCHED = "mjk-overstretched";

/*
 * The two questions asked of a block's alignment, and both refuse to act on an
 * answer they did not get. An environment without a layout engine reports an
 * empty string, so `justify` is what the browser positively says is justified,
 * and `ragged` what it positively says is not.
 */
function alignmentOf(view: Window, block: Element): string {
  return view.getComputedStyle(block).textAlign;
}

function isJustified(view: Window, block: Element): boolean {
  return alignmentOf(view, block) === "justify";
}

function isRagged(view: Window, block: Element): boolean {
  const alignment = alignmentOf(view, block);
  return alignment !== "" && alignment !== "justify";
}

function contentWidth(view: Window, block: HTMLElement): number {
  const style = view.getComputedStyle(block);
  const padding =
    Number.parseFloat(style.paddingInlineStart || "0") +
    Number.parseFloat(style.paddingInlineEnd || "0");
  return block.clientWidth - (Number.isFinite(padding) ? padding : 0);
}

/**
 * Groups the block's client rects into lines and asks whether the emptiest of
 * them, the last excepted, is full enough to justify. One rect per inline box
 * rather than one per character, so the cost follows the markup, not the text.
 */
function fillsItsLines(view: Window, block: HTMLElement): boolean {
  const width = contentWidth(view, block);
  if (!(width > 0)) return true;

  const range = block.ownerDocument.createRange();
  range.selectNodeContents(block);
  const getClientRects = (
    range as Range & { getClientRects?: () => DOMRectList }
  ).getClientRects;
  if (typeof getClientRects !== "function") return true;
  const rects = getClientRects.call(range);

  const lines = new Map<number, { min: number; max: number }>();
  for (let index = 0; index < rects.length; index += 1) {
    const rect = rectAt(rects, index);
    if (!rect || (rect.width === 0 && rect.height === 0)) continue;
    const line = lines.get(Math.round(rect.top));
    if (line) {
      line.min = Math.min(line.min, rect.left);
      line.max = Math.max(line.max, rect.right);
    } else {
      lines.set(Math.round(rect.top), { min: rect.left, max: rect.right });
    }
  }
  if (lines.size < 2) return true;

  /* The last line is ragged in any setting, so it is not evidence. */
  const tops = [...lines.keys()].sort((a, b) => a - b).slice(0, -1);
  return tops.every((top) => {
    const line = lines.get(top)!;
    return (line.max - line.min) / width >= JUSTIFY_MIN_FILL;
  });
}

/**
 * Takes justification back from any block the browser cannot fill.
 *
 * Long URLs are wrapped so they can break, which covers what a page usually
 * throws at a justified line. This is for the rest: a very long word, a narrow
 * measure, a table of contents where every line is short. Giving up on the
 * block is better than the alternative, because a line stretched to four times
 * its natural spacing is worse than a ragged right edge.
 */
export function measureJustification(root: Element): void {
  const view = root.ownerDocument.defaultView;
  if (!view) return;

  const blocks = [...root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)].filter(
    (block) => block.closest(".mjk") === root
  );
  if (blocks.length === 0) return;

  for (const block of blocks) block.classList.remove(OVERSTRETCHED);

  const justified = blocks.filter((block) => {
    /* Vertical writing is measured on the other axis; not yet supported. */
    const writingMode = view.getComputedStyle(block).writingMode;
    if (writingMode.startsWith("vertical")) return false;
    return isJustified(view, block);
  });
  if (justified.length === 0) return;

  for (const block of justified) block.classList.add(OVERSTRETCHED);
  const keep = justified.filter((block) => fillsItsLines(view, block));
  for (const block of keep) block.classList.remove(OVERSTRETCHED);
}

interface LineDecision {
  token: HTMLElement;
  paragraphStart: boolean;
  wrappedLineStart: boolean;
  lineEnd: boolean;
}

/*
 * An adjustment can invalidate its own reason: pulling a line-final comma in by
 * a half-em can free exactly enough room for a half-width digit to join the
 * line, and the comma the measurement called line-final is now mid-line. Worse,
 * the escape is circular — withdrawing the trim sends the digit back down, and
 * the line is asking to be trimmed again. Measuring every candidate at once and
 * then reconciling cannot settle this: each layout demands the other's
 * adjustments, and a reconciliation that can only withdraw ends up stripping
 * most of a paragraph that was composed correctly.
 *
 * What does settle it is the browser's own line breaker being greedy. Lines are
 * broken front to back, so a margin on a token can only move the breaks on its
 * own line and after it — everything decided earlier stays where it is. The
 * candidates are therefore settled in document order, each measured in the
 * layout that every earlier decision has already produced, and each application
 * checked once against itself: an adjustment that survives cannot be disturbed
 * again, and one that undoes its own reason is withdrawn on the spot and stays
 * withdrawn — that cycle has no other exit, and the safe state is the line as
 * the browser composed it.
 */
const WALK_PASSES = 3;

/** Reads geometry. Writing anything here would cost a layout per token. */
function readLineContext(
  root: Element,
  view: Window,
  decision: LineDecision,
  ragged: (token: Element) => boolean
): { wrappedLineStart: boolean; lineEnd: boolean } {
  const { token } = decision;
  const rect = rectAt(token.getClientRects(), 0);
  if (!rect || (rect.width === 0 && rect.height === 0)) {
    return { wrappedLineStart: false, lineEnd: false };
  }
  const writingMode = view.getComputedStyle(token).writingMode;
  let wrappedLineStart = false;
  let lineEnd = false;

  if (
    !decision.paragraphStart &&
    token.hasAttribute("data-mjk-line-start-candidate")
  ) {
    const previous = getTextRect(root, token, "previous");
    wrappedLineStart = Boolean(
      previous && !sameLine(rect, previous, writingMode)
    );
  }
  /*
   * The preset asked for justified text; the page may have said otherwise, and
   * the page wins. Trimming a line-final comma in a block that ended up ragged
   * moves nothing and can only talk the browser into a different break.
   */
  if (token.hasAttribute("data-mjk-line-end-candidate") && !ragged(token)) {
    const next = getTextRect(root, token, "next");
    lineEnd = Boolean(next && !sameLine(rect, next, writingMode));
  }

  return { wrappedLineStart, lineEnd };
}

function applyLineContext(decision: LineDecision): void {
  const { token, paragraphStart, wrappedLineStart, lineEnd } = decision;
  token.classList.toggle("mjk-line-start", paragraphStart || wrappedLineStart);
  token.classList.toggle("mjk-wrapped-line-start", wrappedLineStart);
  token.classList.toggle("mjk-line-end", lineEnd);

  if (paragraphStart) token.dataset.mjkContext = "paragraph-start";
  else if (wrappedLineStart) token.dataset.mjkContext = "wrapped-line-start";
  else if (lineEnd) token.dataset.mjkContext = "line-end";
  else delete token.dataset.mjkContext;
}

export function measureLineContext(root: Element): void {
  const view = root.ownerDocument.defaultView;
  if (!view) return;

  const candidates = [
    ...root.querySelectorAll<HTMLElement>(
      "[data-mjk-line-start-candidate],[data-mjk-line-end-candidate]"
    )
  ].filter((token) => token.closest(".mjk") === root);
  if (candidates.length === 0) return;

  /*
   * Clear first, then measure, then apply. Interleaving the three would measure
   * each token in a layout that the tokens before it had already moved.
   */
  for (const token of candidates) {
    token.classList.remove(
      "mjk-line-start",
      "mjk-wrapped-line-start",
      "mjk-line-end"
    );
    delete token.dataset.mjkContext;
  }

  const decisions: LineDecision[] = candidates.map((token) => ({
    token,
    paragraphStart:
      token.hasAttribute("data-mjk-line-start-candidate") &&
      !hasPreviousTextInBlock(root, token),
    wrappedLineStart: false,
    lineEnd: false
  }));

  const raggedBlocks = new Map<Element, boolean>();
  const ragged = (token: Element) => {
    const block = blockOf(root, token);
    let value = raggedBlocks.get(block);
    if (value === undefined) {
      value = isRagged(view, block);
      raggedBlocks.set(block, value);
    }
    return value;
  };

  /*
   * A batched first pass: read every candidate against the clean layout, then
   * write once. Most decisions survive the walk below untouched, so this puts
   * the common case at two layouts instead of one per candidate.
   */
  for (const decision of decisions) {
    const read = readLineContext(root, view, decision, ragged);
    decision.wrappedLineStart = read.wrappedLineStart;
    decision.lineEnd = read.lineEnd;
  }
  for (const decision of decisions) applyLineContext(decision);

  /*
   * The document-order walk. `candidates` came from querySelectorAll, so the
   * decisions are already in document order. A decision that undid its own
   * reason is remembered and not offered again: without that, every later pass
   * would replay its apply-and-withdraw at two layouts a try.
   *
   * The walk repeats while it is still changing something, because a
   * withdrawal early in the text can re-break the lines after it and leave a
   * candidate the walk had already passed sitting untrimmed on a boundary. A
   * pass that changes nothing reads a settled layout and writes nothing, so
   * the common case stays at one pass.
   */
  const vetoed = new Set<LineDecision>();
  for (let pass = 0; pass < WALK_PASSES; pass += 1) {
    let changed = false;

    for (const decision of decisions) {
      const read = readLineContext(root, view, decision, ragged);
      const wantStart = read.wrappedLineStart && !vetoed.has(decision);
      const wantEnd = read.lineEnd && !vetoed.has(decision);
      if (
        wantStart === decision.wrappedLineStart &&
        wantEnd === decision.lineEnd
      ) {
        continue;
      }

      changed = true;
      decision.wrappedLineStart = wantStart;
      decision.lineEnd = wantEnd;
      applyLineContext(decision);

      if (wantStart || wantEnd) {
        const again = readLineContext(root, view, decision, ragged);
        if (
          (wantStart && !again.wrappedLineStart) ||
          (wantEnd && !again.lineEnd)
        ) {
          decision.wrappedLineStart = false;
          decision.lineEnd = false;
          applyLineContext(decision);
          vetoed.add(decision);
        }
      }
    }

    if (!changed) break;
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
