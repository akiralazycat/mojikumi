// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMojikumi, mojikumi, resolveOptions } from "./index.js";
import { measureLineContext } from "./processor.js";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  Reflect.deleteProperty(window, "CSS");
  Reflect.deleteProperty(Range.prototype, "getClientRects");
});

/** jsdom does no layout, so line context has to be told where things landed. */
function rectList(rect: Partial<DOMRect>): DOMRectList {
  const value = rect as DOMRect;
  return { length: 1, item: () => value, 0: value } as unknown as DOMRectList;
}

function stubRects(element: Element, rect: Partial<DOMRect>): void {
  element.getClientRects = () => rectList(rect);
}

/** jsdom has no Range.getClientRects to spy on, so define one. */
function stubRangeRects(rect: Partial<DOMRect>): void {
  Object.defineProperty(Range.prototype, "getClientRects", {
    configurable: true,
    writable: true,
    value: () => rectList(rect)
  });
}

describe("DOM fallback", () => {
  it("wraps only required boundaries and restores the original text", () => {
    document.body.innerHTML =
      '<article id="target">『「引用」』をNext.jsで使う。</article>';
    const target = document.querySelector("#target")!;
    const original = target.textContent;
    const instance = createMojikumi({
      precision: "full",
      observe: false
    }).mount(target);

    expect(target.textContent).toBe(original);
    expect(target.querySelectorAll(".mjk-pair-after")).toHaveLength(2);
    expect(target.classList.contains("mjk-force-fallback")).toBe(true);
    expect(target.querySelectorAll(".mjk-autospace-before").length).toBeGreaterThan(0);
    expect(target.querySelectorAll("[data-mjk-generated]").length).toBeLessThan(
      original!.length
    );

    instance.refresh();
    expect(target.textContent).toBe(original);
    expect(target.querySelectorAll(".mjk-pair-after")).toHaveLength(2);

    instance.destroy();
    expect(target.textContent).toBe(original);
    expect(target.querySelector("[data-mjk-generated]")).toBeNull();
    expect(target.getAttribute("class")).toBeNull();
  });

  it("does not add manual fallback markup when native spacing is available", () => {
    Object.defineProperty(window, "CSS", {
      configurable: true,
      value: {
        supports(property: string, value: string) {
          if (property === "text-spacing-trim") {
            return ["normal", "trim-start", "trim-both"].includes(value);
          }
          return (
            property === "text-autospace" ||
            property === "hanging-punctuation" ||
            property === "word-break"
          );
        }
      }
    });
    document.body.innerHTML =
      '<article id="target">『「引用」』をNext.jsで使う。</article>';
    const target = document.querySelector("#target")!;
    const original = target.textContent;
    const instance = createMojikumi({
      precision: "auto",
      observe: false
    }).mount(target);

    expect(target.textContent).toBe(original);
    expect(target.querySelector("[data-mjk-generated]")).toBeNull();
    expect(target.classList.contains("mjk-force-fallback")).toBe(false);
    expect(target.classList.contains("mjk-tst-native")).toBe(true);
    expect(target.classList.contains("mjk-autospace-native")).toBe(true);

    instance.destroy();
  });

  it("uses fallback when syntax exists but the active font does not change punctuation width", () => {
    Object.defineProperty(window, "CSS", {
      configurable: true,
      value: {
        supports(property: string) {
          return (
            property === "text-spacing-trim" ||
            property === "text-autospace" ||
            property === "hanging-punctuation" ||
            property === "word-break"
          );
        }
      }
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 20,
      top: 0,
      right: 100,
      bottom: 20,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect);
    document.body.innerHTML =
      '<article id="target"><p>『行頭』と「（例）」</p></article>';
    const target = document.querySelector("#target")!;
    const original = target.textContent;
    const instance = createMojikumi({
      preset: "web",
      precision: "auto",
      observe: false
    }).mount(target);

    expect(instance.support.textSpacingTrim).toBe(false);
    expect(instance.support.textSpacingTrimStart).toBe(false);
    expect(target.classList.contains("mjk-punctuation-fallback")).toBe(true);
    expect(target.querySelectorAll(".mjk-pair-after")).toHaveLength(2);
    expect(target.textContent).toBe(original);
    instance.destroy();
  });

  it("falls back when a preset needs trim-both but the browser only has trim-start", () => {
    Object.defineProperty(window, "CSS", {
      configurable: true,
      value: {
        supports(property: string, value: string) {
          if (property === "text-spacing-trim") {
            return value === "normal" || value === "trim-start";
          }
          return property === "text-autospace";
        }
      }
    });
    document.body.innerHTML =
      '<article id="target"><p>『引用』を確認する。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "auto",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-punctuation-fallback")).toBe(true);
    // `mjk-book` already justifies; a modifier class would only restate it.
    expect(instance.options.preset.justify).toBe(true);
    expect(target.classList.contains("mjk-ragged")).toBe(false);
    expect(target.querySelector("[data-mjk-generated]")).not.toBeNull();

    instance.destroy();
  });

  /*
   * The same browser, the same missing `trim-both`, a ragged preset. Line-end
   * trimming would move nothing here, so it is not a reason to start wrapping
   * text and hand back the line-start trimming the browser was already doing.
   */
  it("leaves a ragged preset on native CSS when only trim-both is missing", () => {
    Object.defineProperty(window, "CSS", {
      configurable: true,
      value: {
        supports(property: string, value: string) {
          if (property === "text-spacing-trim") {
            return value === "normal" || value === "trim-start";
          }
          return property === "text-autospace";
        }
      }
    });
    document.body.innerHTML =
      '<article id="target"><p>『引用』を確認する。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "editorial",
      precision: "auto",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-punctuation-fallback")).toBe(false);
    expect(target.classList.contains("mjk-justified")).toBe(false);
    expect(target.querySelector("[data-mjk-generated]")).toBeNull();

    instance.destroy();
  });

  it("never wraps line-end candidates for a ragged preset", () => {
    document.body.innerHTML =
      '<article id="target"><p>本文（例）そのあとに続く。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "web",
      precision: "full",
      observe: false
    }).mount(target);

    expect(target.querySelector("[data-mjk-line-start-candidate]")).not.toBeNull();
    expect(target.querySelector("[data-mjk-line-end-candidate]")).toBeNull();

    instance.destroy();
  });

  it("trims opening punctuation at a paragraph start in fallback mode", () => {
    document.body.innerHTML =
      '<article id="target"><p>『引用』を確認する。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      precision: "full",
      observe: false
    }).mount(target);
    const token = target.querySelector<HTMLElement>(
      "[data-mjk-line-start-candidate]"
    )!;
    const rect = {
      width: 18,
      height: 18,
      top: 0,
      left: 0
    } as DOMRect;
    token.getClientRects = () =>
      ({
        length: 1,
        item: () => rect,
        0: rect
      }) as DOMRectList;

    measureLineContext(target);

    expect(token.classList.contains("mjk-line-start")).toBe(true);
    expect(token.dataset.mjkContext).toBe("paragraph-start");
    instance.destroy();
  });

  /*
   * The next paragraph always renders on another line, so comparing against it
   * would mark every paragraph-final closing bracket as a line end no matter
   * where on the line it actually sat.
   */
  it("does not read the next paragraph as the end of this line", () => {
    document.body.innerHTML =
      '<article id="target"><p>本文（例）</p><p>次の段落。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "full",
      observe: false
    }).mount(target);

    const token = target.querySelector<HTMLElement>(
      "p:first-of-type [data-mjk-line-end-candidate]"
    )!;
    stubRects(token, { top: 0, left: 0, width: 18, height: 18 });
    // Whatever the following paragraph measures, it is not this line.
    stubRangeRects({ top: 36, left: 0, width: 18, height: 18 });

    measureLineContext(target);

    expect(token.classList.contains("mjk-line-end")).toBe(false);
    expect(token.dataset.mjkContext).toBeUndefined();
    instance.destroy();
  });

  it("still trims a closing bracket that wraps to the end of a line", () => {
    document.body.innerHTML =
      '<article id="target"><p>本文（例）そのあとに続く文章。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "full",
      observe: false
    }).mount(target);

    const token = target.querySelector<HTMLElement>(
      "[data-mjk-line-end-candidate]"
    )!;
    stubRects(token, { top: 0, left: 0, width: 18, height: 18 });
    // The text after it inside the same paragraph starts on the next line.
    stubRangeRects({ top: 36, left: 0, width: 18, height: 18 });

    measureLineContext(target);

    expect(token.classList.contains("mjk-line-end")).toBe(true);
    expect(token.dataset.mjkContext).toBe("line-end");
    instance.destroy();
  });

  /*
   * The half-em the trim frees can be enough for the next character to join the
   * line, at which point the comma the measurement called line-final is sitting
   * mid-line with a negative margin, on top of the character that moved up.
   * Left alone the two states alternate, so the adjustment is withdrawn rather
   * than re-applied.
   */
  it("takes back a line-end trim once the browser has re-broken the line", () => {
    document.body.innerHTML =
      '<article id="target"><p>本文、そのあとに続く文章。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "full",
      observe: false
    }).mount(target);

    const token = target.querySelector<HTMLElement>(
      "[data-mjk-line-end-candidate]"
    )!;
    stubRects(token, { top: 0, left: 0, width: 18, height: 18 });
    Object.defineProperty(Range.prototype, "getClientRects", {
      configurable: true,
      writable: true,
      value: () =>
        rectList(
          token.classList.contains("mjk-line-end")
            ? { top: 0, left: 0, width: 18, height: 18 }
            : { top: 36, left: 0, width: 18, height: 18 }
        )
    });

    measureLineContext(target);

    expect(token.classList.contains("mjk-line-end")).toBe(false);
    expect(token.dataset.mjkContext).toBeUndefined();
    instance.destroy();
  });

  /*
   * The preset asks for justified text with a zero-specificity rule, so a theme
   * that sets `text-align: left` wins. Trimming line ends there would move
   * nothing and could only change where the browser breaks.
   */
  it("does not trim line ends in a block the page left ragged", () => {
    document.body.innerHTML =
      '<article id="target"><p style="text-align: left">本文（例）そのあとに続く文章。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "full",
      observe: false
    }).mount(target);

    const token = target.querySelector<HTMLElement>(
      "[data-mjk-line-end-candidate]"
    )!;
    stubRects(token, { top: 0, left: 0, width: 18, height: 18 });
    stubRangeRects({ top: 36, left: 0, width: 18, height: 18 });

    measureLineContext(target);

    expect(token.classList.contains("mjk-line-end")).toBe(false);
    instance.destroy();
  });

  it("skips code and explicit opt-out regions", () => {
    document.body.innerHTML = `
      <article id="target">
        <p>本文「（例）」</p>
        <code>code「（例）」</code>
        <span data-no-mojikumi>除外「（例）」</span>
      </article>
    `;
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      precision: "full",
      observe: false
    }).mount(target);

    expect(target.querySelector("p [data-mjk-generated]")).not.toBeNull();
    expect(target.querySelector("code [data-mjk-generated]")).toBeNull();
    expect(
      target.querySelector("[data-no-mojikumi] [data-mjk-generated]")
    ).toBeNull();
    instance.destroy();
  });

  it("keeps nested Mojikumi instances isolated", () => {
    document.body.innerHTML = `
      <article id="outer">
        <p>外側「（例）」</p>
        <section id="inner" class="mjk">
          <p>内側「（例）」</p>
        </section>
      </article>
    `;
    const outer = document.querySelector("#outer")!;
    const inner = document.querySelector("#inner")!;
    const outerInstance = createMojikumi({
      precision: "full",
      observe: false
    }).mount(outer);

    expect(outer.querySelector("p [data-mjk-generated]")).not.toBeNull();
    expect(inner.querySelector("[data-mjk-generated]")).toBeNull();

    const innerInstance = createMojikumi({
      precision: "full",
      observe: false
    }).mount(inner);
    expect(inner.querySelector("[data-mjk-generated]")).not.toBeNull();

    outerInstance.refresh();
    expect(inner.querySelector("[data-mjk-generated]")).not.toBeNull();

    outerInstance.destroy();
    expect(inner.querySelector("[data-mjk-generated]")).not.toBeNull();
    innerInstance.destroy();
  });

  it("supports the selector convenience API", () => {
    document.body.innerHTML = '<article class="article">これは「例」です。</article>';
    const instance = mojikumi(".article", {
      preset: "book",
      precision: "native",
      observe: false
    });
    expect(instance.element.classList.contains("mjk-book")).toBe(true);
    expect(instance.element.getAttribute("lang")).toBe("ja");
    instance.destroy();
  });
});

