"use client";

import { useEffect, useRef, useState } from "react";
import { loadDraft, removeDraft, saveDraft } from "../lib/draft";
import {
  createExpression,
  serializeExpression,
  type AiAction,
  type OutputKind
} from "../lib/expression";
import {
  normalizeSlotLatex,
  parseSemanticStructure,
  type SemanticSlot,
  type SemanticStructure,
  type SemanticStructureKind
} from "../lib/math-structure";

type OutputFormat =
  | "latex"
  | "ascii-math"
  | "math-ml"
  | "plain-text"
  | "spoken-text";

type MathfieldElement = HTMLElement & {
  value: string;
  smartFence: boolean;
  selectionIsCollapsed: boolean;
  selection: Readonly<MathSelection>;
  position: number;
  lastOffset: number;
  mathVirtualKeyboardPolicy: "auto" | "manual" | "sandboxed";
  getValue: {
    (format?: OutputFormat): string;
    (selection: MathSelection, format?: OutputFormat): string;
  };
  executeCommand: (command: string | [string, ...unknown[]]) => boolean;
  insert: (
    value: string,
    options?: {
      insertionMode?: "replaceSelection" | "replaceAll" | "insertBefore" | "insertAfter";
      selectionMode?: "placeholder" | "after" | "before" | "item";
    }
  ) => boolean;
};

type MathSelection = {
  ranges: Array<[number, number]>;
  direction?: "forward" | "backward" | "none";
};

type SelectionSummary = {
  kind: "caret" | "element" | "structure";
  label: string;
};

type SemanticTarget = `${SemanticStructureKind}:${SemanticSlot["id"]}`;

