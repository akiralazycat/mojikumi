"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadDraft, removeDraft, saveDraft } from "../lib/draft";
import {
  createExpression,
  serializeExpression,
  type AiAction,
  type OutputKind
} from "../lib/expression";

type OutputFormat =
  | "latex"
  | "ascii-math"
  | "math-ml"
  | "plain-text"
  | "spoken-text";

type MathfieldElement = HTMLElement & {
  value: string;
  smartFence: boolean;
  mathVirtualKeyboardPolicy: "auto" | "manual" | "sandboxed";
  getValue: (format?: OutputFormat) => string;
  executeCommand: (command: string | [string, ...unknown[]]) => boolean;
  insert: (
    value: string,
    options?: { selectionMode?: "placeholder" | "after" | "before" | "item" }
  ) => boolean;
};

type KeyboardGroup = "basic" | "algebra" | "calculus" | "greek";
type EditorMode = "visual" | "latex";
type MathKey = {
  label: string;
  value: string;
  variants?: Array<{ label: string; value: string }>;
};

const initialLatex = String.raw`\int_0^\infty e^{-x^2}\,dx=\frac{\sqrt{\pi}}{2}`;

const keys: Record<KeyboardGroup, MathKey[]> = {
  basic: [
    { label: "+", value: "+" },
    { label: "−", value: "-" },
    { label: "×", value: String.raw`\times` },
    { label: "÷", value: String.raw`\div` },
    {
      label: "=",
      value: "=",
      variants: [
        { label: "≠", value: String.raw`\ne` },
        { label: "≈", value: String.raw`\approx` },
        { label: "≡", value: String.raw`\equiv` },
        { label: "≤", value: String.raw`\le` },
        { label: "≥", value: String.raw`\ge` }
      ]
    },
    { label: "( )", value: String.raw`\left(\right)` },
    { label: "x²", value: String.raw`x^{\placeholder{}}` },
    { label: "xⁿ", value: String.raw`x^{\placeholder{}}` },
    {
      label: "√",
      value: String.raw`\sqrt{\placeholder{}}`,
      variants: [
        { label: "³√", value: String.raw`\sqrt[3]{\placeholder{}}` },
        { label: "ⁿ√", value: String.raw`\sqrt[\placeholder{}]{\placeholder{}}` }
      ]
    },
    { label: "a⁄b", value: String.raw`\frac{\placeholder{}}{\placeholder{}}` },
    { label: "π", value: String.raw`\pi` },
    { label: "∞", value: String.raw`\infty` }
  ],
  algebra: [
    { label: "±", value: String.raw`\pm` },
    { label: "≠", value: String.raw`\ne` },
    { label: "≈", value: String.raw`\approx` },
    { label: "≤", value: String.raw`\le` },
    { label: "≥", value: String.raw`\ge` },
    { label: "|x|", value: String.raw`\left|\placeholder{}\right|` },
    { label: "f(x)", value: String.raw`f\left(x\right)` },
    { label: "log", value: String.raw`\log\left(\placeholder{}\right)` }
  ],
  calculus: [
    {
      label: "∫",
      value: String.raw`\int_{\placeholder{}}^{\placeholder{}}\placeholder{}\,d\placeholder{}`,
      variants: [
        { label: "∬", value: String.raw`\iint_{\placeholder{}}\placeholder{}\,d\placeholder{}` },
        { label: "∭", value: String.raw`\iiint_{\placeholder{}}\placeholder{}\,d\placeholder{}` },
        { label: "∮", value: String.raw`\oint_{\placeholder{}}\placeholder{}\,d\placeholder{}` }
      ]
    },
    { label: "∂", value: String.raw`\frac{\partial \placeholder{}}{\partial \placeholder{}}` },
    { label: "lim", value: String.raw`\lim_{\placeholder{}\to\placeholder{}}` },
    {
      label: "Σ",
      value: String.raw`\sum_{\placeholder{}}^{\placeholder{}}`,
      variants: [
        { label: "Π", value: String.raw`\prod_{\placeholder{}}^{\placeholder{}}` }
      ]
    },
    { label: "Π", value: String.raw`\prod_{\placeholder{}}^{\placeholder{}}` },
    {
      label: "→",
      value: String.raw`\to`,
      variants: [
        { label: "←", value: String.raw`\leftarrow` },
        { label: "↔", value: String.raw`\leftrightarrow` },
        { label: "⇒", value: String.raw`\Rightarrow` },
        { label: "⇔", value: String.raw`\Leftrightarrow` }
      ]
    }
  ],
  greek: [
    { label: "α", value: String.raw`\alpha` },
    { label: "β", value: String.raw`\beta` },
    { label: "γ", value: String.raw`\gamma` },
    { label: "δ", value: String.raw`\delta` },
    { label: "θ", value: String.raw`\theta` },
    { label: "λ", value: String.raw`\lambda` },
    { label: "μ", value: String.raw`\mu` },
    { label: "σ", value: String.raw`\sigma` },
    { label: "φ", value: String.raw`\phi` },
    { label: "ω", value: String.raw`\omega` }
  ]
};

