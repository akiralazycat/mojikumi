/**
 * Brace-aware scanning shared by the LaTeX-side helpers.
 *
 * MathLive can nest structures inside a placeholder, so anything that rewrites
 * or measures LaTeX has to balance braces instead of matching `\{[^}]*\}`.
 */

export type LatexGroup = {
  content: string;
  end: number;
};

export function readGroup(source: string, start: number): LatexGroup | null {
  if (source[start] !== "{") return null;
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "\\") {
      index += 1;
      continue;
    }
    if (source[index] === "{") depth += 1;
    if (source[index] !== "}") continue;
    depth -= 1;
    if (depth === 0) {
      return { content: source.slice(start + 1, index), end: index + 1 };
    }
  }
  return null;
}

function readOptionalArgument(source: string, start: number) {
  if (source[start] !== "[") return start;
  const end = source.indexOf("]", start);
  return end === -1 ? start : end + 1;
}

const placeholderCommand = "\\placeholder";

export function hasPlaceholder(source: string) {
  return source.includes(placeholderCommand);
}

/**
 * Replace every `\placeholder{…}` with `mark`, keeping the surrounding LaTeX
 * intact. Empty input slots stay visible in the output instead of collapsing
 * into their neighbours.
 */
export function replacePlaceholders(source: string, mark: string) {
  let result = "";
  let index = 0;
  while (index < source.length) {
    const next = source.indexOf(placeholderCommand, index);
    if (next === -1) {
      result += source.slice(index);
      break;
    }
    const afterCommand = next + placeholderCommand.length;
    if (/[a-zA-Z]/.test(source[afterCommand] ?? "")) {
      result += source.slice(index, afterCommand);
      index = afterCommand;
      continue;
    }
    const argumentStart = readOptionalArgument(source, afterCommand);
    const group = readGroup(source, argumentStart);
    result += source.slice(index, next) + mark;
    index = group ? group.end : argumentStart;
  }
  return result;
}
