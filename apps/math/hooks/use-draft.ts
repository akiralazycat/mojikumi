"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadDraft, removeDraft, saveDraft } from "../lib/draft";

export type SaveState = "loading" | "saving" | "saved" | "unavailable";
export type RestoreSource = "draft" | "shared";
export type StartupExpression = { latex: string; source: RestoreSource };

const saveDelay = 450;

/**
 * Device-local draft recovery. An optional startup expression (for example a
 * URL fragment) takes precedence over the saved draft; nothing leaves the browser.
 */
export function useDraft(
  latex: string,
  onRestore: (latex: string, source: RestoreSource) => void,
  readStartupExpression?: () => StartupExpression | null
) {
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const restoreRef = useRef(onRestore);
  const startupRef = useRef(readStartupExpression);
  const loadedRef = useRef(false);
  restoreRef.current = onRestore;
  startupRef.current = readStartupExpression;

  useEffect(() => {
    try {
      const startup = startupRef.current?.() ?? null;
      if (startup?.latex.trim()) {
        restoreRef.current(startup.latex, startup.source);
      } else {
        const restored = loadDraft(window.localStorage);
        if (restored) restoreRef.current(restored.latex, "draft");
      }
      setSaveState("saved");
    } catch {
      setSaveState("unavailable");
    }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    setSaveState((current) => current === "unavailable" ? current : "saving");
    const timer = window.setTimeout(() => {
      try {
        saveDraft(window.localStorage, latex);
        setSaveState("saved");
      } catch {
        setSaveState("unavailable");
      }
    }, saveDelay);
    return () => window.clearTimeout(timer);
  }, [latex]);

  const clear = useCallback(() => {
    try {
      removeDraft(window.localStorage);
    } catch {
      setSaveState("unavailable");
    }
  }, []);

  return { saveState, clear };
}
