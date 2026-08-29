"use client";

import type { MathHistoryEntry } from "../lib/history";

export function HistoryPanel({
  entries,
  available,
  onOpen,
  onRemove,
  onClear,
  onClose
}: {
  entries: MathHistoryEntry[];
  available: boolean;
  onOpen: (latex: string) => void;
  onRemove: (latex: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="workspace-drawer history-panel" role="region" aria-label="この端末の数式履歴">
      <div className="workspace-drawer-heading">
        <div>
          <strong>この端末の履歴</strong>
          <span>最大12件。アカウントやサーバーには保存しません</span>
        </div>
        <button type="button" className="workspace-drawer-close" onClick={onClose} aria-label="履歴を閉じる">×</button>
      </div>
      {!available ? (
        <p className="history-empty">このブラウザでは端末内履歴を利用できません。</p>
      ) : entries.length === 0 ? (
        <p className="history-empty">まだ履歴はありません。入力が止まると自動で残ります。</p>
      ) : (
        <div className="history-list">
          {entries.map((entry) => (
            <div className="history-entry" key={`${entry.updatedAt}:${entry.latex}`}>
              <button type="button" className="history-open" onClick={() => onOpen(entry.latex)}>
                <code>{entry.latex}</code>
              </button>
              <button
                type="button"
                className="history-remove"
                aria-label="この履歴を削除"
                onClick={() => onRemove(entry.latex)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {available && entries.length > 0 && (
        <button type="button" className="history-clear" onClick={onClear}>履歴をすべて消去</button>
      )}
    </div>
  );
}
