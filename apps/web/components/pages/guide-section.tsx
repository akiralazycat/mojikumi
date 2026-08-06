"use client";

import { useId, useState } from "react";
import type { Dictionary, Guide } from "../../content";
import { Snippet } from "../snippet";

type StyleName = "minimal" | "article" | "book";

const STYLES: StyleName[] = ["minimal", "article", "book"];

/*
 * The guides are written around one tag, and which of the three it names is the
 * one decision a reader has to make before pasting. Making it here means the
 * snippet they copy is the one they chose, rather than a default they have to
 * remember to edit afterwards.
 */
function withStyle(source: string, style: StyleName): string {
  return source.replace(/data-style="[^"]*"/gu, `data-style="${style}"`);
}

/*
 * All three descriptions stay on screen at once. This is a decision made once,
 * by reading — a segmented control shows only the selected note, which makes
 * comparing the options a matter of clicking through them and remembering.
 */
function StylePicker({
  label,
  notes,
  value,
  onChange
}: {
  label: string;
  notes: Record<StyleName, string>;
  value: StyleName;
  onChange: (value: StyleName) => void;
}) {
  const name = useId();

  return (
    <fieldset className="style-picker">
      <legend>{label}</legend>
      {STYLES.map((style) => (
        <label className="style-option" key={style}>
          <input
            type="radio"
            name={name}
            value={style}
            checked={style === value}
            onChange={() => onChange(style)}
          />
          <span className="style-option-mark" aria-hidden="true" />
          <span className="style-option-body">
            <strong>{style}</strong>
            <span>{notes[style]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

/*
 * Every guide answers the same seven questions in the same order, and the
 * headings for them are written once in the dictionary. A guide that skipped
 * one would be a guide that left somebody stranded, so the type requires all
 * of them and this renders all of them.
 */
export function GuideSection({
  guide,
  dictionary
}: {
  guide: Guide;
  dictionary: Dictionary;
}) {
  const { steps, style } = dictionary.start;
  const [chosen, setChosen] = useState<StyleName>("article");

  return (
    <section id={guide.id}>
      <p className="section-number">{guide.index}</p>
      <h2>{guide.title}</h2>
      <p>{guide.summary}</p>

      <h3>{steps.requirements}</h3>
      <dl className="guide-meta">
        <div>
          <dt>{steps.time}</dt>
          <dd>{guide.time}</dd>
        </div>
        <div>
          <dt>{steps.access}</dt>
          <dd>{guide.access}</dd>
        </div>
      </dl>

      <h3>{steps.open}</h3>
      <p>{guide.open}</p>

      <h3>{steps.paste}</h3>
      <Snippet
        language={guide.language}
        source={withStyle(guide.code, chosen)}
        title={guide.title}
        labels={dictionary.codeCopy}
      />
      <StylePicker
        label={style.label}
        notes={style.notes}
        value={chosen}
        onChange={setChosen}
      />

      <h3>{steps.verify}</h3>
      <p>{guide.verify}</p>

      <h3>{steps.scope}</h3>
      <p>{guide.scope}</p>
      <Snippet
        language={guide.language}
        source={withStyle(guide.scopeCode, chosen)}
        title={guide.title}
        labels={dictionary.codeCopy}
      />

      <h3>{steps.revert}</h3>
      <p>{guide.revert}</p>

      <h3>{steps.trouble}</h3>
      <ul>
        {guide.trouble.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
