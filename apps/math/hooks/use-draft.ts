"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadDraft, removeDraft, saveDraft } from "../lib/draft";

export type SaveState = "loading" | "saving" | "saved" | "unavailable";

const saveDelay = 450;

/**
 * Device-local draft recovery. The draft is read once on mount and written back
 * after the writer pauses; nothing leaves the browser.
 */
export function useDraft(latex: string, onRestore: (latex: string) => void) {
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const restoreRef = useRef(onRestore);
  const loadedRef = useRef(false);
  restoreRef.current = onRestore;

  useEffect(() => {
    try {
      const restored = loadDraft(window.localStorage);
      if (restored) restoreRef.current(restored.latex);
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