type SemanticStructureCandidate = {
  selection: MathSelection;
  structure: SemanticStructure;
  start: number;
  end: number;
  span: number;
  filledSlots: number;
  contentLength: number;
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

type StructureKey = {
  label: string;
  preview: string;
  emptyValue: string;
  selectedValue: string;
  appendValue?: string;
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

const structureKeys: StructureKey[] = [
  {
    label: "分数",
    preview: "□⁄□",
    emptyValue: String.raw`\frac{\placeholder{}}{\placeholder{}}`,
    selectedValue: String.raw`\frac{#0}{\placeholder{}}`
  },
  {
    label: "二乗",
    preview: "□²",
    emptyValue: String.raw`\placeholder{}^2`,
    selectedValue: String.raw`{#0}^2`,
    appendValue: String.raw`^2`
  },
  {
    label: "累乗",
    preview: "□ⁿ",
    emptyValue: String.raw`\placeholder{}^{\placeholder{}}`,
    selectedValue: String.raw`{#0}^{\placeholder{}}`,
    appendValue: String.raw`^{\placeholder{}}`
  },
  {
    label: "根号",
    preview: "√□",
    emptyValue: String.raw`\sqrt{\placeholder{}}`,
    selectedValue: String.raw`\sqrt{#0}`
  },
  {
    label: "括弧",
    preview: "(□)",
    emptyValue: String.raw`\left(\placeholder{}\right)`,
    selectedValue: String.raw`\left(#0\right)`
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
      value: String.raw`\sum_{\placeholder{}}^{\placeholder{}}\,\placeholder{}`,
      variants: [
        { label: "Π", value: String.raw`\prod_{\placeholder{}}^{\placeholder{}}\,\placeholder{}` }
      ]
    },
    { label: "Π", value: String.raw`\prod_{\placeholder{}}^{\placeholder{}}\,\placeholder{}` },
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
  ai: "AI用テキスト",
  plain: "テキスト",
  readable: "Readable",
  strict: "Strict β",
  latex: "LaTeX",
  markdown: "Markdown",
  mathml: "MathML",
  embed: "Embed"
};

const outputKinds = ["plain", "readable", "strict", "latex", "markdown", "mathml", "embed"] as const;
type VisibleOutputKind = (typeof outputKinds)[number];

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

function readValue(field: MathfieldElement | null, format: OutputFormat, fallback: string) {
  try {
    return field?.getValue(format) || fallback;
  } catch {
    return fallback;
  }
}

export function MathWorkspace() {
  const fieldRef = useRef<MathfieldElement | null>(null);
  const selectionHistoryRef = useRef<MathSelection[]>([]);
  const semanticStructureCacheRef = useRef(new Map<SemanticStructureKind, {
    latex: string;
    candidates: SemanticStructureCandidate[];
  }>());
  const protectedAnnouncementUntilRef = useRef(0);
  const longPressTimerRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);
  const variantTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstVariantRef = useRef<HTMLButtonElement | null>(null);
  const completionRef = useRef(true);
  const [latex, setLatex] = useState(initialLatex);
  const [outputKind, setOutputKind] = useState<VisibleOutputKind>("plain");
  const [aiAction, setAiAction] = useState<AiAction>("explain");
  const [aiPromptEnabled, setAiPromptEnabled] = useState(false);
  const [keyboardGroup, setKeyboardGroup] = useState<KeyboardGroup>("basic");
  const [variantKey, setVariantKey] = useState<MathKey | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [announcement, setAnnouncement] = useState("");
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saving" | "saved" | "unavailable">("loading");
  const [selectionSummary, setSelectionSummary] = useState<SelectionSummary>({
    kind: "caret",
    label: "カーソル"
  });
  const [selectionDepth, setSelectionDepth] = useState(0);
  const [semanticTarget, setSemanticTarget] = useState<SemanticTarget | null>(null);

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
    const handleSelectionChange = () => syncSelectionSummary(field);
    field.addEventListener("selection-change", handleSelectionChange);
    return () => {
      observer.disconnect();
      field.removeEventListener("selection-change", handleSelectionChange);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        saveDraft(window.localStorage, latex);
        setSaveState("saved");
        if (Date.now() >= protectedAnnouncementUntilRef.current) {
          setAnnouncement("この端末に下書きを保存しました。");
        }
      } catch {
        setSaveState("unavailable");
        setAnnouncement("端末内保存を利用できません。");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [latex, ready]);

  useEffect(() => () => cancelLongPress(), []);

  // MathLive upgrades the custom element after the first client render. Read
  // its converters on every render so a restored draft does not remain on the
  // LaTeX fallback after the field becomes available.
  const field = fieldRef.current;
  const expression = createExpression({
    latex,
    plainText: readValue(field, "plain-text", latex),
    strictText: readValue(field, "ascii-math", latex),
    spokenText: readValue(field, "spoken-text", latex),
    mathMl: readValue(field, "math-ml", "")
  });

  const serializedKind = outputKind === "plain" && aiPromptEnabled ? "ai" : outputKind;
  const output = serializeExpression(expression, serializedKind, { aiAction });
  const hasExpression = latex.trim().length > 0;
  const hasIntegral = /\\(?:iiint|iint|oint|int)(?=[^a-zA-Z]|$)/u.test(latex);
  const hasSum = /\\(?:sum|prod)(?=[^a-zA-Z]|$)/u.test(latex);
  const copyLabel = outputKind === "plain" && aiPromptEnabled
    ? "AI用テキスト"
    : outputLabels[outputKind];

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
    clearSelectionHistory();
    setLatex(field.value);
    navigator.vibrate?.(8);
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
    clearSelectionHistory();
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
    clearSelectionHistory();
    setLatex(field.value);
  }

  function copySelection(selection: Readonly<MathSelection>): MathSelection {
    const copied: MathSelection = {
      ranges: selection.ranges.map(([start, end]) => [start, end])
    };
    if (selection.direction) copied.direction = selection.direction;
    return copied;
  }

  function clearSelectionHistory() {
    selectionHistoryRef.current = [];
    setSelectionDepth(0);
    setSemanticTarget(null);
  }

  function announceSelection(message: string) {
    protectedAnnouncementUntilRef.current = Date.now() + 1000;
    setAnnouncement(message);
  }

  function describeSelectedLatex(selectedLatex: string): SelectionSummary {
    const normalized = selectedLatex.trim().replace(/^\{\s*/, "").trim();
    if (/^\\(?:d?frac|tfrac)\b/.test(normalized)) {
      return { kind: "structure", label: "分数全体" };
    }
    if (/^\\(?:i{1,3}nt|oint)(?=[^a-zA-Z]|$)/.test(normalized)) {
      return { kind: "structure", label: "積分全体" };
    }
    if (/^\\(?:sum|prod)(?=[^a-zA-Z]|$)/.test(normalized)) {
      return { kind: "structure", label: "総和・総乗全体" };
    }
    if (/^\\sqrt\b/.test(normalized)) return { kind: "structure", label: "根号全体" };
    if (/^\\left\b/.test(normalized)) return { kind: "structure", label: "括弧全体" };
    return { kind: "element", label: "現在の要素" };
  }

  function describeSelection(field: MathfieldElement): SelectionSummary {
    if (field.selectionIsCollapsed) return { kind: "caret", label: "カーソル" };
    return describeSelectedLatex(field.getValue(copySelection(field.selection), "latex"));
  }

  function syncSelectionSummary(field = fieldRef.current) {
    if (!field) return;
    setSelectionSummary(describeSelection(field));
  }

  function moveWithinStructure(command: "moveUp" | "moveDown", label: string) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const moved = field.executeCommand(command);
    clearSelectionHistory();
    syncSelectionSummary(field);
    announceSelection(moved ? `${label}へ移動しました。` : `${label}はありません。`);
  }

  function selectCurrentElement() {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    if (!field.selectionIsCollapsed) field.position = field.selection.ranges[0]?.[1] ?? field.position;
    field.executeCommand("moveToGroupStart");
    const start = field.position;
    field.executeCommand("moveToGroupEnd");
    const end = field.position;
    if (start === end) {
      field.executeCommand("selectGroup");
    } else {
      field.selection = { ranges: [[start, end]], direction: "forward" };
    }
    clearSelectionHistory();
    const summary = describeSelection(field);
    setSelectionSummary(summary);
    announceSelection(`${summary.label}を選択しました。`);
  }

  function selectOuterStructure() {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const previous = copySelection(field.selection);
    const [selectionStart, selectionEnd] = previous.ranges[0] ?? [field.position, field.position];
    const start = Math.min(selectionStart, selectionEnd);
    const end = Math.max(selectionStart, selectionEnd);
    const currentSummary = describeSelection(field);
    const minimumSpan = Math.max(1, end - start) + (currentSummary.kind === "structure" ? 1 : 0);
    let candidate: MathSelection | null = null;
    let candidateSummary: SelectionSummary | null = null;
    let checks = 0;
    for (let span = minimumSpan; span <= field.lastOffset && checks < 6000; span += 1) {
      const firstStart = Math.max(0, end - span);
      const lastStart = Math.min(start, field.lastOffset - span);
      for (let candidateStart = lastStart; candidateStart >= firstStart; candidateStart -= 1) {
        checks += 1;
        const inspected: MathSelection = {
          ranges: [[candidateStart, candidateStart + span]],
          direction: "forward"
        };
        const inspectedSummary = describeSelectedLatex(field.getValue(inspected, "latex"));
        if (inspectedSummary.kind !== "structure") continue;
        candidate = inspected;
        candidateSummary = inspectedSummary;
        break;
      }
      if (candidate) break;
    }
    if (!candidate || candidateSummary?.kind !== "structure") {
      field.selection = previous;
      announceSelection("これ以上外側の構造はありません。");
      return;
    }
    selectionHistoryRef.current.push(previous);
    setSelectionDepth(selectionHistoryRef.current.length);
    field.selection = candidate;
    setSelectionSummary(candidateSummary);
    announceSelection(`${candidateSummary.label}へ選択を広げました。`);
  }

  function selectInnerStructure() {
    const field = fieldRef.current;
    const previous = selectionHistoryRef.current.pop();
    if (!field || !previous) return;
    field.focus();
    field.selection = previous;
    setSelectionDepth(selectionHistoryRef.current.length);
    const summary = describeSelection(field);
    setSelectionSummary(summary);
    announceSelection(`${summary.label}へ戻りました。`);
  }

  function getSemanticStructureCandidates(field: MathfieldElement, kind: SemanticStructureKind) {
    const cached = semanticStructureCacheRef.current.get(kind);
    if (cached?.latex === field.value) return cached.candidates;
    const structureStarts: number[] = [];
    let previousOffsetStartsStructure = false;
    for (let start = 0; start < field.lastOffset; start += 1) {
      let startsStructure = false;
      const lookaheadEnd = Math.min(field.lastOffset, start + 32);
      for (let end = start + 1; end <= lookaheadEnd; end += 1) {
        const preview = field.getValue({ ranges: [[start, end]], direction: "forward" }, "latex");
        if (parseSemanticStructure(preview)?.kind !== kind) continue;
        startsStructure = true;
        break;
      }
      if (startsStructure && !previousOffsetStartsStructure) structureStarts.push(start);
      previousOffsetStartsStructure = startsStructure;
    }
    const candidateStarts = structureStarts.length > 0
      ? structureStarts
      : Array.from({ length: field.lastOffset }, (_, index) => index);
    const candidates: SemanticStructureCandidate[] = [];
    let checks = 0;
    for (const start of candidateStarts) {
      for (let end = start + 1; end <= field.lastOffset && checks < 12_000; end += 1) {
        checks += 1;
        const selection: MathSelection = { ranges: [[start, end]], direction: "forward" };
        const structure = parseSemanticStructure(field.getValue(selection, "latex"));
        if (structure?.kind !== kind) continue;
        const filledSlots = structure.slots.filter((slot) => normalizeSlotLatex(slot.latex)).length;
        const contentLength = structure.slots.reduce(
          (total, slot) => total + normalizeSlotLatex(slot.latex).length,
          0
        );
        candidates.push({
          selection,
          structure,
          start,
          end,
          span: end - start,
          filledSlots,
          contentLength
        });
      }
    }
    semanticStructureCacheRef.current.set(kind, { latex: field.value, candidates });
    return candidates;
  }

  function findSemanticStructure(field: MathfieldElement, kind: SemanticStructureKind, slotId: SemanticSlot["id"]) {
    const [selectionStart, selectionEnd] = field.selection.ranges[0] ?? [field.position, field.position];
    const currentStart = Math.min(selectionStart, selectionEnd);
    const currentEnd = Math.max(selectionStart, selectionEnd);
    type RankedCandidate = SemanticStructureCandidate & {
      containsCurrent: boolean;
      distance: number;
      boundaryAffinity: number;
      startDistance: number;
    };
    const isBetterCandidate = (candidate: RankedCandidate, best: RankedCandidate | null) => {
      if (!best) return true;
      if (candidate.containsCurrent !== best.containsCurrent) return candidate.containsCurrent;
      if (candidate.distance !== best.distance) return candidate.distance < best.distance;
      if (candidate.boundaryAffinity !== best.boundaryAffinity) {
        return candidate.boundaryAffinity > best.boundaryAffinity;
      }
      if (candidate.startDistance !== best.startDistance) return candidate.startDistance < best.startDistance;
      if (candidate.filledSlots !== best.filledSlots) return candidate.filledSlots > best.filledSlots;
      if (candidate.contentLength !== best.contentLength) return candidate.contentLength > best.contentLength;
      return candidate.span < best.span;
    };
    let best: RankedCandidate | null = null;
    for (const base of getSemanticStructureCandidates(field, kind)) {
      if (!base.structure.slots.some(
        (slot) => slot.id === slotId && normalizeSlotLatex(slot.latex)
      )) continue;
      const { start, end } = base;
      const containsCurrent = start <= currentStart && end >= currentEnd;
      const distance = containsCurrent
        ? 0
        : Math.min(Math.abs(start - currentEnd), Math.abs(end - currentStart));
      const candidate = {
        ...base,
        containsCurrent,
        distance,
        boundaryAffinity: currentStart === currentEnd && end === currentStart ? 1 : 0,
        startDistance: start <= currentStart ? currentStart - start : start - currentEnd
      };
      if (isBetterCandidate(candidate, best)) best = candidate;
    }
    return best ? { selection: best.selection, structure: best.structure } : null;
  }

  function findSlotSelection(
    field: MathfieldElement,
    structureSelection: MathSelection,
    structure: SemanticStructure,
    slot: SemanticSlot
  ) {
    const [structureStart, structureEnd] = structureSelection.ranges[0] ?? [0, field.lastOffset];
    const target = normalizeSlotLatex(slot.latex);
    if (!target) return null;
    const traversalOrder = structure.kind === "integral"
      ? ["upper", "lower", "body", "variable"]
      : ["upper", "lower", "body"];
    const sameValueSlots = structure.slots
      .filter((candidate) => normalizeSlotLatex(candidate.latex) === target)
      .sort((left, right) => traversalOrder.indexOf(left.id) - traversalOrder.indexOf(right.id));
    const duplicateIndex = Math.max(0, sameValueSlots.findIndex((candidate) => candidate.id === slot.id));
    let distinct: MathSelection[] = [];
    let checks = 0;
    for (let span = 1; span <= structureEnd - structureStart && checks < 4000; span += 1) {
      const matches: MathSelection[] = [];
      for (let start = structureStart; start + span <= structureEnd && checks < 4000; start += 1) {
        checks += 1;
        const selection: MathSelection = { ranges: [[start, start + span]], direction: "forward" };
        if (normalizeSlotLatex(field.getValue(selection, "latex")) === target) matches.push(selection);
      }
      if (matches.length === 0) continue;
      distinct = matches.reduce<MathSelection[]>((result, candidate) => {
        const [start, end] = candidate.ranges[0] ?? [0, 0];
        const overlaps = result.some((existing) => {
          const [existingStart, existingEnd] = existing.ranges[0] ?? [0, 0];
          return start < existingEnd && end > existingStart;
        });
        if (!overlaps) result.push(candidate);
        return result;
      }, []);
      if (slot.id === "variable" || distinct.length > duplicateIndex) break;
    }
    distinct.sort((left, right) => (left.ranges[0]?.[0] ?? 0) - (right.ranges[0]?.[0] ?? 0));
    if (slot.id === "variable") return distinct.at(-1) ?? null;
    return distinct[duplicateIndex] ?? distinct[0] ?? null;
  }

  function selectSemanticSlot(kind: SemanticStructureKind, slotId: SemanticSlot["id"]) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    const found = findSemanticStructure(field, kind, slotId);
    const slot = found?.structure.slots.find((candidate) => candidate.id === slotId);
    if (!found || !slot) {
      announceSelection(kind === "integral" ? "選択できる積分要素がありません。" : "選択できるシグマ要素がありません。");
      return;
    }
    const selection = findSlotSelection(field, found.selection, found.structure, slot);
    if (!selection) {
      announceSelection(`${slot.label}はまだ入力されていません。`);
      return;
    }
    clearSelectionHistory();
    field.selection = selection;
    const label = `${found.structure.label}・${slot.label}`;
    setSelectionSummary({ kind: "element", label });
    setSemanticTarget(`${kind}:${slot.id}`);
    announceSelection(`${label}を選択しました。`);
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
    clearSelectionHistory();
    setEditorMode("visual");
    setAnnouncement("新しい数式を開始しました。");
    window.setTimeout(() => fieldRef.current?.focus());
  }

  async function copyOutput() {
    if (!hasExpression) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
      setAnnouncement(`${copyLabel}をコピーしました。`);
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
            aria-label={`${copyLabel}をコピー`}
            disabled={!hasExpression}
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
              clearSelectionHistory();
              setLatex((event.currentTarget as MathfieldElement).value);
            }}
          >
            {latex}
          </math-field>
        )}
        {ready && hasExpression && editorMode === "visual" && (
          <div
            className={`structure-navigator structure-navigator-${selectionSummary.kind}`}
            role="group"
            aria-label="数式内の要素を選択"
          >
            <span className="selection-status" aria-hidden="true">
              <span className="selection-status-dot" />
              {selectionSummary.label}
              {selectionDepth > 0 && <small>外側 +{selectionDepth}</small>}
            </span>
            <div className="structure-navigator-actions">
              <button type="button" onClick={() => moveWithinStructure("moveUp", "上の要素")}>上へ</button>
              <button type="button" onClick={() => moveWithinStructure("moveDown", "下の要素")}>下へ</button>
              <button type="button" onClick={selectCurrentElement}>要素を選択</button>
              <button type="button" disabled={selectionDepth === 0} onClick={selectInnerStructure}>内側へ</button>
              <button type="button" onClick={selectOuterStructure}>外側へ</button>
            </div>
            {(hasIntegral || hasSum) && (
              <div className="semantic-navigator" role="group" aria-label="数式構造の要素">
                {([hasIntegral && "integral", hasSum && "sum"].filter(Boolean) as SemanticStructureKind[]).map((kind) => (
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
                          onClick={() => selectSemanticSlot(kind, slot.id)}
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
        <div className="structure-bar" role="group" aria-label="数式の構造">
          <span className="structure-label">構造</span>
          <div className="structure-keys">
            {structureKeys.map((key) => (
              <button
                key={key.label}
                type="button"
                aria-label={`${key.label}を挿入`}
                onClick={() => insertStructure(key)}
              >
                <span aria-hidden="true">{key.preview}</span>
                <span>{key.label}</span>
              </button>
            ))}
          </div>
        </div>
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
                        onChange={(event) => setAiPromptEnabled(event.currentTarget.checked)}
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
                          onClick={() => setAiAction(action)}
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
