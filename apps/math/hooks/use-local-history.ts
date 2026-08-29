"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearHistory,
  loadHistory,
  rememberHistory,
  removeHistoryEntry,
  type MathHistoryEntry
} from "../lib/history";

const historyDelay = 1600;

export function useLocalHistory(latex: string) {
  const [entries, setEntries] = useState<MathHistoryEntry[]>([]);
  const [available, setAvailable] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      setEntries(loadHistory(window.localStorage));
    } catch {
      setAvailable(false);
    }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current || !latex.trim()) return;
    const timer = window.setTimeout(() => {
      try {
        setEntries(rememberHistory(window.localStorage, latex));
      } catch {
        setAvailable(false);
      }
    }, historyDelay);
    return () => window.clearTimeout(timer);
  }, [latex]);

  const remember = useCallback((value: string) => {
    if (!value.trim()) return;
    try {
      setEntries(rememberHistory(window.localStorage, value));
    } catch {
      setAvailable(false);
    }
  }, []);

  const remove = useCallback((value: string) => {
    try {
      setEntries(removeHistoryEntry(window.localStorage, value));
    } catch {
      setAvailable(false);
    }
  }, []);

  const clear = useCallback(() => {
    try {
      clearHistory(window.localStorage);
      setEntries([]);
    } catch {
      setAvailable(false);
    }
  }, []);

  return { entries, available, remember, remove, clear };
}
