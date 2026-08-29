import {
  copySelection,
  readRange,
  selectionRange,
  type MathSelection,
  type MathfieldElement
} from "./mathfield";
import {
  normalizeSlotLatex,
  parseSemanticStructure,
  structureKindsIn,
  type SemanticSlot,
  type SemanticStructure,
  type SemanticStructureKind
} from "./math-structure";

export type SemanticCandidate = {
  selection: MathSelection;
  structure: SemanticStructure;
  start: number;
  end: number;
  span: number;
  filledSlots: number;
  contentLength: number;
};

export type SemanticSearchCache = {
  latex: string | null;
  candidates: Map<SemanticStructureKind, SemanticCandidate[]>;
};

export function createSemanticSearchCache(): SemanticSearchCache {
  return { latex: null, candidates: new Map() };
}

/** How far past a start offset a structure has to become recognizable. */
const structureLookahead = 64;

/** Ceiling on range reads per kind, so a pathological expression cannot hang. */
const maxRangeChecks = 12_000;

const traversalOrderByKind: Record<SemanticStructureKind, SemanticSlot["id"][]> = {
  fraction: ["numerator", "denominator"],
  root: ["index", "radicand"],
  integral: ["upper", "lower", "body", "variable"],
  sum: ["upper", "lower", "body"]
};

const differentialPrefixPattern = /(?:\\[,!;:]\s*)?(?:d|\\mathrm\s*\{\s*d\s*\}|\\operatorname\s*\{\s*d\s*\})\s*$/u;
const differentialSuffixPattern = /^\s*(?:\\[,!;:]\s*)?(?:d|\\mathrm\s*\{\s*d\s*\}|\\operatorname\s*\{\s*d\s*\})/u;

function countFilledSlots(structure: SemanticStructure) {
  return structure.slots.filter((slot) => normalizeSlotLatex(slot.latex)).length;
}

function measureContent(structure: SemanticStructure) {
  return structure.slots.reduce(
    (total, slot) => total + normalizeSlotLatex(slot.latex).length,
    0
  );
}

/**
 * Find the structures of each kind by testing ranges of the field.
 *
 * The field's offsets do not line up with positions in its own LaTeX — a
 * structure's scripts are serialized before the operator that owns them — so
 * the ranges have to be read from the field rather than derived from LaTeX.
 * One pass covers every kind the expression contains, and the result is cached
 * until the expression changes.
 */
function searchStructureStarts(
  field: MathfieldElement,
  kinds: SemanticStructureKind[]
) {
  const starts = new Map<SemanticStructureKind, number[]>(kinds.map((kind) => [kind, []]));
  const continuing = new Set<SemanticStructureKind>();
  for (let start = 0; start < field.lastOffset; start += 1) {
    const found = new Set<SemanticStructureKind>();
    const lookaheadEnd = Math.min(field.lastOffset, start + structureLookahead);
    for (let end = start + 1; end <= lookaheadEnd && found.size < kinds.length; end += 1) {
      const preview = readRange(field, { ranges: [[start, end]], direction: "forward" });
      const kind = parseSemanticStructure(preview)?.kind;
      if (kind && kinds.includes(kind)) found.add(kind);
    }
    for (const kind of kinds) {
      if (!found.has(kind)) {
        continuing.delete(kind);
        continue;
      }
      if (!continuing.has(kind)) starts.get(kind)?.push(start);
      continuing.add(kind);
    }
  }
  return starts;
}

function searchCandidates(field: MathfieldElement) {
  const kinds = structureKindsIn(field.value);
  const candidates = new Map<SemanticStructureKind, SemanticCandidate[]>();
  if (kinds.length === 0) return candidates;
  const starts = searchStructureStarts(field, kinds);
  for (const kind of kinds) {
    const found: SemanticCandidate[] = [];
    const kindStarts = starts.get(kind)?.length
      ? starts.get(kind) ?? []
      : Array.from({ length: field.lastOffset }, (_, index) => index);
    let checks = 0;
    for (const start of kindStarts) {
      for (let end = start + 1; end <= field.lastOffset && checks < maxRangeChecks; end += 1) {
        checks += 1;
        const selection: MathSelection = { ranges: [[start, end]], direction: "forward" };
        const structure = parseSemanticStructure(readRange(field, selection));
        if (structure?.kind !== kind) continue;
        found.push({
          selection,
          structure,
          start,
          end,
          span: end - start,
          filledSlots: countFilledSlots(structure),
          contentLength: measureContent(structure)
        });
      }
    }
    candidates.set(kind, found);
  }
  return candidates;
}

