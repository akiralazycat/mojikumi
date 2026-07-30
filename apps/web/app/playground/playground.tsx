"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";
import { detectNativeSupport } from "@mojikumi/dom";
import { Mojikumi, useMojikumi } from "@mojikumi/react";

type PresetName = "web" | "book" | "editorial" | "minimal" | "native";
type Precision = "auto" | "full";
type SupportState = {
  trim: boolean;
  trimStart: boolean;
  trimBoth: boolean;
  autospace: boolean;
};
type ControlOption<T extends string> = {
  value: T;
  label: string;
};

const presetOptions: ControlOption<PresetName>[] = [
  { value: "web", label: "Web" },
  { value: "book", label: "Book" },
  { value: "editorial", label: "Editorial" },
  { value: "minimal", label: "Minimal" },
  { value: "native", label: "Native" }
];

const fontOptions: ControlOption<"serif" | "sans-serif">[] = [
  { value: "serif", label: "明朝" },
  { value: "sans-serif", label: "ゴシック" }
];

const precisionOptions: ControlOption<Precision>[] = [
  { value: "auto", label: "Auto" },
  { value: "full", label: "Fallback" }
];

const sample =
  "『行頭の括弧』は、半角分のアキを詰めると版面が揃います。\n\nNext.jsと日本語、GPT-5を使う100円の本。約物「（例）」が連続する場面や、改行直後の『括弧』も比較できます。";

const presetRequirements: Record<
  PresetName,
  { start: boolean; both: boolean; autospace: boolean }
> = {
  web: { start: true, both: false, autospace: true },
  book: { start: true, both: true, autospace: true },
  editorial: { start: true, both: true, autospace: false },
  minimal: { start: false, both: false, autospace: false },
  native: { start: true, both: true, autospace: true }
};

