"use client";

import type { KeyboardEvent } from "react";
import type { ChemAiAction } from "../lib/chemistry";

export const chemOutputKinds = ["plain", "mhchem", "latex", "markdown", "html", "json"] as const;
export type ChemVisibleOutputKind = (typeof chemOutputKinds)[number];

export const chemOutputLabels: Record<ChemVisibleOutputKind, string> = {
  plain: "テキスト",
  mhchem: "mhchem",
  latex: "LaTeX",
  markdown: "Markdown",
  html: "HTML",
  json: "JSON"
};

const outputGroups: Array<{
  label: string;
  description: string;
  kinds: ChemVisibleOutputKind[];
}> = [
  {
    label: "よく使う",
    description: "文書・教材・TeXへ持ち出す基本形式",
    kinds: ["plain", "mhchem", "latex", "markdown"]
  },
  {
    label: "詳細",
    description: "Web・機械処理向け",
    kinds: ["html", "json"]
  }
];

const aiActions: Array<{ value: ChemAiAction; label: string }> = [
  { value: "explain", label: "説明する" },
  { value: "balance", label: "係数を整える" },
  { value: "name", label: "物質名を調べる" },
  { value: "analyze", label: "反応を分析する" }
];

export function ChemOutputPanel({
  hasSource,
  outputKind,
  onOutputKindChange,
  aiEnabled,
  onAiEnabledChange,
  aiAction,
  onAiActionChange,
  output,
  copyState,
  onCopy
}: {
  hasSource: boolean;
  outputKind: ChemVisibleOutputKind;
  onOutputKindChange: (kind: ChemVisibleOutputKind) => void;
  aiEnabled: boolean;
  onAiEnabledChange: (enabled: boolean) => void;
  aiAction: ChemAiAction;
  onAiActionChange: (action: ChemAiAction) => void;
  output: string;
  copyState: "idle" | "copied" | "failed";
  onCopy: () => void;
}) {
  const copyLabel = aiEnabled ? "AI用テキスト" : chemOutputLabels[outputKind];

  function selectOutputKind(kind: ChemVisibleOutputKind) {
    if (aiEnabled) onAiEnabledChange(false);
    onOutputKindChange(kind);
  }

  function moveOutputTab(event: KeyboardEvent<HTMLButtonElement>, kind: ChemVisibleOutputKind) {
    const currentIndex = chemOutputKinds.indexOf(kind);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % chemOutputKinds.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + chemOutputKinds.length) % chemOutputKinds.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = chemOutputKinds.length - 1;
    else return;
    event.preventDefault();
    const nextKind = chemOutputKinds[nextIndex]!;
    selectOutputKind(nextKind);
    document.getElementById(`chem-output-tab-${nextKind}`)?.focus();
  }

  return (
    <div className="output-panel">
      <div className="output-heading">
        <div className="output-heading-copy">
          <p className="output-kicker">Output</p>
          <h2>変換してコピー</h2>
          <p className="output-heading-description">用途に合う形式を選び、Previewを確認してそのまま持ち出せます</p>
        </div>
        <label className="ai-switch">
          <input type="checkbox" checked={aiEnabled} onChange={(event) => onAiEnabledChange(event.currentTarget.checked)} />
          <span>AIへの依頼文を付ける</span>
        </label>
      </div>

      <div className="output-format-groups" role="tablist" aria-label="出力形式">
        {outputGroups.map((group) => (
          <div className="output-format-group" key={group.label} role="presentation">
            <div className="output-format-heading" aria-hidden="true">
              <strong>{group.label}</strong>
              <span style={{ color: "var(--muted)" }}>{group.description}</span>
            </div>
            <div className="output-tabs" role="presentation">
              {group.kinds.map((kind) => (
                <button
                  id={`chem-output-tab-${kind}`}
                  key={kind}
                  type="button"
                  role="tab"
                  tabIndex={outputKind === kind ? 0 : -1}
                  aria-controls="chem-output-panel"
                  aria-selected={outputKind === kind}
                  onClick={() => selectOutputKind(kind)}
                  onKeyDown={(event) => moveOutputTab(event, kind)}
                >
                  {chemOutputLabels[kind]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {aiEnabled && (
        <div className="output-ai-panel">
          <div className="output-ai-copy">
            <strong>AIに渡す目的</strong>
            <span>化学式・反応式に、用途に合った依頼文を添えます</span>
          </div>
          <div className="ai-actions" role="group" aria-label="AIへの依頼">
            {aiActions.map((action) => (
              <button
                key={action.value}
                type="button"
                aria-pressed={aiAction === action.value}
                onClick={() => onAiActionChange(action.value)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="output-preview">
        <div className="output-preview-heading">
          <strong>Preview</strong>
          <span style={{ color: "var(--muted)" }}>{copyLabel}</span>
        </div>
        <div
          id="chem-output-panel"
          className={`output-preview-surface${!hasSource ? " is-empty" : ""}`}
          role="tabpanel"
          aria-labelledby={aiEnabled ? undefined : `chem-output-tab-${outputKind}`}
          tabIndex={0}
        >
          {output ? <code>{output}</code> : <p>化学式を入力すると変換結果が表示されます</p>}
        </div>
      </div>

      <div className="output-actions">
        <span className="output-current-format">現在の出力: {copyLabel}</span>
        <button className="output-copy-button" type="button" disabled={!output} onClick={onCopy} aria-label={`${copyLabel}をコピー`}>
          {copyState === "copied" ? "コピーしました" : copyState === "failed" ? "コピーできませんでした" : `${copyLabel}をコピー`}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
