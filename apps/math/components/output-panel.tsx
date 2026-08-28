"use client";

import type { AiAction, MojikumiExpression, OutputKind } from "../lib/expression";

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
  return (
    <div className="output-panel">
      <div className="output-tabs" role="tablist" aria-label="出力形式">
        {outputKinds.map((kind) => (
          <button
            key={kind}
            id={`output-tab-${kind}`}
            type="button"
            role="tab"
            aria-selected={outputKind === kind}
            aria-controls="output-panel"
            tabIndex={outputKind === kind ? 0 : -1}
            onClick={() => onOutputKindChange(kind)}
            onKeyDown={(event) => {
              const currentIndex = outputKinds.indexOf(kind);
              let nextIndex = currentIndex;
              if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % outputKinds.length;
              else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + outputKinds.length) % outputKinds.length;
              else if (event.key === "Home") nextIndex = 0;
              else if (event.key === "End") nextIndex = outputKinds.length - 1;
              else return;
              event.preventDefault();
              const nextKind = outputKinds[nextIndex];
              if (!nextKind) return;
              onOutputKindChange(nextKind);
              window.setTimeout(() => document.getElementById(`output-tab-${nextKind}`)?.focus());
            }}
          >
            {outputLabels[kind]}
          </button>
        ))}
      </div>
      <div
        id="output-panel"
        role="tabpanel"
        aria-labelledby={`output-tab-${outputKind}`}
        aria-describedby={hasExpression && !expression.isComplete ? "output-warning" : undefined}
        tabIndex={0}
      >
        {!hasExpression ? (
          <p className="output-empty">数式を入力すると変換結果が表示されます</p>
        ) : (
          <>
            {outputKind === "plain" && (
              <div className="ai-helper">
                <div className="ai-helper-heading">
                  <div>
                    <strong>AIに聞くとき</strong>
                    <span>テキストへ目的に合った依頼文を付けられます</span>
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      checked={aiPromptEnabled}
                      onChange={(event) => onAiPromptEnabledChange(event.currentTarget.checked)}
                    />
                    依頼文を付ける
                  </label>
                </div>
                {aiPromptEnabled && (
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
                )}
              </div>
            )}
            {outputKind === "strict" && (
              <p className="strict-note">ASCIIMathを基礎にした暫定仕様です。正式なStrict文法はβ期間中に策定します。</p>
            )}
            {outputKind === "readable" && (
              <p className="readable-note">Strict βから安全な記号置換だけで生成する表示・共有向けのUnicode表現です。括弧と分数の「/」は保持します。</p>
            )}
            {outputKind === "embed" && (
              <p className="embed-note">Web Componentの公開前です。貼り付け先では、要素の中のMathMLがそのまま表示されます。</p>
            )}
            {!expression.isComplete && (
              <p className="output-warning" id="output-warning">未入力の欄は{"□"}で示しています。コピー前に数式を確認してください。</p>
            )}
            {output === null ? (
              <p className="output-pending">この形式への変換を準備しています</p>
            ) : (
              <pre className="output-value"><code>{output}</code></pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
