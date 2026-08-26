"use client";

import { useEffect, useRef, useState } from "react";
import { StructureGlyph } from "./structure-glyph";
import {
  keyboardGroups,
  keyboardLabels,
  keys,
  structureKeys,
  type KeyboardGroup,
  type MathKey,
  type StructureKey
} from "../lib/keyboard";

const longPressDelay = 420;

export function MathKeyboard({
  onInsert,
  onInsertStructure
}: {
  onInsert: (value: string) => void;
  onInsertStructure: (key: StructureKey) => void;
}) {
  const longPressTimerRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);
  const variantTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstVariantRef = useRef<HTMLButtonElement | null>(null);
  const [group, setGroup] = useState<KeyboardGroup>("basic");
  const [variantKey, setVariantKey] = useState<MathKey | null>(null);

  function cancelLongPress() {
    if (longPressTimerRef.current === null) return;
    window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }

  useEffect(() => () => cancelLongPress(), []);

  useEffect(() => {
    if (variantKey) firstVariantRef.current?.focus();
  }, [variantKey]);

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
    }, longPressDelay);
  }

  function activateKey(key: MathKey) {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    onInsert(key.value);
  }

  return (
    <div className="keyboard" aria-label="数式キーボード">
      <div className="structure-bar" role="group" aria-label="数式の構造">
        <span className="structure-label">構造</span>
        <div className="structure-keys">
          {structureKeys.map((key) => (
            <button
              key={key.label}
              type="button"
              aria-label={`${key.label}を挿入`}
              onClick={() => onInsertStructure(key)}
            >
              <span aria-hidden="true"><StructureGlyph name={key.glyph} /></span>
              <span>{key.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="keyboard-tabs">
        {keyboardGroups.map((candidate) => (
          <button
            key={candidate}
            type="button"
            aria-pressed={group === candidate}
            onClick={() => {
              setGroup(candidate);
              closeVariants(false);
            }}
          >
            {keyboardLabels[candidate]}
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
              onClick={() => {
                onInsert(variant.value);
                closeVariants();
              }}
            >
              {variant.label}
            </button>
          ))}
          <button className="variant-close" type="button" onClick={() => closeVariants()} aria-label="閉じる">×</button>
        </div>
      )}
      <div className="key-grid">
        {keys[group].map((key) => (
          <div className="math-key" key={`${group}-${key.label}`}>
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
  );
}
