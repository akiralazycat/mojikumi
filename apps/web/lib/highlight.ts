/*
 * A deliberately small highlighter for the documentation snippets.
 *
 * The samples are fixed strings in content/{ja,en}.ts — TypeScript, JSX and
 * JSON-ish object literals — so a full grammar would be far more machinery
 * than the job needs. Highlighting runs while the page is prerendered, so
 * nothing here ships to the browser.
 */

export type CodeTokenType =
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attr"
  | "number"
  | "punctuation"
  | "plain";

export type CodeToken = {
  type: CodeTokenType;
  value: string;
};

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "class",
  "const",
  "default",
  "export",
  "extends",
  "false",
  "for",
  "from",
  "function",
  "import",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "true",
  "type",
  "typeof",
  "undefined",
  "var"
]);

const PATTERN =
  /(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(?<string>`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(?<tag><\/?[A-Za-z][\w.]*)|(?<number>\b\d+(?:\.\d+)?\b)|(?<name>[A-Za-z_$][\w$]*)|(?<punctuation>[{}()[\];:,.<>\/=+*!?&|-]+)/gu;

/** A name is an attribute or a key when the next thing is `=` or `:`. */
function isBinding(source: string, index: number): boolean {
  const rest = source.slice(index).replace(/^[ \t]+/u, "");
  if (rest.startsWith("=>") || rest.startsWith("==")) return false;
  return rest.startsWith("=") || rest.startsWith(":");
}

export function tokenize(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let last = 0;

  const push = (type: CodeTokenType, value: string) => {
    if (!value) return;
    const previous = tokens[tokens.length - 1];
    if (previous && previous.type === type) previous.value += value;
    else tokens.push({ type, value });
  };

  for (const match of source.matchAll(PATTERN)) {
    const groups = match.groups ?? {};
    const start = match.index ?? 0;
    push("plain", source.slice(last, start));
    last = start + match[0].length;

    if (groups.comment) push("comment", groups.comment);
    else if (groups.string) push("string", groups.string);
    else if (groups.tag) push("tag", groups.tag);
    else if (groups.number) push("number", groups.number);
    else if (groups.name) {
      const name = groups.name;
      // Binding wins over the keyword list: `as` is a keyword in TypeScript
      // but an attribute in `<Mojikumi as="article">`.
      if (isBinding(source, last)) push("attr", name);
      else if (KEYWORDS.has(name)) push("keyword", name);
      else push("plain", name);
    } else if (groups.punctuation) push("punctuation", groups.punctuation);
  }

  push("plain", source.slice(last));
  return tokens;
}
