"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { serializeChem, type ChemAiAction } from "../lib/chemistry";
import {
  analyzeChem,
  balanceChemReaction,
  summarizeAnalysis,
  type ChemAnalysis
} from "../lib/chem-model";
import type { SpeciesRef } from "../lib/reaction-awareness";
import { loadChemDraft, removeChemDraft, saveChemDraft } from "../lib/draft";
import { ChemicalDisplay } from "./chemical-display";
import { ReactionNavigator } from "./reaction-navigator";

type EditorSnapshot = { condition: string; source: string };
const emptySnapshot: EditorSnapshot = { condition: "", source: "" };

const examples = [
  { label: "中和反応", source: "CH3COOH + NaOH → CH3COONa + H2O", condition: "" },
  { label: "燃焼反応", source: "CH4 + 2O2 → CO2 + 2H2O", condition: "点火" },
  { label: "化学平衡", source: "N2 + 3H2 ⇌ 2NH3", condition: "Fe, 450 °C" }
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

const conditionKeys = ["加熱", "光", "Pt", "電気分解"] as const;
const outputKinds = ["plain", "mhchem", "latex", "markdown", "html", "json"] as const;
type VisibleOutputKind = (typeof outputKinds)[number];

const outputLabels: Record<VisibleOutputKind, string> = {
  plain: "テキスト",
  mhchem: "mhchem",
  latex: "LaTeX",
  markdown: "Markdown",
  html: "HTML",
  json: "JSON"
};

const aiActions: Array<{ value: ChemAiAction; label: string }> = [
  { value: "explain", label: "説明する" },
  { value: "balance", label: "係数を整える" },
  { value: "name", label: "物質名を調べる" },
  { value: "analyze", label: "反応を分析する" }
];

function analysisTone(analysis: ChemAnalysis) {
  if (!analysis.valid) return "error";
  if (analysis.kind === "reaction") return analysis.balanced ? "balanced" : "warning";
  return analysis.kind === "formula" ? "formula" : "idle";
}

export function ChemWorkspace() {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const hydratedRef = useRef(false);
  const historyRef = useRef<EditorSnapshot[]>([emptySnapshot]);
  const historyIndexRef = useRef(0);
  const snapshotRef = useRef<EditorSnapshot>(emptySnapshot);
  const [editor, setEditor] = useState<EditorSnapshot>(emptySnapshot);
  const [historyState, setHistoryState] = useState({ canRedo: false, canUndo: false });
  const [outputKind, setOutputKind] = useState<VisibleOutputKind>("plain");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiAction, setAiAction] = useState<ChemAiAction>("explain");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "unavailable">("loading");
  const [announcement, setAnnouncement] = useState("");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesRef | null>(null);
  const [balancePreviewOpen, setBalancePreviewOpen] = useState(false);

  const analysis = useMemo(() => analyzeChem(editor.source, { condition: editor.condition }), [editor]);
  const balanceResult = useMemo(
    () => analysis.kind === "reaction" && analysis.valid && !analysis.balanced
      ? balanceChemReaction(editor.source, { condition: editor.condition })
      : null,
    [analysis, editor]
  );

  function syncHistoryState() {
    setHistoryState({
      canUndo: historyIndexRef.current > 0,
      canRedo: historyIndexRef.current < historyRef.current.length - 1
    });
  }

  function applySnapshot(next: EditorSnapshot, record = true) {
    if (next.source === snapshotRef.current.source && next.condition === snapshotRef.current.condition) return;
    if (record) {
      const history = historyRef.current.slice(0, historyIndexRef.current + 1);
      history.push(next);
      historyRef.current = history.slice(-100);
      historyIndexRef.current = historyRef.current.length - 1;
    }
    snapshotRef.current = next;
    setEditor(next);
    syncHistoryState();
  }

  function undo() {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const previous = historyRef.current[historyIndexRef.current]!;
    snapshotRef.current = previous;
    setEditor(previous);
    syncHistoryState();
    setAnnouncement("ひとつ前の入力へ戻しました。");
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const next = historyRef.current[historyIndexRef.current]!;
    snapshotRef.current = next;
    setEditor(next);
    syncHistoryState();
    setAnnouncement("取り消した入力をやり直しました。");
  }

  useEffect(() => {
    try {
      const draft = loadChemDraft(window.localStorage);
      if (draft) {
        const restored = { source: draft.source, condition: draft.condition };
        snapshotRef.current = restored;
        historyRef.current = [restored];
        historyIndexRef.current = 0;
        setEditor(restored);
        setAnnouncement("この端末の下書きを読み込みました。");
      }
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || saveState === "unavailable") return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        if (editor.source || editor.condition) saveChemDraft(window.localStorage, editor.source, editor.condition);
        else removeChemDraft(window.localStorage);
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      }
    }, 260);
    return () => window.clearTimeout(timer);
  }, [editor]);

  useEffect(() => {
    setSelectedElement(null);
    setSelectedSpecies(null);
    setBalancePreviewOpen(false);
  }, [editor.source]);

  const output = serializeChem(editor.source, aiEnabled ? "ai" : outputKind, {
    aiAction,
    condition: editor.condition
  });

  function insertValue(value: string) {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const nextSource = `${editor.source.slice(0, start)}${value}${editor.source.slice(end)}`;
    applySnapshot({ ...editor, source: nextSource });
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
    if (editor.source && !window.confirm("入力中の化学式を消去しますか？")) return;
    applySnapshot(emptySnapshot);
    setAnnouncement("新しい入力を開始しました。");
    inputRef.current?.focus();
  }

  function applyBalance() {
    if (!balanceResult) return;
    applySnapshot({ source: balanceResult.source, condition: balanceResult.condition });
    setBalancePreviewOpen(false);
    setAnnouncement(`係数を ${balanceResult.coefficients.join(" : ")} に整えました。`);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  }

  function moveOutputTab(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % outputKinds.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + outputKinds.length) % outputKinds.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = outputKinds.length - 1;
    else return;
    event.preventDefault();
    const nextKind = outputKinds[nextIndex]!;
    setOutputKind(nextKind);
    document.getElementById(`chem-output-tab-${nextKind}`)?.focus();
  }

  return (
    <section className="workspace" aria-label="化学式エディター" onKeyDown={handleKeyboard}>
      <div className="workspace-topbar">
        <div>
          <span className={`status-dot ${saveState}`} aria-hidden="true" />
          <span>{saveState === "saving" ? "保存中" : saveState === "unavailable" ? "端末内保存なし" : "端末内に保存"}</span>
        </div>
        <div className="history-actions" aria-label="編集履歴">
          <button type="button" disabled={!historyState.canUndo} onClick={undo} aria-label="元に戻す">↶ <span>戻す</span></button>
          <button type="button" disabled={!historyState.canRedo} onClick={redo} aria-label="やり直す">↷ <span>やり直す</span></button>
          <button className="new-button" type="button" onClick={reset}>新規</button>
        </div>
      </div>

      <div className="formula-stage">
        <div className="formula-stage-label">Live composition</div>
        <div className="formula-preview"><ChemicalDisplay value={editor.source} condition={editor.condition} /></div>
        {!editor.source && (
          <div className="starter-row" aria-label="入力例">
            {examples.map((example) => (
              <button key={example.label} type="button" onClick={() => applySnapshot({ source: example.source, condition: example.condition })}>
                <span>{example.label}</span>
                <ChemicalDisplay value={example.source} condition={example.condition} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="input-area">
        <label htmlFor="chem-source">
          <span>化学式・反応式</span>
          <span className="input-hint">数字は下付きに、^2- は電荷として解析します</span>
        </label>
        <textarea
          ref={inputRef}
          id="chem-source"
          value={editor.source}
          rows={3}
          spellCheck={false}
          aria-describedby={analysis.kind === "empty" ? undefined : "chem-analysis-summary"}
          aria-invalid={analysis.kind !== "empty" && !analysis.valid}
          placeholder="例: H2 + O2 -> H2O"
          onChange={(event) => applySnapshot({ ...editor, source: event.target.value })}
        />
        <div className="insert-keys" aria-label="化学記号を挿入">
          {insertKeys.map((key) => <button key={key.label} type="button" onClick={() => insertValue(key.value)}>{key.label}</button>)}
        </div>

        {analysis.kind === "reaction" && (
          <div className="condition-editor">
            <label htmlFor="reaction-condition">反応条件 <span>矢印の上へ表示します</span></label>
            <div>
              <input
                id="reaction-condition"
                value={editor.condition}
                placeholder="例: Pt, 300 °C"
                onChange={(event) => applySnapshot({ ...editor, condition: event.target.value })}
              />
              <div className="condition-keys" aria-label="反応条件の候補">
                {conditionKeys.map((condition) => <button key={condition} type="button" onClick={() => applySnapshot({ ...editor, condition })}>{condition}</button>)}
              </div>
            </div>
          </div>
        )}

        {analysis.kind !== "empty" && (
          <div className={`analysis-panel ${analysisTone(analysis)}`}>
            <div className="analysis-summary">
              <span className="analysis-mark" aria-hidden="true" />
              <div id="chem-analysis-summary" role="status" aria-atomic="true">
                <strong>{summarizeAnalysis(analysis)}</strong>
                <span>{analysis.kind === "formula" ? "元素記号・括弧・原子数を確認しました" : "原子数と総電荷を左右で比較しています"}</span>
              </div>
            </div>
            {analysis.kind === "formula" && analysis.valid && (
              <div className="composition-list" aria-label="元素組成">
                {Object.entries(analysis.species[0]?.atoms ?? {}).map(([element, count]) => <span key={element}><strong>{element}</strong>{count}</span>)}
              </div>
            )}
            {Object.keys(analysis.elementDelta).length > 0 && (
              <div className="delta-list" aria-label="左右で一致しない元素">
                {Object.entries(analysis.elementDelta).map(([element, delta]) => (
                  <span key={element}><strong>{element}</strong>{delta > 0 ? `生成物に ${delta} 多い` : `反応物に ${Math.abs(delta)} 多い`}</span>
                ))}
              </div>
            )}
            {analysis.diagnostics.length > 0 && (
              <ul className="diagnostic-list">
                {analysis.diagnostics.map((diagnostic, index) => <li key={`${diagnostic.code}-${index}`} className={diagnostic.severity}>{diagnostic.message}</li>)}
              </ul>
            )}
          </div>
        )}

        {analysis.kind === "reaction" && analysis.valid && analysis.reaction && (
          <ReactionNavigator
            reaction={analysis.reaction}
            selectedElement={selectedElement}
            selectedSpecies={selectedSpecies}
            balanceProposal={balanceResult}
            balancePreviewOpen={balancePreviewOpen}
            onSelectElement={(element) => {
              setSelectedElement(element);
              setSelectedSpecies(null);
            }}
            onSelectSpecies={setSelectedSpecies}
            onOpenBalancePreview={() => setBalancePreviewOpen(true)}
            onCloseBalancePreview={() => setBalancePreviewOpen(false)}
            onApplyBalance={applyBalance}
          />
        )}
      </div>

      <div className="output-panel">
        <div className="output-heading">
          <div><p className="panel-kicker">Take it anywhere</p><h2>変換してコピー</h2></div>
          <label className="ai-switch">
            <input type="checkbox" checked={aiEnabled} onChange={(event) => setAiEnabled(event.target.checked)} />
            <span>AIへの依頼文を付ける</span>
          </label>
        </div>

        {aiEnabled ? (
          <div className="ai-actions" role="group" aria-label="AIへの依頼">
            {aiActions.map((action) => <button key={action.value} type="button" aria-pressed={aiAction === action.value} onClick={() => setAiAction(action.value)}>{action.label}</button>)}
          </div>
        ) : (
          <div className="output-tabs" role="tablist" aria-label="出力形式">
            {outputKinds.map((kind, index) => (
              <button
                id={`chem-output-tab-${kind}`}
                key={kind}
                type="button"
                role="tab"
                tabIndex={outputKind === kind ? 0 : -1}
                aria-controls="chem-output-panel"
                aria-selected={outputKind === kind}
                onClick={() => setOutputKind(kind)}
                onKeyDown={(event) => moveOutputTab(event, index)}
              >{outputLabels[kind]}</button>
            ))}
          </div>
        )}

        <div id="chem-output-panel" className="output-box" role="tabpanel" aria-labelledby={aiEnabled ? undefined : `chem-output-tab-${outputKind}`}>
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