function getCandidates(
  field: MathfieldElement,
  kind: SemanticStructureKind,
  cache: SemanticSearchCache
) {
  if (cache.latex !== field.value) {
    cache.latex = field.value;
    cache.candidates = searchCandidates(field);
  }
  return cache.candidates.get(kind) ?? [];
}

function findStructure(
  field: MathfieldElement,
  kind: SemanticStructureKind,
  slotId: SemanticSlot["id"],
  cache: SemanticSearchCache
) {
  const [currentStart, currentEnd] = selectionRange(field);
  type RankedCandidate = SemanticCandidate & {
    containsCurrent: boolean;
    distance: number;
    boundaryAffinity: number;
    startDistance: number;
    targetFilled: boolean;
    targetLength: number;
  };
  const isBetterCandidate = (candidate: RankedCandidate, best: RankedCandidate | null) => {
    if (!best) return true;
    if (candidate.containsCurrent !== best.containsCurrent) return candidate.containsCurrent;
    if (candidate.distance !== best.distance) return candidate.distance < best.distance;
    if (candidate.targetFilled !== best.targetFilled) return candidate.targetFilled;
    // A complete structure is more trustworthy than a shorter prefix that can
    // already be parsed as the same operator. This is especially important for
    // integral bodies, where a truncated candidate can absorb the differential.
    if (candidate.filledSlots !== best.filledSlots) return candidate.filledSlots > best.filledSlots;
    if (candidate.boundaryAffinity !== best.boundaryAffinity) {
      return candidate.boundaryAffinity > best.boundaryAffinity;
    }
    if (candidate.startDistance !== best.startDistance) return candidate.startDistance < best.startDistance;
    if (candidate.contentLength !== best.contentLength) return candidate.contentLength > best.contentLength;
    if (candidate.targetLength !== best.targetLength) return candidate.targetLength < best.targetLength;
    return candidate.span < best.span;
  };
  let best: RankedCandidate | null = null;
  for (const base of getCandidates(field, kind, cache)) {
    const targetSlot = base.structure.slots.find((slot) => slot.id === slotId);
    if (!targetSlot) continue;
    const targetValue = normalizeSlotLatex(targetSlot.latex);
    const { start, end } = base;
    const containsCurrent = start <= currentStart && end >= currentEnd;
    const distance = containsCurrent
      ? 0
      : Math.min(Math.abs(start - currentEnd), Math.abs(end - currentStart));
    const candidate = {
      ...base,
      containsCurrent,
      distance,
      targetFilled: targetValue.length > 0,
      targetLength: targetValue.length,
      boundaryAffinity: currentStart === currentEnd && end === currentStart ? 1 : 0,
      startDistance: start <= currentStart ? currentStart - start : start - currentEnd
    };
    if (isBetterCandidate(candidate, best)) best = candidate;
  }
  return best;
}

function hasDifferentialBefore(
  field: MathfieldElement,
  selection: MathSelection,
  structureStart: number
) {
  const [start] = selection.ranges[0] ?? [structureStart, structureStart];
  for (let contextStart = Math.max(structureStart, start - 8); contextStart < start; contextStart += 1) {
    const prefix = readRange(field, { ranges: [[contextStart, start]], direction: "forward" });
    if (differentialPrefixPattern.test(prefix.trim())) return true;
  }
  return false;
}

function hasDifferentialAfter(
  field: MathfieldElement,
  selection: MathSelection,
  structureEnd: number
) {
  const [, end] = selection.ranges[0] ?? [structureEnd, structureEnd];
  for (let contextEnd = end + 1; contextEnd <= Math.min(structureEnd, end + 8); contextEnd += 1) {
    const suffix = readRange(field, { ranges: [[end, contextEnd]], direction: "forward" });
    if (differentialSuffixPattern.test(suffix)) return true;
  }
  return false;
}

function selectionSpan(selection: MathSelection) {
  const [start, end] = selection.ranges[0] ?? [0, 0];
  return Math.abs(end - start);
}

