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
    expect(target.querySelector("[data-mjk-generated]")).not.toBeNull();

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
