"use client";

import type { SemanticSlot, SemanticStructureKind } from "../lib/math-structure";
import type { SelectionSummary, SemanticTarget } from "../hooks/use-structure-selection";

const semanticSlotControls: Record<SemanticStructureKind, Array<{ id: SemanticSlot["id"]; label: string }>> = {
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
  return (
    <div
      className={`structure-navigator structure-navigator-${summary.kind}`}
      role="group"
      aria-label="数式内の要素を選択"
    >
      <span className="selection-status" aria-hidden="true">
        <span className="selection-status-dot" />
        {summary.label}
        {depth > 0 && <small>外側 +{depth}</small>}
      </span>
      <div className="structure-navigator-actions">
        <button type="button" onClick={() => onMove("moveUp", "上の要素")}>上へ</button>
        <button type="button" onClick={() => onMove("moveDown", "下の要素")}>下へ</button>
        <button type="button" onClick={onSelectCurrent}>要素を選択</button>
        <button type="button" disabled={depth === 0} onClick={onSelectInner}>内側へ</button>
        <button type="button" onClick={onSelectOuter}>外側へ</button>
      </div>
      {kinds.length > 0 && (
        <div className="semantic-navigator" role="group" aria-label="数式構造の要素">
          {kinds.map((kind) => (
            <div
              className="semantic-navigator-row"
              key={kind}
              role="group"
              aria-label={kind === "integral" ? "積分の要素" : "シグマ・総乗の要素"}
            >
              <span aria-hidden="true">{kind === "integral" ? "積分" : "Σ / Π"}</span>
              <div>
                {semanticSlotControls[kind].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    aria-label={`${kind === "integral" ? "積分" : "シグマ"}の${slot.label}を選択`}
                    aria-pressed={semanticTarget === `${kind}:${slot.id}`}
                    onClick={() => onSelectSlot(kind, slot.id)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
