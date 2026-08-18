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

type QuickStarter = {
  label: string;
  preview: string;
  value: string;
};

const initialLatex = "";

const quickStarters: QuickStarter[] = [
  {
    label: "分数",
    preview: "□ / □",
    value: String.raw`\frac{\placeholder{}}{\placeholder{}}`
  },
  {
    label: "二次式",
    preview: "□x² + □x + □ = 0",
    value: String.raw`\placeholder{}x^2+\placeholder{}x+\placeholder{}=0`
  },
  {
    label: "定積分",
    preview: "∫₍□₎⁽□⁾ □ d□",
    value: String.raw`\int_{\placeholder{}}^{\placeholder{}}\placeholder{}\,d\placeholder{}`
  }
];

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
  strict: "Strict β",
  latex: "LaTeX",
  markdown: "Markdown",
  mathml: "MathML",
  embed: "Embed"
};

const outputKinds = Object.keys(outputLabels) as OutputKind[];

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
  const variantTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstVariantRef = useRef<HTMLButtonElement | null>(null);
  const completionRef = useRef(true);
  const [latex, setLatex] = useState(initialLatex);
  const [outputKind, setOutputKind] = useState<OutputKind>("ai");
  const [aiAction, setAiAction] = useState<AiAction>("explain");
  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardGroup>("basic");
  const [variantKey, setVariantKey] = useState<MathKey | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [announcement, setAnnouncement] = useState("");
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    import("mathlive").then((mathlive) => {
      if (!active) return;
      mathlive.MathfieldElement.fontsDirectory = "/fonts";
      mathlive.MathfieldElement.soundsDirectory = null;
      let restored = null;
      try {
        restored = loadDraft(window.localStorage);
      } catch {
        setSaveState("unavailable");
      }
      setLatex(restored?.latex ?? initialLatex);
      if (restored) setAnnouncement("この端末の下書きを読み込みました。");
      setReady(true);
      setSaveState((current) => current === "unavailable" ? current : "saved");
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const field = fieldRef.current;
    if (!field) return;
    field.value = latex;
    field.smartFence = true;
    field.mathVirtualKeyboardPolicy = "manual";
    const keyboardSink = field.shadowRoot?.querySelector<HTMLElement>(".ML__keyboard-sink");
    if (!keyboardSink) return;
    const labelKeyboardSink = () => {
      if (keyboardSink.getAttribute("aria-label") !== "数式を入力") {
        keyboardSink.setAttribute("aria-label", "数式を入力");
      }
    };
    labelKeyboardSink();
    const observer = new MutationObserver(labelKeyboardSink);
    observer.observe(keyboardSink, { attributes: true, attributeFilter: ["aria-label"] });
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        saveDraft(window.localStorage, latex);
        setSaveState("saved");
        setAnnouncement("この端末に下書きを保存しました。");
      } catch {
        setSaveState("unavailable");
        setAnnouncement("端末内保存を利用できません。");
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
  const hasExpression = latex.trim().length > 0;

  useEffect(() => {
    if (!ready) return;
    if (!hasExpression) {
      completionRef.current = true;
      return;
    }
    if (completionRef.current === expression.isComplete) return;
    completionRef.current = expression.isComplete;
    setAnnouncement(
      expression.isComplete
        ? "すべての入力欄が埋まりました。"
        : "未入力の欄があります。コピー前に数式を確認してください。"
    );
  }, [expression.isComplete, hasExpression, ready]);

  useEffect(() => {
    if (variantKey) firstVariantRef.current?.focus();
  }, [variantKey]);

  function insert(value: string) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.insert(value, { selectionMode: "placeholder" });
    setLatex(field.value);
    navigator.vibrate?.(8);
  }

  function startFrom(starter: QuickStarter) {
    setEditorMode("visual");
    window.setTimeout(() => insert(starter.value));
  }

  function cancelLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function openVariants(key: MathKey, trigger: HTMLButtonElement) {
    if (!key.variants?.length) return;
    variantTriggerRef.current = trigger;
    setVariantKey(key);
  }

  function closeVariants(returnFocus = true) {
    setVariantKey(null);
    if (returnFocus) window.setTimeout(() => variantTriggerRef.current?.focus());
  }

  function startLongPress(key: MathKey, trigger: HTMLButtonElement) {
    cancelLongPress();
    if (!key.variants?.length) return;
    longPressTimerRef.current = window.setTimeout(() => {
      suppressNextClickRef.current = true;
      openVariants(key, trigger);
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
    closeVariants();
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
    if (hasExpression && !window.confirm("現在の数式を消して、新しい数式を始めますか？")) return;
    try {
      removeDraft(window.localStorage);
    } catch {
      setSaveState("unavailable");
    }
    updateLatexSource("");
    setEditorMode("visual");
    setAnnouncement("新しい数式を開始しました。");
    window.setTimeout(() => fieldRef.current?.focus());
  }

  async function copyOutput() {
    if (!hasExpression) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      setAnnouncement(`${outputLabels[outputKind]}をコピーしました。`);
    } catch {
      setCopyState("failed");
      setAnnouncement("コピーできませんでした。ブラウザの権限を確認してください。");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="workspace" aria-label="Mojikumi Math 数式入力">
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="workspace-topbar">
        <div>
          <span className="workspace-kicker">Untitled equation</span>
          <span className="save-state">
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
          <button
            className="copy-primary"
            type="button"
            aria-label={`${outputLabels[outputKind]}をコピー`}
            disabled={!hasExpression}
            onClick={copyOutput}
          >
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
        {ready && (
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
            {latex}
          </math-field>
        )}
        {editorMode === "latex" && (
          <textarea
            className="latex-source"
            aria-label="LaTeXソース"
            value={latex}
            spellCheck={false}
            onChange={(event) => updateLatexSource(event.currentTarget.value)}
          />
        )}
        {ready && !hasExpression && (
          <div className="quick-start" role="group" aria-label="入力の開始候補">
            <p>構造から始める</p>
            <div className="quick-start-options">
              {quickStarters.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  aria-label={`${starter.label}から始める`}
                  onClick={() => startFrom(starter)}
                >
                  <span>{starter.label}</span>
                  <span aria-hidden="true">{starter.preview}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="canvas-hint">数式をタップして編集 · キーを選んで構造を追加</p>
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
                closeVariants(false);
              }}
            >
              {keyboardLabels[group]}
            </button>
          ))}
        </div>
        <p className="keyboard-hint">点付きキーは長押し、または「…」からバリエーションを選べます。</p>
        {variantKey?.variants && (
          <div
            className="variant-tray"
            role="group"
            aria-label={`${variantKey.label}のバリエーション`}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              closeVariants();
            }}
          >
            <span>{variantKey.label}</span>
            {variantKey.variants.map((variant, index) => (
              <button
                key={variant.label}
                ref={index === 0 ? firstVariantRef : undefined}
                type="button"
                onClick={() => chooseVariant(variant.value)}
              >
                {variant.label}
              </button>
            ))}
            <button className="variant-close" type="button" onClick={() => closeVariants()} aria-label="閉じる">×</button>
          </div>
        )}
        <div className="key-grid">
          {keys[keyboardGroup].map((key) => (
            <div className="math-key" key={`${keyboardGroup}-${key.label}`}>
              <button
                className="math-key-main"
                type="button"
                onPointerDown={(event) => startLongPress(key, event.currentTarget)}
                onPointerUp={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onContextMenu={(event) => {
                  if (!key.variants?.length) return;
                  event.preventDefault();
                  openVariants(key, event.currentTarget);
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
                  onClick={(event) => {
                    if (variantKey === key) closeVariants();
                    else openVariants(key, event.currentTarget);
                  }}
                >
                  …
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

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
              onClick={() => setOutputKind(kind)}
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
                setOutputKind(nextKind);
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
              {outputKind === "strict" && (
                <p className="strict-note">ASCIIMathを基礎にした暫定仕様です。正式なStrict文法はβ期間中に策定します。</p>
              )}
              {!expression.isComplete && (
                <p className="output-warning" id="output-warning">未入力の欄があります。コピー前に数式を確認してください。</p>
              )}
              <pre className="output-value"><code>{output}</code></pre>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
