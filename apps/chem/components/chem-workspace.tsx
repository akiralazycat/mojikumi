"use client";

import { useEffect, useRef, useState } from "react";
import {
  serializeChem,
  type ChemAiAction,
  type ChemOutputKind
} from "../lib/chemistry";
import { loadChemDraft, removeChemDraft, saveChemDraft } from "../lib/draft";
import { ChemicalDisplay } from "./chemical-display";

const examples = [
  { label: "中和反応", value: "CH3COOH + NaOH → CH3COONa + H2O" },
  { label: "燃焼反応", value: "CH4 + 2O2 → CO2 + 2H2O" },
  { label: "化学平衡", value: "N2 + 3H2 ⇌ 2NH3" }
] as const;

const insertKeys = [
  { label: "+", value: " + " },
  { label: "→", value: " → " },
  { label: "⇌", value: " ⇌ " },
  { label: "電荷 +", value: "^+" },
  { label: "電荷 −", value: "^-" },
  { label: "水溶液", value: "(aq)" },
  { label: "固体", value: "(s)" },
  { label: "気体", value: "(g)" }
] as const;

const outputKinds = ["plain", "mhchem", "latex", "markdown", "html"] as const;
type VisibleOutputKind = (typeof outputKinds)[number];

const outputLabels: Record<VisibleOutputKind, string> = {
  plain: "テキスト",
  mhchem: "mhchem",
  latex: "LaTeX",
  markdown: "Markdown",
  html: "HTML"
};

const aiActions: Array<{ value: ChemAiAction; label: string }> = [
  { value: "explain", label: "説明する" },
  { value: "balance", label: "係数を整える" },
  { value: "name", label: "物質名を調べる" },
  { value: "analyze", label: "反応を分析する" }
];

export function ChemWorkspace() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [source, setSource] = useState("");
  const [outputKind, setOutputKind] = useState<VisibleOutputKind>("plain");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiAction, setAiAction] = useState<ChemAiAction>("explain");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "unavailable">("loading");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      const draft = loadChemDraft(window.localStorage);
      if (draft) {
        setSource(draft.source);
        setAnnouncement("この端末の下書きを読み込みました。");
      }
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    }
  }, []);

  useEffect(() => {
    if (saveState === "loading" || saveState === "unavailable") return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        if (source) saveChemDraft(window.localStorage, source);
        else removeChemDraft(window.localStorage);
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      }
    }, 260);
    return () => window.clearTimeout(timer);
  }, [source]);

  const output = serializeChem(
    source,
    aiEnabled ? "ai" : outputKind,
    { aiAction }
  );

  function insertValue(value: string) {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const next = `${source.slice(0, start)}${value}${source.slice(end)}`;
    setSource(next);
    window.requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + value.length, start + value.length);
    });
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      setAnnouncement(`${aiEnabled ? "AI用テキスト" : outputLabels[outputKind]}をコピーしました。`);
    } catch {
      setCopyState("failed");
      setAnnouncement("コピーできませんでした。出力を選択してコピーしてください。");
    }
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  function reset() {
    if (source && !window.confirm("入力中の化学式を消去しますか？")) return;
    setSource("");
    setAnnouncement("新しい入力を開始しました。");
    inputRef.current?.focus();
  }

  return (
    <section className="workspace" aria-label="化学式エディター">
      <div className="workspace-topbar">
        <div>
          <span className={`status-dot ${saveState}`} aria-hidden="true" />
          <span>{saveState === "saving" ? "保存中" : saveState === "unavailable" ? "端末内保存なし" : "端末内に保存"}</span>
        </div>
        <button className="new-button" type="button" onClick={reset}>新規</button>
      </div>

      <div className="formula-stage">
        <div className="formula-stage-label">Live composition</div>
        <div className="formula-preview">
          <ChemicalDisplay value={source} />
        </div>
        {!source && (
          <div className="starter-row" aria-label="入力例">
            {examples.map((example) => (
              <button key={example.label} type="button" onClick={() => setSource(example.value)}>
                <span>{example.label}</span>
                <ChemicalDisplay value={example.value} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="input-area">
        <label htmlFor="chem-source">
          <span>化学式・反応式</span>
          <span className="input-hint">数字は自動で下付きに、^2- は電荷になります</span>
        </label>
        <textarea
          ref={inputRef}
          id="chem-source"
          value={source}
          rows={3}
          spellCheck={false}
          placeholder="例: 2H2 + O2 -> 2H2O"
          onChange={(event) => setSource(event.target.value)}
        />
        <div className="insert-keys" aria-label="化学記号を挿入">
          {insertKeys.map((key) => (
            <button key={key.label} type="button" onClick={() => insertValue(key.value)}>{key.label}</button>
          ))}
        </div>
      </div>

      <div className="output-panel">
        <div className="output-heading">
          <div>
            <p className="panel-kicker">Take it anywhere</p>
            <h2>変換してコピー</h2>
          </div>
          <label className="ai-switch">
            <input type="checkbox" checked={aiEnabled} onChange={(event) => setAiEnabled(event.target.checked)} />
            <span>AIへの依頼文を付ける</span>
          </label>
        </div>

        {aiEnabled ? (
          <div className="ai-actions" role="group" aria-label="AIへの依頼">
            {aiActions.map((action) => (
              <button key={action.value} type="button" aria-pressed={aiAction === action.value} onClick={() => setAiAction(action.value)}>{action.label}</button>
            ))}
          </div>
        ) : (
          <div className="output-tabs" role="tablist" aria-label="出力形式">
            {outputKinds.map((kind) => (
              <button
                key={kind}
                type="button"
                role="tab"
                aria-selected={outputKind === kind}
                onClick={() => setOutputKind(kind)}
              >{outputLabels[kind]}</button>
            ))}
          </div>
        )}

        <div className="output-box" role="tabpanel">
          {output ? <code>{output}</code> : <span>化学式を入力すると変換結果が表示されます</span>}
        </div>
        <button className="copy-button" type="button" disabled={!output} onClick={copyOutput}>
          {copyState === "copied" ? "コピーしました" : copyState === "failed" ? "コピーできませんでした" : `${aiEnabled ? "AI用テキスト" : outputLabels[outputKind]}をコピー`}
        </button>
      </div>
      <p className="visually-hidden" aria-live="polite">{announcement}</p>
    </section>
  );
}
