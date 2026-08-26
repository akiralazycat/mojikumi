"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MathKeyboard } from "./math-keyboard";
import { OutputPanel, outputLabels, type VisibleOutputKind } from "./output-panel";
import { StructureGlyph } from "./structure-glyph";
import { StructureNavigator } from "./structure-navigator";
import { useDraft } from "../hooks/use-draft";
import { useStructureSelection } from "../hooks/use-structure-selection";
import {
  createExpression,
  serializeExpression,
  type AiAction
} from "../lib/expression";
import { quickStarters, type QuickStarter, type StructureKey } from "../lib/keyboard";
import { structureKindsIn } from "../lib/math-structure";
import { readValue, type MathfieldElement } from "../lib/mathfield";

type EditorMode = "visual" | "latex";

type ConverterValues = {
  plainText: string;
  strictText: string;
  spokenText: string;
  mathMl: string;
};

const emptyConverters: ConverterValues = {
  plainText: "",
  strictText: "",
  spokenText: "",
  mathMl: ""
};

const undoNoticeDuration = 8000;

function feedback() {
  navigator.vibrate?.(8);
}

export function MathWorkspace() {
  const fieldRef = useRef<MathfieldElement | null>(null);
  const completionRef = useRef(true);
  const undoTimerRef = useRef<number | null>(null);
  const [latex, setLatex] = useState("");
  const [converters, setConverters] = useState<ConverterValues>(emptyConverters);
  const [outputKind, setOutputKind] = useState<VisibleOutputKind>("plain");
  const [aiAction, setAiAction] = useState<AiAction>("explain");
  const [aiPromptEnabled, setAiPromptEnabled] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [announcement, setAnnouncement] = useState("");
  const [undoNotice, setUndoNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const announce = useCallback((message: string) => setAnnouncement(message), []);
  const selection = useStructureSelection(fieldRef, announce);
  const { saveState, clear: clearDraft } = useDraft(latex, useCallback((restored: string) => {
    setLatex(restored);
    announce("この端末の下書きを読み込みました。");
  }, [announce]));

  const readConverters = useCallback((field: MathfieldElement | null): ConverterValues => ({
    plainText: readValue(field, "plain-text"),
    strictText: readValue(field, "ascii-math"),
    spokenText: readValue(field, "spoken-text"),
    mathMl: readValue(field, "math-ml")
  }), []);

  const syncFromField = useCallback((field: MathfieldElement) => {
    setLatex(field.value);
    setConverters(readConverters(field));
  }, [readConverters]);

  useEffect(() => {
    let active = true;
    import("mathlive").then((mathlive) => {
      if (!active) return;
      mathlive.MathfieldElement.fontsDirectory = "/fonts";
      mathlive.MathfieldElement.soundsDirectory = null;
      setReady(true);
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
    setConverters(readConverters(field));
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
    const handleSelectionChange = () => selection.sync();
    field.addEventListener("selection-change", handleSelectionChange);
    return () => {
      observer.disconnect();
      field.removeEventListener("selection-change", handleSelectionChange);
    };
    // The field is created once MathLive upgrades the custom element; `latex`
    // is written back through the field itself afterwards.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => () => {
    if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current);
  }, []);

  const expression = useMemo(
    () => createExpression({ latex, ...converters }),
    [latex, converters]
  );

  const saveStateMessage = saveState === "loading"
    ? "下書きを確認中"
    : saveState === "saving"
      ? "保存中…"
      : saveState === "unavailable"
        ? "端末内保存は利用できません"
        : "この端末に下書きを保存済み";

  const serializedKind = outputKind === "plain" && aiPromptEnabled ? "ai" : outputKind;
  const output = serializeExpression(expression, serializedKind, { aiAction });
  const hasExpression = latex.trim().length > 0;
  const structureKinds = structureKindsIn(latex);
  const copyLabel = outputKind === "plain" && aiPromptEnabled
    ? outputLabels.ai
    : outputLabels[outputKind];

  useEffect(() => {
    if (!hasExpression) {
      completionRef.current = true;
      return;
    }
    if (completionRef.current === expression.isComplete) return;
    completionRef.current = expression.isComplete;
    announce(
      expression.isComplete
        ? "すべての入力欄が埋まりました。"
        : "未入力の欄があります。コピー前に数式を確認してください。"
    );
  }, [announce, expression.isComplete, hasExpression]);

  function insert(value: string) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.insert(value, { selectionMode: "placeholder" });
    selection.reset();
    syncFromField(field);
    feedback();
  }

  function insertStructure(key: StructureKey) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const hasSelection = !field.selectionIsCollapsed;
    const value = hasSelection
      ? key.selectedValue
      : latex.trim() && key.appendValue
        ? key.appendValue
        : key.emptyValue;
    field.insert(value, {
      insertionMode: "replaceSelection",
      selectionMode: "placeholder"
    });
    selection.reset();
    syncFromField(field);
    feedback();
  }

  function startFrom(starter: QuickStarter) {
    setEditorMode("visual");
    window.setTimeout(() => insert(starter.value));
  }

  function runCommand(command: "undo" | "redo" | "moveToPreviousPlaceholder" | "moveToNextPlaceholder") {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.executeCommand(command);
    selection.reset();
    syncFromField(field);
  }

  function updateLatexSource(value: string) {
    setLatex(value);
    const field = fieldRef.current;
    if (!field) return;
    field.value = value;
    setConverters(readConverters(field));
  }

  function showUndoNotice(previousLatex: string) {
    if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current);
    setUndoNotice(previousLatex);
    undoTimerRef.current = window.setTimeout(() => {
      setUndoNotice(null);
      undoTimerRef.current = null;
    }, undoNoticeDuration);
  }

  function newExpression() {
    const previousLatex = latex;
    clearDraft();
    updateLatexSource("");
    selection.reset();
    setEditorMode("visual");
    const restorable = previousLatex.trim().length > 0;
    if (restorable) showUndoNotice(previousLatex);
    announce(restorable
      ? "新しい数式を開始しました。前の数式は元に戻せます。"
      : "新しい数式を開始しました。");
    window.setTimeout(() => fieldRef.current?.focus());
  }

  function restorePrevious() {
    if (undoNotice === null) return;
    updateLatexSource(undoNotice);
    setUndoNotice(null);
    if (undoTimerRef.current !== null) window.clearTimeout(undoTimerRef.current);
    announce("前の数式に戻しました。");
    window.setTimeout(() => fieldRef.current?.focus());
  }

  async function copyOutput() {
    if (!hasExpression || output === null) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      announce(`${copyLabel}をコピーしました。`);
      feedback();
    } catch {
      setCopyState("failed");
      announce("コピーできませんでした。ブラウザの権限を確認してください。");
    }
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="workspace" aria-label="Mojikumi Math 数式入力">
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="visually-hidden save-status" role="status" aria-atomic="true">
        {saveStateMessage}
      </div>
      <div className="workspace-topbar">
        <div>
          <span className="workspace-kicker">数式</span>
          <span className="save-state" aria-hidden="true">{saveStateMessage}</span>
        </div>
        <div className="primary-actions">
          <button className="new-button" type="button" onClick={newExpression}>新規</button>
          <button
            className="copy-primary"
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
      </div>

      {undoNotice !== null && (
        <div className="workspace-notice">
          <span>数式を消しました</span>
          <button type="button" onClick={restorePrevious}>消した数式を戻す</button>
          <button
            className="workspace-notice-close"
            type="button"
            aria-label="閉じる"
            onClick={() => setUndoNotice(null)}
          >
            ×
          </button>
        </div>
      )}

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
              selection.reset();
              syncFromField(event.currentTarget as MathfieldElement);
            }}
          >
            {latex}
          </math-field>
        )}
        {ready && hasExpression && editorMode === "visual" && (
          <StructureNavigator
            summary={selection.summary}
            depth={selection.depth}
            semanticTarget={selection.semanticTarget}
            kinds={structureKinds}
            onMove={selection.move}
            onSelectCurrent={selection.selectCurrentElement}
            onSelectInner={selection.selectInnerStructure}
            onSelectOuter={selection.selectOuterStructure}
            onSelectSlot={(kind, slotId) => {
              selection.selectSemanticSlot(kind, slotId);
              feedback();
            }}
          />
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
                  <span aria-hidden="true"><StructureGlyph name={starter.glyph} /></span>
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="canvas-hint">
          {editorMode === "visual"
            ? "数式をタップして編集 · キーを選んで構造を追加"
            : "LaTeXを貼り付けると読み込みます · Visualへ切り替えると組版で確認できます"}
        </p>
      </div>

      <MathKeyboard onInsert={insert} onInsertStructure={insertStructure} />

      <OutputPanel
        expression={expression}
        hasExpression={hasExpression}
        outputKind={outputKind}
        onOutputKindChange={setOutputKind}
        aiPromptEnabled={aiPromptEnabled}
        onAiPromptEnabledChange={setAiPromptEnabled}
        aiAction={aiAction}
        onAiActionChange={setAiAction}
        output={output}
      />
    </section>
  );
}
