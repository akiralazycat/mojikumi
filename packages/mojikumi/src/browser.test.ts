// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import {
  readScriptOptions,
  refresh,
  resolveStartOptions,
  selectRoots,
  start,
  stop
} from "./browser.js";

afterEach(() => {
  stop();
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

/** The observer debounce, plus room for jsdom to deliver the records. */
function afterMutations(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 320));
}

describe("script tag options", () => {
  it("reads the reader-facing names, not the preset names", () => {
    expect(resolveStartOptions({ style: "article" }).preset).toBe("web");
    expect(resolveStartOptions({ style: "headline" }).preset).toBe("editorial");
    expect(resolveStartOptions({ style: "book" }).preset).toBe("book");
  });

  it("still accepts a preset name from someone who read the docs", () => {
    expect(resolveStartOptions({ style: "minimal" }).preset).toBe("minimal");
    expect(resolveStartOptions({ style: "NATIVE" }).preset).toBe("native");
  });

  /* A typo in a pasted snippet should read the page, not refuse to. */
  it("falls back to the defaults for values it does not know", () => {
    const resolved = resolveStartOptions({
      style: "fancy",
      precision: "maximum"
    });
    expect(resolved.preset).toBe("web");
    expect(resolved.precision).toBe("auto");
  });

  it("treats auto and an empty target as the same request", () => {
    expect(resolveStartOptions({ target: "auto" }).target).toBeNull();
    expect(resolveStartOptions({ target: "  " }).target).toBeNull();
    expect(resolveStartOptions({ target: ".article" }).target).toBe(".article");
  });

  it("splits an exclude list written the way HTML allows", () => {
    expect(resolveStartOptions({ exclude: ".ad, .toc ," }).exclude).toEqual([
      ".ad",
      ".toc"
    ]);
  });

  it("turns things off only when asked in so many words", () => {
    expect(resolveStartOptions({ css: "false" }).css).toBe(false);
    expect(resolveStartOptions({ auto: "off" }).auto).toBe(false);
    expect(resolveStartOptions({ css: "" }).css).toBe(true);
    expect(resolveStartOptions({}).css).toBe(true);
  });

  it("reads the attributes off a script tag", () => {
    document.head.innerHTML =
      '<script data-target=".post" data-style="book" data-css="false"></script>';
    const script = document.querySelector("script");

    expect(readScriptOptions(script)).toMatchObject({
      target: ".post",
      style: "book",
      css: "false"
    });
  });

  /*
   * An import from a bundler has no tag behind it, and starting anyway would
   * apply Mojikumi to a page whose author only asked for the module.
   */
  it("has nothing to obey when no script tag loaded it", () => {
    expect(readScriptOptions(null)).toBeNull();
  });
});

describe("finding the body text", () => {
  it("prefers a named container over the whole page", () => {
    document.body.innerHTML = `
      <main><article><div class="entry-content"><p>本文</p></div></article></main>
    `;

    expect(selectRoots(document, null)).toEqual([
      document.querySelector(".entry-content")
    ]);
  });

  it("falls back through the tiers when nothing is named", () => {
    document.body.innerHTML = "<main><p>本文</p></main>";

    expect(selectRoots(document, null)).toEqual([
      document.querySelector("main")
    ]);
  });

  /* Two instances over the same text would each wrap what the other wrapped. */
  it("drops a root that sits inside another root", () => {
    document.body.innerHTML =
      '<div class="entry-content"><div class="entry-content"><p>本文</p></div></div>';

    expect(selectRoots(document, ".entry-content")).toEqual([
      document.body.firstElementChild
    ]);
  });

  it("leaves admin bars and block editors alone", () => {
    document.body.innerHTML = `
      <div id="wpadminbar"><article><p>管理バー</p></article></div>
      <div class="editor-styles-wrapper"><article><p>編集中</p></article></div>
      <div contenteditable="true"><article><p>入力中</p></article></div>
    `;

    expect(selectRoots(document, "article")).toEqual([]);
  });

  it("returns nothing for a selector it cannot parse", () => {
    document.body.innerHTML = "<article><p>本文</p></article>";

    expect(selectRoots(document, ":::")).toEqual([]);
  });
});

describe("starting from a script tag", () => {
  it("applies the stylesheet and the classes, and leaves the text alone", () => {
    document.body.innerHTML = '<article id="a"><p>『「引用」』とNext.js。</p></article>';
    const article = document.querySelector("#a")!;
    const original = article.textContent;

    start({ style: "book" });

    expect(article.classList.contains("mjk")).toBe(true);
    expect(article.classList.contains("mjk-book")).toBe(true);
    expect(article.textContent).toBe(original);
  });

  /* Pasting the same snippet twice is a thing people do. */
  it("mounts a given root once, however many times it is started", () => {
    document.body.innerHTML = '<article id="a"><p>『「引用」』。</p></article>';

    const first = start();
    const second = start();

    expect(second).toHaveLength(1);
    expect(second[0]).toBe(first[0]);
    expect(document.querySelectorAll("style[data-mojikumi-style]")).toHaveLength(
      1
    );
  });

  it("keeps quiet when there is nothing to work on", () => {
    document.body.innerHTML = "<div><p>本文</p></div>";

    expect(() => start({ target: ".missing" })).not.toThrow();
    expect(start({ target: ".missing" })).toEqual([]);
  });

  it("picks up an article that arrives after load", async () => {
    document.body.innerHTML = '<article id="a"><p>最初の記事。</p></article>';
    start();

    const added = document.createElement("article");
    added.innerHTML = "<p>後から届いた記事。</p>";
    document.body.append(added);
    await afterMutations();

    expect(added.classList.contains("mjk")).toBe(true);
  });

  it("puts everything back when it is stopped", () => {
    document.body.innerHTML = '<article id="a"><p>『「引用」』とNext.js。</p></article>';
    const article = document.querySelector("#a")!;
    const before = article.innerHTML;

    start({ precision: "full" });
    stop();

    expect(article.innerHTML).toBe(before);
    expect(article.classList.contains("mjk")).toBe(false);
    expect(document.querySelector("style[data-mojikumi-style]")).toBeNull();
  });

  it("forgets a root that left the page", () => {
    document.body.innerHTML = '<article id="a"><p>本文</p></article>';
    start();
    document.querySelector("#a")!.remove();

    expect(() => refresh()).not.toThrow();
  });

  it("does nothing when it was never started", () => {
    expect(() => stop()).not.toThrow();
    expect(() => refresh()).not.toThrow();
  });
});
