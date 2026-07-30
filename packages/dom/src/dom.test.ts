// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { createMojikumi, mojikumi, resolveOptions } from "./index.js";

afterEach(() => {
  document.body.innerHTML = "";
});

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