/**
 * Fallback slot search: find the offsets holding the slot content inside an
 * already-located structure.
 */
function searchSlotSelection(
  field: MathfieldElement,
  candidate: SemanticCandidate,
  slot: SemanticSlot
) {
  const [structureStart, structureEnd] = candidate.selection.ranges[0] ?? [0, field.lastOffset];
  const target = normalizeSlotLatex(slot.latex);
  if (!target) return null;
  const traversalOrder = traversalOrderByKind[candidate.structure.kind];
  const sameValueSlots = candidate.structure.slots
    .filter((other) => normalizeSlotLatex(other.latex) === target)
    .sort((left, right) => traversalOrder.indexOf(left.id) - traversalOrder.indexOf(right.id));
  const duplicateIndex = Math.max(0, sameValueSlots.findIndex((other) => other.id === slot.id));
  const matches: MathSelection[] = [];
  let checks = 0;
  for (let span = 1; span <= structureEnd - structureStart && checks < 4000; span += 1) {
    for (let start = structureStart; start + span <= structureEnd && checks < 4000; start += 1) {
      checks += 1;
      const selection: MathSelection = { ranges: [[start, start + span]], direction: "forward" };
      if (normalizeSlotLatex(readRange(field, selection)) !== target) continue;
      matches.push(selection);
    }
    // Non-integral slots only need the shortest exact matches. Integral body
    // and variable slots inspect a few more ranges so their differential
    // boundary can disambiguate MathLive offsets.
    if (
      matches.length > duplicateIndex &&
      !(candidate.structure.kind === "integral" && (slot.id === "body" || slot.id === "variable"))
    ) break;
  }

  const distinct = matches.reduce<MathSelection[]>((result, match) => {
    const [start, end] = match.ranges[0] ?? [0, 0];
    const duplicate = result.some((existing) => {
      const [existingStart, existingEnd] = existing.ranges[0] ?? [0, 0];
      return start === existingStart && end === existingEnd;
    });
    if (!duplicate) result.push(match);
    return result;
  }, []);

  if (candidate.structure.kind === "integral" && slot.id === "body") {
    const qualified = distinct
      .filter((selection) => hasDifferentialAfter(field, selection, structureEnd))
      .sort((left, right) => selectionSpan(left) - selectionSpan(right));
    if (qualified[0]) return qualified[0];
  }

  if (candidate.structure.kind === "integral" && slot.id === "variable") {
    const qualified = distinct
      .filter((selection) => hasDifferentialBefore(field, selection, structureStart))
      .sort((left, right) => {
        const spanDifference = selectionSpan(left) - selectionSpan(right);
        if (spanDifference) return spanDifference;
        return (right.ranges[0]?.[0] ?? 0) - (left.ranges[0]?.[0] ?? 0);
      });
    if (qualified[0]) return qualified[0];
    distinct.sort((left, right) => (left.ranges[0]?.[0] ?? 0) - (right.ranges[0]?.[0] ?? 0));
    return distinct.at(-1) ?? null;
  }

  distinct.sort((left, right) => {
    const spanDifference = selectionSpan(left) - selectionSpan(right);
    if (spanDifference) return spanDifference;
    return (left.ranges[0]?.[0] ?? 0) - (right.ranges[0]?.[0] ?? 0);
  });
  return distinct[duplicateIndex] ?? distinct[0] ?? null;
}

export type SemanticSlotMatch = {
  structure: SemanticStructure;
  slot: SemanticSlot;
  selection: MathSelection | null;
};

/**
 * Find the structure of `kind` nearest the caret and the selection covering
 * one of its named slots. `selection` is null when the slot exists but has not
 * been filled in yet.
 */
export function findSemanticSlot(
  field: MathfieldElement,
  kind: SemanticStructureKind,
  slotId: SemanticSlot["id"],
  cache: SemanticSearchCache
): SemanticSlotMatch | null {
  const candidate = findStructure(field, kind, slotId, cache);
  const slot = candidate?.structure.slots.find((entry) => entry.id === slotId);
  if (!candidate || !slot) return null;
  const selection = searchSlotSelection(field, candidate, slot);
  return {
    structure: candidate.structure,
    slot,
    selection: selection ? copySelection(selection) : null
  };
}