function Paragraphs({ text }: { text: string }) {
  return text.split(/\n{2,}/u).map((paragraph, index) => (
    <p key={`${index}-${paragraph}`}>{paragraph}</p>
  ));
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: readonly ControlOption<T>[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selected = options[selectedIndex];
  if (!selected) throw new Error("SelectControl requires at least one option.");

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const selectOffset = (offset: number) => {
    const index = Math.min(
      options.length - 1,
      Math.max(0, selectedIndex + offset)
    );
    const option = options[index];
    if (option) onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selectOffset(event.key === "ArrowDown" ? 1 : -1);
      setOpen(true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const option = options[event.key === "Home" ? 0 : options.length - 1];
      if (option) onChange(option.value);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="control-field custom-select" ref={rootRef}>
      <span id={labelId}>{label}</span>
      <button
        type="button"
        className="select-trigger"
        aria-labelledby={`${labelId} ${listId}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span id={`${listId}-value`}>{selected.label}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      {open ? (
        <div
          className="select-options"
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className="select-option"
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
              <span className="select-option-mark" aria-hidden="true">
                {option.value === value ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  name,
  value,
  options,
  onChange
}: {
  label: string;
  name: string;
  value: T;
  options: readonly ControlOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="control-field segmented-field">
      <legend>{label}</legend>
      <div className="segmented-control">
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RangeControl({
  label,
  value,
  unit,
  min,
  max,
  onChange
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <label className="control-field">
      <span>
        {label} <output aria-label={`${label} ${value}`}>{value}{unit}</output>
      </span>
      <span
        className="range-control"
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
      >
        <span className="range-track" aria-hidden="true">
          <span />
        </span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </span>
    </label>
  );
}

export function Playground() {
  const [text, setText] = useState(sample);
  const [preset, setPreset] = useState<PresetName>("web");
  const [font, setFont] = useState<"serif" | "sans-serif">("serif");
  const [size, setSize] = useState(18);
  const [width, setWidth] = useState(24);
  const [precision, setPrecision] = useState<Precision>("auto");
  const [debug, setDebug] = useState(false);
  const [support, setSupport] = useState<SupportState | null>(null);
  const inputRef = useMojikumi<HTMLTextAreaElement>({
    preset,
    precision: "native",
    observe: false
  });

  useEffect(() => {
    let cancelled = false;
    const updateSupport = () => {
      const context = document.querySelector<HTMLElement>(
        ".sample-card-active .sample-text"
      );
      const detected = detectNativeSupport(window, context ?? undefined);
      if (!cancelled) {
        setSupport({
          trim: detected.textSpacingTrim,
          trimStart: detected.textSpacingTrimStart,
          trimBoth: detected.textSpacingTrimBoth,
          autospace: detected.textAutospace
        });
      }
    };

    updateSupport();
    void document.fonts?.ready.then(updateSupport);
    return () => {
      cancelled = true;
    };
  }, [font]);

  const sampleStyle = {
    "--sample-width": `${width}em`,
    "--sample-font":
      font === "serif"
        ? "var(--font-display)"
        : "var(--font-ui)",
    fontSize: `${size}px`
  } as CSSProperties;

  const requirements = presetRequirements[preset];
  const missing = support
    ? [
        !support.trim && "約物間",
        requirements.start && !support.trimStart && "行頭",
        requirements.both && !support.trimBoth && "行末",
        requirements.autospace && !support.autospace && "和欧文間"
      ].filter(Boolean)
    : [];
  const allowsFallback = preset !== "native";
  const usingFallback =
    allowsFallback && (precision === "full" || missing.length > 0);

  function reset() {
    setText(sample);
    setPreset("web");
    setFont("serif");
    setSize(18);
    setWidth(24);
    setPrecision("auto");
    setDebug(false);
  }

  return (
    <section className="playground-workspace" aria-label="Mojikumi比較ツール">
      <aside className="playground-controls">
        <div className="controls-heading">
          <strong>組版設定</strong>
          <button type="button" onClick={reset}>
            初期値に戻す
          </button>
        </div>

        <label className="control-field control-field-text">
          <span>テキスト</span>
          <textarea
            ref={inputRef}
            rows={8}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>

        <div className="control-grid">
          <SelectControl
            label="プリセット"
            value={preset}
            options={presetOptions}
            onChange={setPreset}
          />

          <SegmentedControl
            label="フォント"
            name="sample-font"
            value={font}
            options={fontOptions}
            onChange={setFont}
          />

          <SegmentedControl
            label="補完モード"
            name="sample-precision"
            value={precision}
            options={precisionOptions}
            onChange={setPrecision}
          />

          <RangeControl
            label="文字サイズ"
            value={size}
            unit="px"
            min={14}
            max={32}
            onChange={setSize}
          />

          <RangeControl
            label="行幅"
            value={width}
            unit="em"
            min={14}
            max={42}
            onChange={setWidth}
          />
        </div>

        <label className="debug-control">
          <input
            type="checkbox"
            checked={debug}
            onChange={(event) => setDebug(event.target.checked)}
          />
          <span className="check-mark" aria-hidden="true">
            <span />
          </span>
          <span>約物クラスと調整位置を表示</span>
        </label>
      </aside>

      <section className="comparison" aria-live="polite">
        <div className="compat-status">
          <div>
            <span
              className={`compat-status-dot ${
                usingFallback ? "is-fallback" : "is-native"
              }`}
              aria-hidden="true"
            />
            <strong>
              {precision === "full"
                ? allowsFallback
                  ? "DOMフォールバックを再現中"
                  : "Nativeプリセット：標準CSSのみ"
                : missing.length > 0
                  ? allowsFallback
                    ? `不足機能を補完中：${missing.join("・")}`
                    : "Nativeプリセット：標準CSSのみ"
                  : "このブラウザでは標準CSSを使用中"}
            </strong>
          </div>
          <p>
            Autoは対応済みの標準CSSを優先します。Fallback demoでは、
            未対応ブラウザ向けの補完結果を強制表示します。
          </p>
        </div>

        <article className="sample-card sample-card-before">
          <header>
            <span className="sample-index">01</span>
            <div>
              <strong>Unadjusted</strong>
              <small>比較用：約物調整なし</small>
            </div>
          </header>
          <div className="sample-text" style={sampleStyle}>
            <Paragraphs text={text} />
          </div>
        </article>

        <article className="sample-card">
          <header>
            <span className="sample-index">02</span>
            <div>
              <strong>Native CSS</strong>
              <small>現在のブラウザの標準実装</small>
            </div>
          </header>
          <div
            className="sample-text mjk mjk-native"
            lang="ja"
            style={sampleStyle}
          >
            <Paragraphs text={text} />
          </div>
        </article>

        <article className="sample-card sample-card-active">
          <header>
            <span className="sample-index">03</span>
            <div>
              <strong>Mojikumi</strong>
              <small>
                {usingFallback
                  ? "標準CSS ＋ DOM補完"
                  : preset === "native"
                    ? "標準CSSのみ"
                    : "標準CSSをそのまま使用"}
              </small>
            </div>
          </header>
          <Mojikumi
            key={font}
            as="div"
            className="sample-text"
            preset={preset}
            precision={precision}
            observe={false}
            debug={debug}
            style={sampleStyle}
          >
            <Paragraphs text={text} />
          </Mojikumi>
        </article>
      </section>
    </section>
  );
}
