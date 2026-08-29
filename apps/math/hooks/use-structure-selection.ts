"use client";

import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  copySelection,
  readRange,
  selectionRange,
  type MathSelection,
  type MathfieldElement
} from "../lib/mathfield";
import type { SemanticSlot, SemanticStructureKind } from "../lib/math-structure";
import { createSemanticSearchCache, findSemanticSlot } from "../lib/structure-search";

export type SelectionSummary = {
  kind: "caret" | "element" | "structure";
  label: string;
};

export type SemanticTarget = `${SemanticStructureKind}:${SemanticSlot["id"]}`;

type SelectionHistoryEntry = {
  selection: MathSelection;
  semanticTarget: SemanticTarget | null;
};

const semanticKindLabels: Record<SemanticStructureKind, string> = {
  fraction: "分数",
  root: "根号",
  integral: "積分",
  sum: "総和・総乗"
};

function describeSelectedLatex(selectedLatex: string): SelectionSummary {
  const normalized = selectedLatex.trim().replace(/^\{\s*/, "").trim();
  if (/^\\(?:d?frac|tfrac)\b/.test(normalized)) {
    return { kind: "structure", label: "分数全体" };
  }
  if (/^\\(?:i{1,3}nt|oint)(?=[^a-zA-Z]|$)/.test(normalized)) {
    return { kind: "structure", label: "積分全体" };
  }
  if (/^\\(?:sum|prod)(?=[^a-zA-Z]|$)/.test(normalized)) {
    return { kind: "structure", label: "総和・総乗全体" };
  }
  if (/^\\sqrt\b/.test(normalized)) return { kind: "structure", label: "根号全体" };
  if (/^\\left\b/.test(normalized)) return { kind: "structure", label: "括弧全体" };
  return { kind: "element", label: "現在の要素" };
}

function describeSelection(field: MathfieldElement): SelectionSummary {
  if (field.selectionIsCollapsed) return { kind: "caret", label: "カーソル" };
  return describeSelectedLatex(readRange(field, copySelection(field.selection)));
}

function sameSelection(left: MathSelection | null, right: MathSelection) {
  if (!left) return false;
  const leftRange = left.ranges[0];
  const rightRange = right.ranges[0];
  return Boolean(
    leftRange &&
    rightRange &&
    leftRange[0] === rightRange[0] &&
    leftRange[1] === rightRange[1]
  );
}

/**
 * Selection state for the structure navigator: what is selected now, how far
 * the writer has widened it, and which named slot they last jumped to.
 */
export function useStructureSelection(
  fieldRef: RefObject<MathfieldElement | null>,
  announce: (message: string) => void
) {
  const historyRef = useRef<SelectionHistoryEntry[]>([]);
  const semanticSelectionRef = useRef<MathSelection | null>(null);
  const searchCacheRef = useRef(createSemanticSearchCache());
  const [summary, setSummary] = useState<SelectionSummary>({ kind: "caret", label: "カーソル" });
  const [depth, setDepth] = useState(0);
  const [semanticTarget, setSemanticTarget] = useState<SemanticTarget | null>(null);

  const reset = useCallback(() => {
    historyRef.current = [];
    semanticSelectionRef.current = null;
    setDepth(0);
    setSemanticTarget(null);
  }, []);

  const sync = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    const currentSelection = copySelection(field.selection);
    if (semanticSelectionRef.current && !sameSelection(semanticSelectionRef.current, currentSelection)) {
      semanticSelectionRef.current = null;
      setSemanticTarget(null);
    }
    setSummary(describeSelection(field));
  }, [fieldRef]);

  const move = useCallback((command: "moveUp" | "moveDown", label: string) => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const moved = field.executeCommand(command);
    reset();
    setSummary(describeSelection(field));
    announce(moved ? `${label}へ移動しました。` : `${label}はありません。`);
  }, [announce, fieldRef, reset]);

  const selectCurrentElement = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    if (!field.selectionIsCollapsed) field.position = field.selection.ranges[0]?.[1] ?? field.position;
    field.executeCommand("moveToGroupStart");
    const start = field.position;
    field.executeCommand("moveToGroupEnd");
    const end = field.position;
    if (start === end) {
      field.executeCommand("selectGroup");
    } else {
      field.selection = { ranges: [[start, end]], direction: "forward" };
    }
    reset();
    const selected = describeSelection(field);
    setSummary(selected);
    announce(`${selected.label}を選択しました。`);
  }, [announce, fieldRef, reset]);

  const selectOuterStructure = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const previous = copySelection(field.selection);
    const [start, end] = selectionRange(field);
    const current = describeSelection(field);
    const minimumSpan = Math.max(1, end - start) + (current.kind === "structure" ? 1 : 0);
    let candidate: MathSelection | null = null;
    let candidateSummary: SelectionSummary | null = null;
    let checks = 0;
    for (let span = minimumSpan; span <= field.lastOffset && checks < 6000; span += 1) {
      const firstStart = Math.max(0, end - span);
      const lastStart = Math.min(start, field.lastOffset - span);
      for (let candidateStart = lastStart; candidateStart >= firstStart; candidateStart -= 1) {
        checks += 1;
        const inspected: MathSelection = {
          ranges: [[candidateStart, candidateStart + span]],
          direction: "forward"
        };
        const inspectedSummary = describeSelectedLatex(readRange(field, inspected));
        if (inspectedSummary.kind !== "structure") continue;
        candidate = inspected;
        candidateSummary = inspectedSummary;
        break;
      }
      if (candidate) break;
    }
    if (!candidate || candidateSummary?.kind !== "structure") {
      field.selection = previous;
      announce("これ以上外側の構造はありません。");
      return;
    }
    historyRef.current.push({ selection: previous, semanticTarget });
    setDepth(historyRef.current.length);
    semanticSelectionRef.current = null;
    setSemanticTarget(null);
    field.selection = candidate;
    setSummary(candidateSummary);
    announce(`${candidateSummary.label}へ選択を広げました。`);
  }, [announce, fieldRef, semanticTarget]);

  const selectInnerStructure = useCallback(() => {
    const field = fieldRef.current;
    const previous = historyRef.current.pop();
    if (!field || !previous) return;
    field.focus();
    if (previous.semanticTarget) {
      semanticSelectionRef.current = copySelection(previous.selection);
      setSemanticTarget(previous.semanticTarget);
    } else {
      semanticSelectionRef.current = null;
      setSemanticTarget(null);
    }
    field.selection = previous.selection;
    setDepth(historyRef.current.length);
    const restored = describeSelection(field);
    setSummary(restored);
    announce(`${restored.label}へ戻りました。`);
  }, [announce, fieldRef]);

  const selectSemanticSlot = useCallback((
    kind: SemanticStructureKind,
    slotId: SemanticSlot["id"]
  ) => {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const found = findSemanticSlot(field, kind, slotId, searchCacheRef.current);
    if (!found) {
      announce(`選択できる${semanticKindLabels[kind]}要素がありません。`);
      return;
    }
    if (!found.selection) {
      announce(`${found.slot.label}はまだ入力されていません。`);
      return;
    }
    reset();
    const target: SemanticTarget = `${kind}:${found.slot.id}`;
    semanticSelectionRef.current = copySelection(found.selection);
    setSemanticTarget(target);
    field.selection = found.selection;
    const label = `${found.structure.label}・${found.slot.label}`;
    setSummary({ kind: "element", label });
    announce(`${label}を選択しました。`);
  }, [announce, fieldRef, reset]);

  return {
    summary,
    depth,
    semanticTarget,
    reset,
    sync,
    move,
    selectCurrentElement,
    selectOuterStructure,
    selectInnerStructure,
    selectSemanticSlot
  };
}
