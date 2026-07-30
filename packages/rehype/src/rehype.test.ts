import { describe, expect, it } from "vitest";
import rehypeMojikumi from "./index.js";

describe("rehypeMojikumi", () => {
  it("adds language and preset classes to semantic targets", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "article",
          properties: { className: ["prose"] },
          children: [{ type: "text", value: "日本語" }]
        }
      ]
    };

    rehypeMojikumi({ preset: "editorial" })(tree);
    expect(tree.children[0]?.properties).toEqual({
      className: ["prose", "mjk", "mjk-editorial"],
      lang: "ja"
    });
  });

  it("supports explicit target tags and preserves an existing language", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "section",
          properties: { lang: "ja-JP" },
          children: []
        }
      ]
    };

    rehypeMojikumi({ selector: ["section"], preset: "book" })(tree);
    expect(tree.children[0]?.properties).toEqual({
      className: ["mjk", "mjk-book"],
      lang: "ja-JP"
    });
  });
});