describe("unbreakable runs", () => {
  it("wraps a URL whole so a justified line can break inside it", () => {
    document.body.innerHTML =
      '<article id="target"><p>詳しくはhttps://example.com/2026/typography.htmlを参照。</p></article>';
    const target = document.querySelector("#target")!;
    const original = target.textContent;
    const instance = createMojikumi({
      preset: "book",
      precision: "auto",
      observe: false
    }).mount(target);

    const run = target.querySelector<HTMLElement>(".mjk-long-run");
    expect(run?.textContent).toBe("https://example.com/2026/typography.html");
    expect(target.textContent).toBe(original);

    instance.destroy();
    expect(target.textContent).toBe(original);
    expect(target.querySelector(".mjk-long-run")).toBeNull();
  });

  /* Ragged text pays nothing for an unbreakable run, so it keeps the address. */
  it("leaves runs alone where the text is not justified", () => {
    document.body.innerHTML =
      '<article id="target"><p>詳しくはhttps://example.com/2026/typography.htmlを参照。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "web",
      precision: "full",
      observe: false
    }).mount(target);

    expect(target.querySelector(".mjk-long-run")).toBeNull();
    instance.destroy();
  });

  it("keeps the autospace before a run it swallowed", () => {
    document.body.innerHTML =
      '<article id="target"><p>詳細はhttps://example.com/a/b/c/d/e/fです。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      precision: "full",
      observe: false
    }).mount(target);

    const run = target.querySelector<HTMLElement>(".mjk-long-run");
    expect(run?.classList.contains("mjk-autospace-before")).toBe(true);
    instance.destroy();
  });
});

