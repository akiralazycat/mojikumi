import { describe, expect, it } from "vitest";
import { en } from "./en";
import { ja } from "./ja";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function collectStrings(
  value: unknown,
  path = "",
  found: [string, string][] = []
): [string, string][] {
  if (typeof value === "string") {
    found.push([path, value]);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, found));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collectStrings(item, path ? `${path}.${key}` : key, found);
    }
  }
  return found;
}

function shape(value: unknown): Json {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shape((value as Record<string, unknown>)[key])])
    );
  }
  return typeof value;
}

describe("dictionaries", () => {
  /*
   * Copy used to live inline in JSX, where a line break inside a Japanese
   * sentence collapses into a literal space — "揃うまで、 推測値" instead of
   * "揃うまで、推測値". Keeping the copy in these files removes the cause; this
   * guards against it coming back by hand.
   */
  it("never puts a space after Japanese punctuation", () => {
    const offenders = [...collectStrings(ja), ...collectStrings(en)]
      .filter(([, text]) => /[、。，．！？」』）】〕・][ \t]/u.test(text))
      .map(([path, text]) => `${path}: ${text}`);

    expect(offenders).toEqual([]);
  });

  it("never puts a space before Japanese opening punctuation", () => {
    const offenders = [...collectStrings(ja), ...collectStrings(en)]
      .filter(([, text]) => /[ \t][「『（【〔]/u.test(text))
      .map(([path, text]) => `${path}: ${text}`);

    expect(offenders).toEqual([]);
  });

  it("keeps no accidental double spaces", () => {
    const offenders = [...collectStrings(ja), ...collectStrings(en)]
      .filter(([path, text]) => !path.includes(".code") && /\S {2,}\S/u.test(text))
      .map(([path, text]) => `${path}: ${text}`);

    expect(offenders).toEqual([]);
  });

  it("has the same shape in every locale", () => {
    expect(shape(en)).toEqual(shape(ja));
  });

  it("leaves no empty copy", () => {
    const empty = collectStrings(ja)
      .concat(collectStrings(en))
      .filter(([path, text]) => text.trim() === "" && !path.endsWith(".body"))
      .map(([path]) => path);

    expect(empty).toEqual([]);
  });
});
