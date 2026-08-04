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
import { Mojikumi } from "@mojikumi/react";
import { PRESETS } from "mojikumi";
import type { Dictionary } from "../../content";
import { CheckIcon, ChevronDownIcon } from "../icons";
import { Snippet } from "../snippet";
import { TextEditor } from "./text-editor";

type PresetName = "minimal" | "article" | "book";
type Precision = "auto" | "full";
type Overrides = { justify?: boolean; indent?: boolean };
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
  { value: "minimal", label: "Minimal" },
  { value: "article", label: "Article" },
  { value: "book", label: "Book" }
];

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
        <span className="select-chevron" aria-hidden="true">
          <ChevronDownIcon size={16} />
        </span>
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
                {option.value === value ? <CheckIcon size={14} /> : null}
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

function ToggleControl({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="debug-control">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="check-mark" aria-hidden="true">
        <CheckIcon size={12} />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function Playground({ dictionary }: { dictionary: Dictionary }) {
  const { controls, status, samples, sampleText } = dictionary.playground;
  const [text, setText] = useState(sampleText);
  const [preset, setPreset] = useState<PresetName>("minimal");
  const [font, setFont] = useState<"serif" | "sans-serif">("serif");
  const [size, setSize] = useState(18);
  const [width, setWidth] = useState(24);
  const [precision, setPrecision] = useState<Precision>("auto");
  const [debug, setDebug] = useState(false);
  /*
   * Only what the reader changed away from the preset. Everything downstream
   * reads the effective value, and the snippet prints just these — so what it
   * hands over is the shortest tag that reproduces what is on screen.
   */
  const [overrides, setOverrides] = useState<Overrides>({});
  const [support, setSupport] = useState<SupportState | null>(null);
  const editorLabelId = useId();

  const defaults = PRESETS[preset];
  const justify = overrides.justify ?? defaults.justify;
  const indent = overrides.indent ?? Boolean(defaults.indent);

  function choosePreset(next: PresetName) {
    setPreset(next);
    setOverrides({});
  }

  function override(key: keyof Overrides, value: boolean) {
    setOverrides((current) => {
      const next = { ...current, [key]: value };
      /* Back at the preset's own answer is the same as never having said. */
      if (value === (key === "indent" ? Boolean(defaults.indent) : defaults[key])) {
        delete next[key];
      }
      return next;
    });
  }

  const snippet = [
    "<script",
    '  src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"',
    `  data-style="${preset}"`,
    ...(overrides.justify === undefined
      ? []
      : [`  data-justify="${overrides.justify}"`]),
    ...(overrides.indent === undefined
      ? []
      : [`  data-indent="${overrides.indent}"`]),
    "></script>"
  ].join("\n");

  const fontOptions: ControlOption<"serif" | "sans-serif">[] = [
    { value: "serif", label: controls.fontSerif },
    { value: "sans-serif", label: controls.fontSans }
  ];

  const precisionOptions: ControlOption<Precision>[] = [
    { value: "auto", label: controls.precisionAuto },
    { value: "full", label: controls.precisionFull }
  ];

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

  const baseFont =
    font === "serif" ? "var(--font-display)" : "var(--font-ui)";
  // YakuHanJP only carries punctuation, so the running text comes from whatever
  // sits behind it. Noto Sans JP is the face the subset was cut from, which is
  // also how YakuHanJP is normally deployed.
  const yakuhanFont =
    font === "serif"
      ? "YakuHanMP, var(--font-display)"
      : "YakuHanJP, var(--font-yakuhan-sans)";

  /*
   * The three comparison cards take the alignment being demonstrated, so that
   * the only difference left between them is the typography. The Mojikumi card
   * is not given one: the preset decides it there, and an inline value would
   * also beat the check that withdraws justification from a line it wrecked.
   */
  const sampleStyle = {
    "--sample-width": `${width}em`,
    "--sample-font": baseFont,
    fontSize: `${size}px`,
    textAlign: justify ? "justify" : "start"
  } as CSSProperties;

  const yakuhanStyle = {
    ...sampleStyle,
    "--sample-font": yakuhanFont
  } as CSSProperties;

  const mojikumiStyle = {
    "--sample-width": `${width}em`,
    "--sample-font": baseFont,
    fontSize: `${size}px`
  } as CSSProperties;

  /*
   * Line ends only count as missing where the text is justified: a ragged line
   * has nothing to the right of its final comma, so trimming it is not a
   * feature this setting is going without.
   */
  const missing = support
    ? [
        !support.trim && status.missing.punctuation,
        defaults.lineStartTrim && !support.trimStart && status.missing.lineStart,
        defaults.lineEndTrim &&
          justify &&
          !support.trimBoth &&
          status.missing.lineEnd,
        defaults.autospace && !support.autospace && status.missing.autospace
      ].filter(Boolean)
    : [];
  /* This playground only offers auto and full, so the fallback is never off. */
  const usingFallback = precision === "full" || missing.length > 0;

  function reset() {
    setText(sampleText);
    setPreset("minimal");
    setOverrides({});
    setFont("serif");
    setSize(18);
    setWidth(24);
    setPrecision("auto");
    setDebug(false);
  }

  return (
    <section
      className="playground-workspace"
      aria-label={dictionary.playground.regionLabel}
    >
      <aside className="playground-controls">
        <div className="controls-heading">
          <strong>{controls.heading}</strong>
          <button type="button" onClick={reset}>
            {controls.reset}
          </button>
        </div>

        <TextEditor
          label={controls.text}
          labelId={editorLabelId}
          text={text}
          preset={preset}
          onChange={setText}
        />

        <div className="control-grid">
          <SelectControl
            label={controls.preset}
            value={preset}
            options={presetOptions}
            onChange={choosePreset}
          />

          <SegmentedControl
            label={controls.font}
            name="sample-font"
            value={font}
            options={fontOptions}
            onChange={setFont}
          />

          <SegmentedControl
            label={controls.precision}
            name="sample-precision"
            value={precision}
            options={precisionOptions}
            onChange={setPrecision}
          />

          <RangeControl
            label={controls.size}
            value={size}
            unit={controls.sizeUnit}
            min={14}
            max={32}
            onChange={setSize}
          />

          <RangeControl
            label={controls.width}
            value={width}
            unit={controls.widthUnit}
            min={14}
            max={42}
            onChange={setWidth}
          />
        </div>

        <p className="preset-note">{controls.presetNotes[preset]}</p>

        <div className="modifier-controls">
          <ToggleControl
            label={controls.justify}
            checked={justify}
            onChange={(value) => override("justify", value)}
          />
          <ToggleControl
            label={controls.indent}
            checked={indent}
            onChange={(value) => override("indent", value)}
          />
          <ToggleControl
            label={controls.debug}
            checked={debug}
            onChange={setDebug}
          />
        </div>

        {/* What is on screen, as the tag that reproduces it. */}
        <div className="playground-snippet">
          <p>{controls.snippetNote}</p>
          <Snippet
            language="HTML"
            source={snippet}
            title={dictionary.playground.title}
            labels={dictionary.codeCopy}
          />
        </div>
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
                ? status.fallbackDemo
                : missing.length > 0
                  ? `${status.supplementing}${missing.join(status.missingSeparator)}`
                  : status.native}
            </strong>
          </div>
          <p>{status.note}</p>
        </div>

        <article className="sample-card sample-card-before">
          <header>
            <span className="sample-index">01</span>
            <strong>{samples.before.title}</strong>
            <small>{samples.before.note}</small>
          </header>
          <div className="sample-text" lang="ja" style={sampleStyle}>
            <Paragraphs text={text} />
          </div>
        </article>

        <article className="sample-card sample-card-yakuhan">
          <header>
            <span className="sample-index">02</span>
            <strong>{samples.yakuhan.title}</strong>
            <small>{samples.yakuhan.note}</small>
          </header>
          <div className="sample-text" lang="ja" style={yakuhanStyle}>
            <Paragraphs text={text} />
          </div>
        </article>

        <article className="sample-card">
          <header>
            <span className="sample-index">03</span>
            <strong>{samples.native.title}</strong>
            <small>{samples.native.note}</small>
          </header>
          <div
            className="sample-text mjk mjk-minimal"
            lang="ja"
            style={sampleStyle}
          >
            <Paragraphs text={text} />
          </div>
        </article>

        <article className="sample-card sample-card-active">
          <header>
            <span className="sample-index">04</span>
            <strong>{samples.mojikumi.title}</strong>
            <small>
              {usingFallback
                ? samples.mojikumi.noteFallback
                : samples.mojikumi.noteNative}
            </small>
          </header>
          {/*
           * Observation stays on. React replaces these paragraphs whenever the
           * text changes, which throws away the generated markup, and the
           * measure slider moves the line breaks without touching the DOM at
           * all. The mutation and resize observers are what pick both up.
           */}
          <Mojikumi
            key={font}
            as="div"
            className="sample-text"
            lang="ja"
            preset={preset}
            precision={precision}
            debug={debug}
            justify={justify}
            indent={indent}
            style={mojikumiStyle}
          >
            <Paragraphs text={text} />
          </Mojikumi>
        </article>

        <p className="comparison-credit">{dictionary.playground.credit}</p>
      </section>
    </section>
  );
}
