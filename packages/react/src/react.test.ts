import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Mojikumi } from "./index.js";

describe("Mojikumi React component", () => {
  it("renders useful SSR markup without generated fallback spans", () => {
    const html = renderToStaticMarkup(
      createElement(
        Mojikumi,
        { as: "section", preset: "book", id: "article" },
        "『「引用」』"
      )
    );

    expect(html).toContain('<section id="article" lang="ja" class="mjk mjk-book">');
    expect(html).toContain("『「引用」』");
    expect(html).not.toContain("data-mjk-generated");
  });
});