const outputLabels: Record<OutputKind, string> = {
  ai: "Ask AI",
  plain: "Plain",
  strict: "Strict",
  latex: "LaTeX",
  markdown: "Markdown",
  mathml: "MathML",
  embed: "Embed"
};

const aiActionLabels: Record<AiAction, string> = {
  explain: "説明する",
  solve: "解く",
  prove: "証明する",
  simplify: "簡約する",
  differentiate: "微分する",
  integrate: "積分する"
};

const keyboardLabels: Record<KeyboardGroup, string> = {
  basic: "Basic",
  algebra: "Algebra",
  calculus: "Calculus",
  greek: "Greek"
};

function readValue(field: MathfieldElement | null, format: OutputFormat, fallback: string) {
  try {
    return field?.getValue(format) || fallback;
  } catch {
    return fallback;
  }
}

export function MathWorkspace() {
  const fieldRef = useRef<MathfieldElement | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);
  const [latex, setLatex] = useState(initialLatex);
  const [outputKind, setOutputKind] = useState<OutputKind>("ai");
  const [aiAction, setAiAction] = useState<AiAction>("explain");
  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardGroup>("basic");
  const [variantKey, setVariantKey] = useState<MathKey | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    import("mathlive").then(() => {
      if (!active) return;
      const field = fieldRef.current;
      if (field) {
        let restored = null;
        try {
          restored = loadDraft(window.localStorage);
        } catch {
          setSaveState("unavailable");
        }
        const nextLatex = restored?.latex || initialLatex;
        field.value = nextLatex;
        field.smartFence = true;
        field.mathVirtualKeyboardPolicy = "manual";
        setLatex(nextLatex);
      }
      setReady(true);
      setSaveState((current) => current === "unavailable" ? current : "saved");
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        saveDraft(window.localStorage, latex);
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [latex, ready]);

  useEffect(() => () => cancelLongPress(), []);

  const expression = useMemo(() => {
    const field = fieldRef.current;
    return createExpression({
      latex,
      plainText: readValue(field, "plain-text", latex),
      strictText: readValue(field, "ascii-math", latex),
      spokenText: readValue(field, "spoken-text", latex),
      mathMl: readValue(field, "math-ml", "")
    });
  }, [latex, ready]);

  const output = useMemo(
    () => serializeExpression(expression, outputKind, { aiAction }),
    [aiAction, expression, outputKind]
  );

  function insert(value: string) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.insert(value, { selectionMode: "placeholder" });
    setLatex(field.value);
  }

  function cancelLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function startLongPress(key: MathKey) {
    cancelLongPress();
    if (!key.variants?.length) return;
    longPressTimerRef.current = window.setTimeout(() => {
      suppressNextClickRef.current = true;
      setVariantKey(key);
      longPressTimerRef.current = null;
    }, 420);
  }

  function activateKey(key: MathKey) {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    insert(key.value);
  }

  function chooseVariant(value: string) {
    insert(value);
    setVariantKey(null);
  }

  function runCommand(command: "undo" | "redo" | "moveToPreviousPlaceholder" | "moveToNextPlaceholder") {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.executeCommand(command);
    setLatex(field.value);
  }

  function updateLatexSource(value: string) {
    setLatex(value);
    if (fieldRef.current) fieldRef.current.value = value;
  }

  function newExpression() {
    if (latex && !window.confirm("現在の数式を消して、新しい数式を始めますか？")) return;
    try {
      removeDraft(window.localStorage);
    } catch {
      setSaveState("unavailable");
    }
    updateLatexSource("");
    setEditorMode("visual");
    window.setTimeout(() => fieldRef.current?.focus());
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="workspace" aria-label="数式入力プロトタイプ">
      <div className="workspace-topbar">
        <div>
          <span className="workspace-kicker">Untitled equation</span>
          <span className="save-state" aria-live="polite">
            {saveState === "loading"
              ? "下書きを確認中"
              : saveState === "saving"
                ? "保存中…"
                : saveState === "unavailable"
                  ? "端末内保存は利用できません"
                  : "この端末に保存済み"}
          </span>
        </div>
        <div className="primary-actions">
          <button className="new-button" type="button" onClick={newExpression}>新規</button>
          <button className="copy-primary" type="button" onClick={copyOutput}>
            {copyState === "copied"
              ? "コピーしました"
              : copyState === "failed"
                ? "コピーできませんでした"
                : `${outputLabels[outputKind]}をコピー`}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>

      <div className="canvas-wrap">
        {!ready && <span className="loading-label">数式入力を準備中…</span>}
        <div className="editor-toolbar" aria-label="編集ツール">
          <div className="tool-group">
            <button type="button" onClick={() => runCommand("undo")} aria-label="元に戻す">↶</button>
            <button type="button" onClick={() => runCommand("redo")} aria-label="やり直す">↷</button>
            <button type="button" onClick={() => runCommand("moveToPreviousPlaceholder")} aria-label="前の入力欄へ">←□</button>
            <button type="button" onClick={() => runCommand("moveToNextPlaceholder")} aria-label="次の入力欄へ">□→</button>
          </div>
          <div className="mode-switch" role="group" aria-label="編集方法">
            <button type="button" aria-pressed={editorMode === "visual"} onClick={() => setEditorMode("visual")}>Visual</button>
            <button type="button" aria-pressed={editorMode === "latex"} onClick={() => setEditorMode("latex")}>LaTeX</button>
          </div>
        </div>
        <math-field
          ref={(node) => {
            fieldRef.current = node as MathfieldElement | null;
          }}
          className={`math-canvas${editorMode === "visual" ? "" : " math-canvas-hidden"}`}
          aria-label="数式を入力"
          math-virtual-keyboard-policy="manual"
          onInput={(event) => {
            setLatex((event.currentTarget as MathfieldElement).value);
          }}
        >
          {initialLatex}
        </math-field>
        {editorMode === "latex" && (
          <textarea
            className="latex-source"
            aria-label="LaTeXソース"
            value={latex}
            spellCheck={false}
            onChange={(event) => updateLatexSource(event.currentTarget.value)}
          />
        )}
        <p className="canvas-hint">数式をタップして編集 · キーを選んで構造を追加</p>
      </div>

      <div className="output-panel">
        <div className="output-tabs" role="tablist" aria-label="出力形式">
          {(Object.keys(outputLabels) as OutputKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={outputKind === kind}
              onClick={() => setOutputKind(kind)}
            >
              {outputLabels[kind]}
            </button>
          ))}
        </div>
        {outputKind === "ai" && (
          <div className="ai-actions" role="group" aria-label="AIへの依頼">
            {(Object.keys(aiActionLabels) as AiAction[]).map((action) => (
              <button
                key={action}
                type="button"
                aria-pressed={aiAction === action}
                onClick={() => setAiAction(action)}
              >
                {aiActionLabels[action]}
              </button>
            ))}
          </div>
        )}
        {!expression.isComplete && (
          <p className="output-warning" role="status">未入力の欄があります。コピー前に数式を確認してください。</p>
        )}
        <pre className="output-value" aria-live="polite"><code>{output}</code></pre>
      </div>

      <div className="keyboard" aria-label="数式キーボード">
        <div className="keyboard-tabs">
          {(["basic", "algebra", "calculus", "greek"] as KeyboardGroup[]).map((group) => (
            <button
              key={group}
              type="button"
              aria-pressed={keyboardGroup === group}
              onClick={() => {
                setKeyboardGroup(group);
                setVariantKey(null);
              }}
            >
              {keyboardLabels[group]}
            </button>
          ))}
        </div>
        <p className="keyboard-hint">点付きキーは長押し、または「…」からバリエーションを選べます。</p>
        {variantKey?.variants && (
          <div className="variant-tray" role="group" aria-label={`${variantKey.label}のバリエーション`}>
            <span>{variantKey.label}</span>
            {variantKey.variants.map((variant) => (
              <button key={variant.label} type="button" onClick={() => chooseVariant(variant.value)}>
                {variant.label}
              </button>
            ))}
            <button className="variant-close" type="button" onClick={() => setVariantKey(null)} aria-label="閉じる">×</button>
          </div>
        )}
        <div className="key-grid">
          {keys[keyboardGroup].map((key) => (
            <div className="math-key" key={`${keyboardGroup}-${key.label}`}>
              <button
                className="math-key-main"
                type="button"
                onPointerDown={() => startLongPress(key)}
                onPointerUp={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onContextMenu={(event) => {
                  if (!key.variants?.length) return;
                  event.preventDefault();
                  setVariantKey(key);
                }}
                onClick={() => activateKey(key)}
              >
                {key.label}
              </button>
              {key.variants?.length ? (
                <button
                  className="variant-disclosure"
                  type="button"
                  aria-label={`${key.label}のバリエーションを表示`}
                  aria-expanded={variantKey === key}
                  onClick={() => setVariantKey(variantKey === key ? null : key)}
                >
                  …
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
