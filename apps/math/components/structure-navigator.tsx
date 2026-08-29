"use client";

import type { SemanticSlot, SemanticStructureKind } from "../lib/math-structure";
import type { SelectionSummary, SemanticTarget } from "../hooks/use-structure-selection";

type SlotControl = { id: SemanticSlot["id"]; label: string };

const semanticSlotControls: Record<SemanticStructureKind, SlotControl[]> = {
  fraction: [
    { id: "numerator", label: "分子" },
    { id: "denominator", label: "分母" }
  ],
  root: [
    { id: "index", label: "根指数" },
    { id: "radicand", label: "根号の中" }
  ],
  integral: [
    { id: "lower", label: "下限" },
    { id: "upper", label: "上限" },
    { id: "body", label: "式" },
    { id: "variable", label: "変数" }
  ],
  sum: [
    { id: "lower", label: "下側条件" },
    { id: "upper", label: "上限" },
    { id: "body", label: "総和式" }
  ]
};

const structureLabels: Record<SemanticStructureKind, { short: string; accessible: string }> = {
  fraction: { short: "分数", accessible: "分数" },
  root: { short: "根号", accessible: "根号" },
  integral: { short: "積分", accessible: "積分" },
  sum: { short: "Σ / Π", accessible: "総和・総乗" }
};

function selectionBreadcrumb(summary: SelectionSummary, semanticTarget: SemanticTarget | null) {
  if (semanticTarget) {
    const [kind, slotId] = semanticTarget.split(":") as [SemanticStructureKind, SemanticSlot["id"]];
    const slot = semanticSlotControls[kind].find((entry) => entry.id === slotId);
    return ["式", structureLabels[kind].accessible, slot?.label ?? summary.label];
  }
  return ["式", summary.label.replace(/全体$/u, "")];
}

function slotAriaLabel(kind: SemanticStructureKind, label: string) {
  if (kind === "sum") return `シグマの${label}を選択`;
  return `${structureLabels[kind].accessible}の${label}を選択`;
}

export function StructureNavigator({
  summary,
  depth,
  semanticTarget,
  kinds,
  onMove,
  onSelectCurrent,
  onSelectInner,
  onSelectOuter,
  onSelectSlot
}: {
  summary: SelectionSummary;
  depth: number;
  semanticTarget: SemanticTarget | null;
  kinds: SemanticStructureKind[];
  onMove: (command: "moveUp" | "moveDown", label: string) => void;
  onSelectCurrent: () => void;
  onSelectInner: () => void;
  onSelectOuter: () => void;
  onSelectSlot: (kind: SemanticStructureKind, slotId: SemanticSlot["id"]) => void;
}) {
  const breadcrumb = selectionBreadcrumb(summary, semanticTarget);

  return (
    <div
      className={`structure-navigator structure-navigator-${summary.kind}`}
      role="group"
      aria-label="数式内の要素を選択"
    >
      <div className="selection-context">
        <ol className="structure-breadcrumb" aria-label="現在の数式構造">
          {breadcrumb.map((label, index) => (
            <li key={`${label}-${index}`} aria-current={index === breadcrumb.length - 1 ? "location" : undefined}>
              {label}
            </li>
          ))}
        </ol>
        <span className="selection-status" aria-hidden="true">
          <span className="selection-status-dot" />
          {summary.label}
          {depth > 0 && <small>外側 +{depth}</small>}
        </span>
      </div>
      <div className="structure-navigator-actions">
        <button type="button" onClick={() => onMove("moveUp", "上の要素")}>上へ</button>
        <button type="button" onClick={() => onMove("moveDown", "下の要素")}>下へ</button>
        <button type="button" onClick={onSelectCurrent}>要素を選択</button>
        <button type="button" disabled={depth === 0} onClick={onSelectInner}>内側へ</button>
        <button type="button" onClick={onSelectOuter}>外側へ</button>
      </div>
      {kinds.length > 0 && (
        <div className="semantic-navigator" role="group" aria-label="数式構造の要素">
          {kinds.map((kind) => {
            const structureLabel = structureLabels[kind];
            return (
              <div
                className="semantic-navigator-row"
                key={kind}
                role="group"
                aria-label={`${structureLabel.accessible}の要素`}
              >
                <span aria-hidden="true">{structureLabel.short}</span>
                <div>
                  {semanticSlotControls[kind].map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      aria-label={slotAriaLabel(kind, slot.label)}
                      aria-pressed={semanticTarget === `${kind}:${slot.id}`}
                      onClick={() => onSelectSlot(kind, slot.id)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
