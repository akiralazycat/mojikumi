import type { MojikumiClass, MojikumiToken } from "./types.js";

export interface AutospaceBoundary {
  left: MojikumiToken;
  right: MojikumiToken;
  boundary: number;
  size: number;
}

function isAlphaNumeric(className: MojikumiClass): boolean {
  return className === "latin" || className === "numeric";
}

export function needsAutospace(
  left: MojikumiClass,
  right: MojikumiClass
): boolean {
  return (
    (left === "ideograph" && isAlphaNumeric(right)) ||
    (isAlphaNumeric(left) && right === "ideograph")
  );
}

export function computeAutospaceBoundaries(
  tokens: readonly MojikumiToken[],
  size = 0.125
): AutospaceBoundary[] {
  const boundaries: AutospaceBoundary[] = [];

  for (let boundary = 1; boundary < tokens.length; boundary += 1) {
    const left = tokens[boundary - 1];
    const right = tokens[boundary];
    if (left && right && needsAutospace(left.class, right.class)) {
      boundaries.push({ left, right, boundary, size });
    }
  }

  return boundaries;
}
