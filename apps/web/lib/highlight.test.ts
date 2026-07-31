import { describe, expect, it } from "vitest";
import { ja } from "../content/ja";
import { tokenize, type CodeToken } from "./highlight";

/** Adjacent runs of one type are merged, so compare on the trimmed run. */
function typesOf(source: string, value: string): string[] {
  return tokenize(source)
    .filter((token) => token.value.trim() === value)
    .map((token) => token.type);
}

function rebuild(tokens: CodeToken[]): string {
  return tokens.map((token) => token.value).join("");
}

describe("tokenize", () => {
  it("never loses or reorders a character", () => {
    for (const section of ja.docs.sections) {
      expect(rebuild(tokenize(section.code))).toBe(section.code);
    }
  });

  it("marks keywords, strings and JSX tags", () => {
    const source = `import { Mojikumi } from "@mojikumi/react";`;
    expect(typesOf(source, "import")).toEqual(["keyword"]);
    expect(typesOf(source, "from")).toEqual(["keyword"]);
    expect(typesOf(source, '"@mojikumi/react"')).toEqual(["string"]);
    expect(typesOf(source, "Mojikumi")).toEqual(["plain"]);
    expect(typesOf("<article lang=\"ja\">", "<article")).toEqual(["tag"]);
    expect(typesOf("</article>", "</article")).toEqual(["tag"]);
  });

  it("marks attributes and object keys, but not identifiers", () => {
    expect(typesOf('<p className="mjk">', "className")).toEqual(["attr"]);
    expect(typesOf('{ preset: "book" }', "preset")).toEqual(["attr"]);
    expect(typesOf("mojikumi(target)", "mojikumi")).toEqual(["plain"]);
    // `as` is a TypeScript keyword, but an attribute here.
    expect(typesOf('<Mojikumi as="article">', "as")).toEqual(["attr"]);
  });

  it("keeps comments and numbers apart from code", () => {
    expect(typesOf("// note\nconst a = 1;", "// note")).toEqual(["comment"]);
    expect(typesOf("const size = 18;", "18")).toEqual(["number"]);
  });

  it("does not treat an arrow or a comparison as a binding", () => {
    expect(typesOf("items.map((item) => item)", "item")).toEqual([
      "plain",
      "plain"
    ]);
    expect(typesOf("if (mode == other) {}", "mode")).toEqual(["plain"]);
  });

  it("leaves Japanese text in the plain run", () => {
    const tokens = tokenize("<p>『Webの日本語』を端正にする</p>");
    const plain = tokens.filter((token) => token.type === "plain");
    expect(plain.map((token) => token.value).join("")).toContain(
      "『Webの日本語』を端正にする"
    );
  });
});
