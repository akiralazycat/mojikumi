"use client";

import { useMemo } from "react";
import type { ChemReaction } from "../lib/chem-model";
import {
  buildElementBalance,
  getSpecies,
  speciesContainsElement,
  speciesRefKey,
  type SpeciesRef
} from "../lib/reaction-awareness";
import { ChemicalDisplay } from "./chemical-display";

type BalanceProposal = {
  source: string;
  coefficients: number[];
  condition: string;
};

function sameSpecies(left: SpeciesRef | null, right: SpeciesRef) {
  return left?.side === right.side && left.index === right.index;
}

function sideLabel(side: SpeciesRef["side"]) {
  return side === "reactant" ? "反応物" : "生成物";
}

export function ReactionNavigator({
  reaction,
  selectedElement,
  selectedSpecies,
  balanceProposal,
  balancePreviewOpen,
  onSelectElement,
  onSelectSpecies,
  onOpenBalancePreview,
  onCloseBalancePreview,
  onApplyBalance
}: {
  reaction: ChemReaction;
  selectedElement: string | null;
  selectedSpecies: SpeciesRef | null;
  balanceProposal: BalanceProposal | null;
  balancePreviewOpen: boolean;
  onSelectElement: (element: string | null) => void;
  onSelectSpecies: (species: SpeciesRef | null) => void;
  onOpenBalancePreview: () => void;
  onCloseBalancePreview: () => void;
  onApplyBalance: () => void;
}) {
  const balanceRows = useMemo(() => buildElementBalance(reaction), [reaction]);
  const selected = getSpecies(reaction, selectedSpecies);

  const renderSpecies = (side: SpeciesRef["side"], index: number) => {
    const species = side === "reactant" ? reaction.reactants[index] : reaction.products[index];
    if (!species) return null;
    const ref = { side, index } satisfies SpeciesRef;
    const related = selectedElement ? speciesContainsElement(species, selectedElement) : false;
    const active = sameSpecies(selectedSpecies, ref);
    return (
      <button
        type="button"
        className="reaction-species"
        key={speciesRefKey(ref)}
        aria-pressed={active}
        aria-label={`${sideLabel(side)} ${species.source}`}
        data-related={related ? "true" : undefined}
        onClick={() => onSelectSpecies(active ? null : ref)}
      >
        <span className="reaction-species-kind">{sideLabel(side)}</span>
        <ChemicalDisplay value={species.source} />
      </button>
    );
  };

  return (
    <section className="reaction-navigator" aria-label="反応式の構造">
      <div className="reaction-navigator-heading">
        <div>
          <p className="panel-kicker">Reaction structure</p>
          <h3>反応式を意味からたどる</h3>
        </div>
        {balanceProposal && !balancePreviewOpen && (
          <button type="button" className="balance-preview-trigger" onClick={onOpenBalancePreview}>
            係数案を見る
          </button>
        )}
      </div>

      <div className="reaction-structure" aria-label="反応物と生成物">
        <div className="reaction-side" role="group" aria-label="反応物">
          <span className="reaction-side-label">反応物</span>
          <div className="reaction-species-list">
            {reaction.reactants.map((_, index) => renderSpecies("reactant", index))}
          </div>
        </div>
        <div className="reaction-arrow-card" aria-label={`反応矢印 ${reaction.arrow}`}>
          <strong>{reaction.arrow}</strong>
          <span>{reaction.condition || "条件なし"}</span>
        </div>
        <div className="reaction-side" role="group" aria-label="生成物">
          <span className="reaction-side-label">生成物</span>
          <div className="reaction-species-list">
            {reaction.products.map((_, index) => renderSpecies("product", index))}
          </div>
        </div>
      </div>

      <div className="element-ledger">
        <div className="element-ledger-heading">
          <strong>元素収支</strong>
          <span>{selectedElement ? `${selectedElement} を含む物質を強調中` : "元素を選ぶと関係する物質を追跡できます"}</span>
        </div>
        <div className="element-ledger-list" role="group" aria-label="元素ごとの左右収支">
          {balanceRows.map((row) => {
            const active = selectedElement === row.element;
            const deltaLabel = row.delta === 0
              ? "一致"
              : row.delta > 0
                ? `生成物に${row.delta}多い`
                : `反応物に${Math.abs(row.delta)}多い`;
            return (
              <button
                key={row.element}
                type="button"
                className="element-ledger-row"
                aria-pressed={active}
                aria-label={`${row.element}の収支 反応物${row.reactantCount} 生成物${row.productCount} ${deltaLabel}`}
                data-balanced={row.balanced ? "true" : "false"}
                onClick={() => onSelectElement(active ? null : row.element)}
              >
                <strong>{row.element}</strong>
                <span>{row.reactantCount}</span>
                <span aria-hidden="true">→</span>
                <span>{row.productCount}</span>
                <small>{row.delta === 0 ? "一致" : row.delta > 0 ? `+${row.delta}` : row.delta}</small>
              </button>
            );
          })}
        </div>
      </div>

      {selected && selectedSpecies && (
        <div className="species-detail" aria-live="polite">
          <div>
            <span>{sideLabel(selectedSpecies.side)}</span>
            <strong>{selected.source}</strong>
          </div>
          <dl>
            <div><dt>係数</dt><dd>{selected.coefficient}</dd></div>
            <div><dt>電荷</dt><dd>{selected.charge > 0 ? `+${selected.charge}` : selected.charge}</dd></div>
            <div><dt>状態</dt><dd>{selected.state ? `(${selected.state})` : "指定なし"}</dd></div>
            <div><dt>元素</dt><dd>{Object.entries(selected.atoms).map(([element, count]) => `${element}${count}`).join(" · ")}</dd></div>
          </dl>
        </div>
      )}

      {balanceProposal && balancePreviewOpen && (
        <div className="balance-proposal" role="region" aria-label="係数案">
          <div className="balance-proposal-copy">
            <span>適用前プレビュー</span>
            <strong>最小の整数比 {balanceProposal.coefficients.join(" : ")}</strong>
            <p>元の式はまだ変更していません。</p>
          </div>
          <div className="balance-proposal-formula">
            <ChemicalDisplay value={balanceProposal.source} condition={balanceProposal.condition} />
          </div>
          <div className="balance-proposal-actions">
            <button type="button" className="secondary" onClick={onCloseBalancePreview}>閉じる</button>
            <button type="button" onClick={onApplyBalance}>この係数を適用</button>
          </div>
        </div>
      )}
    </section>
  );
}
