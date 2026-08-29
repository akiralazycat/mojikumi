"use client";

import { useState, type KeyboardEvent } from "react";
import type { AiAction, MojikumiExpression, OutputKind } from "../lib/expression";
import { rememberHistory } from "../lib/history";

export const outputLabels: Record<OutputKind, string> = {
  ai: "AI用テキスト",
  plain: "テキスト",
  readable: "Readable",
  strict: "Strict β",
  latex: "LaTeX",
  markdown: "Markdown",
  mathml: "MathML",
  embed: "Embed"
};

export const outputKinds = [
  "plain",
  "readable",
  "strict",
  "latex",
  "markdown",
  "mathml",
  "embed"
] as const;

export type VisibleOutputKind = (typeof outputKinds)[number];

const outputGroups: Array<{
  label: string;
  description: string;
  kinds: VisibleOutputKind[];
}> = [
  {
    label: "よく使う",
    description: "コピーや文書へ持ち出す基本形式",
    kinds: ["plain", "latex", "markdown"]
  },
  {
    label: "詳細",
    description: "共有・機械処理・埋め込み向け",
    kinds: ["readable", "strict", "mathml", "embed"]
  }
];

export const aiActionLabels: Record<AiAction, string> = {
  explain: "説明する",
  solve: "解く",
  prove: "証明する",
  simplify: "簡約する",
  differentiate: "微分する",
  integrate: "積分する"
};

export function OutputPanel({
  expression,
  hasExpression,
  outputKind,
  onOutputKindChange,
  aiPromptEnabled,
  onAiPromptEnabledChange,
  aiAction,
  onAiActionChange,
  output
}: {
  expression: MojikumiExpression;
  hasExpression: boolean;
  outputKind: VisibleOutputKind;
  onOutputKindChange: (kind: VisibleOutputKind) => void;
  aiPromptEnabled: boolean;
  onAiPromptEnabledChange: (enabled: boolean) => void;
  aiAction: AiAction;
  onAiActionChange: (action: AiAction) => void;
  output: string | null;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copyLabel = aiPromptEnabled ? outputLabels.ai : outputLabels[outputKind];

  function selectOutputKind(kind: VisibleOutputKind) {
    if (aiPromptEnabled) onAiPromptEnabledChange(false);
    onOutputKindChange(kind);
  }

  function moveOutputTab(event: KeyboardEvent<HTMLButtonElement>, kind: VisibleOutputKind) {
    const currentIndex = outputKinds.indexOf(kind);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % outputKinds.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + outputKinds.length) % outputKinds.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = outputKinds.length - 1;
    else return;
    event.preventDefault();
    const nextKind = outputKinds[nextIndex];
    if (!nextKind) return;
    selectOutputKind(nextKind);
    window.setTimeout(() => document.getElementById(`output-tab-${nextKind}`)?.focus());
  }

  async function copyOutput() {
    if (!hasExpression || output === null) return;
    try {
      await navigator.clipboard.writeText(output);
      try {
        rememberHistory(window.localStorage, expression.latex);
      } catch {
        // Copy remains available even if this browser blocks local persistence.
      }
      navigator.vibrate?.(8);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
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
          <input
            type="checkbox"
            checked={aiPromptEnabled}
            onChange={(event) => {
              const enabled = event.currentTarget.checked;
              if (enabled) onOutputKindChange("plain");
              onAiPromptEnabledChange(enabled);
            }}
          />
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
                  key={kind}
                  id={`output-tab-${kind}`}
                  type="button"
                  role="tab"
                  aria-selected={outputKind === kind}
                  aria-controls="output-panel"
                  tabIndex={outputKind === kind ? 0 : -1}
                  onClick={() => selectOutputKind(kind)}
                  onKeyDown={(event) => moveOutputTab(event, kind)}
                >
                  {outputLabels[kind]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {aiPromptEnabled && (
        <div className="output-ai-panel">
          <div className="output-ai-copy">
            <strong>AIに渡す目的</strong>
            <span>数式そのものに、用途に合った依頼文を添えます</span>
          </div>
          <div className="ai-actions" role="group" aria-label="AIへの依頼">
            {(Object.keys(aiActionLabels) as AiAction[]).map((action) => (
              <button
                key={action}
                type="button"
                aria-pressed={aiAction === action}
                onClick={() => onAiActionChange(action)}
              >
                {aiActionLabels[action]}
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
          id="output-panel"
          className={`output-preview-surface${!hasExpression ? " is-empty" : ""}`}
          role="tabpanel"
          aria-labelledby={aiPromptEnabled ? undefined : `output-tab-${outputKind}`}
          aria-describedby={hasExpression && !expression.isComplete ? "output-warning" : undefined}
          tabIndex={0}
        >
          {!hasExpression ? (
            <p>数式を入力すると変換結果が表示されます</p>
          ) : (
            <>
              {outputKind === "strict" && !aiPromptEnabled && (
                <p className="strict-note">ASCIIMathを基礎にした暫定仕様です。正式なStrict文法はβ期間中に策定します。</p>
              )}
              {outputKind === "readable" && !aiPromptEnabled && (
                <p className="readable-note">Strict βから安全な記号置換だけで生成する表示・共有向けのUnicode表現です。括弧と分数の「/」は保持します。</p>
              )}
              {outputKind === "embed" && !aiPromptEnabled && (
                <p className="embed-note">Web Componentの公開前です。貼り付け先では、要素の中のMathMLがそのまま表示されます。</p>
              )}
              {!expression.isComplete && (
                <p className="output-warning" id="output-warning" style={{ color: "var(--code-ink)" }}>未入力の欄は□で示しています。コピー前に数式を確認してください。</p>
              )}
              {output === null ? (
                <p>この形式への変換を準備しています</p>
              ) : (
                <pre><code>{output}</code></pre>
              )}
            </>
          )}
        </div>
      </div>

      <div className="output-actions">
        <span className="output-current-format">現在の出力: {copyLabel}</span>
        <button
          className="output-copy-button"
          type="button"
          aria-label={`${copyLabel}をコピー`}
          disabled={!hasExpression || output === null}
          onClick={copyOutput}
        >
          {copyState === "copied"
            ? "コピーしました"
            : copyState === "failed"
              ? "コピーできませんでした"
              : `${copyLabel}をコピー`}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <span className="visually-hidden" role="status" aria-atomic="true">
        {copyState === "copied" ? `${copyLabel}をコピーしました。` : copyState === "failed" ? "コピーできませんでした。" : ""}
      </span>
    </div>
  );
}