describe("modifiers", () => {
  it("drops the indent from book without touching the rest of it", () => {
    document.body.innerHTML = '<article id="target"><p>本文です。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      indent: false,
      precision: "native",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-flush")).toBe(true);
    expect(target.classList.contains("mjk-indented")).toBe(false);
    expect(target.classList.contains("mjk-ragged")).toBe(false);
    expect(instance.options.preset.justify).toBe(true);

    instance.destroy();
    expect(target.getAttribute("class")).toBeNull();
  });

  it("indents a ragged preset on request, at the amount asked for", () => {
    document.body.innerHTML = '<article id="target"><p>本文です。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      indent: "2em",
      precision: "native",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-indented")).toBe(true);
    expect(
      (target as HTMLElement).style.getPropertyValue("--mjk-paragraph-indent")
    ).toBe("2em");

    instance.destroy();
    expect(target.getAttribute("style")).toBeNull();
  });

  /*
   * Turning justification off has to take line-end trimming with it. Trimming
   * the half-em after a line-final comma only shows in a justified line.
   */
  it("stops trimming line ends when justification is turned off", () => {
    document.body.innerHTML =
      '<article id="target"><p>本文（例）そのあとに続く。</p></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "book",
      justify: false,
      precision: "full",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-ragged")).toBe(true);
    expect(target.querySelector("[data-mjk-line-end-candidate]")).toBeNull();
    expect(
      target.querySelector("[data-mjk-line-start-candidate]")
    ).not.toBeNull();

    instance.destroy();
  });

  it("leaves the preset alone when no modifier is given", () => {
    const untouched = resolveOptions({ preset: "book" });
    expect(untouched.preset.indent).toBe("1em");
    expect(untouched.preset.justify).toBe(true);

    const overridden = resolveOptions({
      preset: "book",
      indent: false,
      justify: false,
      hanging: false
    });
    expect(overridden.preset.indent).toBe(false);
    expect(overridden.preset.justify).toBe(false);
    expect(overridden.preset.hanging).toBe(false);
    expect(resolveOptions({ indent: true }).preset.indent).toBe("1em");
  });

  it("resolves a retired preset name to the one that replaced it", () => {
    expect(resolveOptions({ preset: "web" }).presetName).toBe("minimal");
    expect(resolveOptions({}).presetName).toBe("minimal");
  });

  it("carries hanging and heading breaks as modifiers", () => {
    document.body.innerHTML = '<article id="target"><h2>見出し</h2></article>';
    const target = document.querySelector("#target")!;
    const instance = createMojikumi({
      preset: "article",
      hanging: true,
      headingBreak: true,
      precision: "native",
      observe: false
    }).mount(target);

    expect(target.classList.contains("mjk-hanging")).toBe(true);
    expect(target.classList.contains("mjk-heading-break")).toBe(true);

    instance.destroy();

    const withoutHanging = createMojikumi({
      preset: "book",
      hanging: false,
      precision: "native",
      observe: false
    }).mount(target);
    expect(target.classList.contains("mjk-no-hanging")).toBe(true);
    withoutHanging.destroy();
  });
});

describe("options", () => {
  it("merges observation and exclusions predictably", () => {
    const options = resolveOptions({
      preset: "minimal",
      observe: false,
      observeResize: true,
      exclude: [".skip"]
    });
    expect(options.observeResize).toBe(true);
    expect(options.observeMutations).toBe(false);
    expect(options.exclude).toContain("code");
    expect(options.exclude).toContain(".skip");
  });
});
