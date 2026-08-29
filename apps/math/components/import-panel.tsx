"use client";

import { useMemo } from "react";
import { detectImportSource } from "../lib/import-source";

export function ImportPanel({
  value,
  busy,
  onValueChange,
  onImport,
  onClose
}: {
  value: string;
  busy: boolean;
  onValueChange: (value: string) => void;
  onImport: () => void;
  onClose: () => void;
}) {
  const detection = useMemo(() => detectImportSource(value), [value]);
  return (
    <div className="workspace-drawer import-panel" role="region" aria-label="数式を読み込む">
      <div className="workspace-drawer-heading">
        <div>
          <strong>数式を読み込む</strong>
          <span>LaTeX / AsciiMath / MathML / Unicodeを自動判定します</span>
        </div>
        <button type="button" className="workspace-drawer-close" onClick={onClose} aria-label="読み込みを閉じる">×</button>
      </div>
      <label className="import-source-field">
        <span>貼り付ける</span>
        <textarea
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          placeholder={String.raw`例: \frac{1}{2} / sqrt(x) / <math>…</math>`}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </label>
      <div className="import-panel-actions">
        <span className="import-detection" aria-live="polite">
          {value.trim() ? `${detection.label}として認識` : "形式を自動判定"}
        </span>
        <button type="button" disabled={!value.trim() || busy} onClick={onImport}>
          {busy ? "読み込み中…" : "この数式を読み込む"}
        </button>
      </div>
    </div>
  );
}
