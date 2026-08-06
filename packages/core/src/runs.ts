import type { MojikumiClass, MojikumiToken } from "./types.js";

export interface UnbreakableRun {
  /** Index of the first token in the run. */
  start: number;
  /** Index one past the last token in the run. */
  end: number;
  /** UTF-16 offset of the first token. */
  offset: number;
  /** UTF-16 length of the whole run. */
  length: number;
}

/*
 * A Japanese line may break between almost any two characters, so a long run of
 * Latin is the one thing in a paragraph that cannot be broken. When it will not
 * fit in what is left of a line the browser moves the whole of it down, and a
 * justified line with four characters on it is stretched across the measure.
 * Measured on Chromium 148 at a 24em measure, a URL left the line before it
 * setting its characters 4.4em apart, and an environment variable 7.3em.
 *
 * A run is only worth breaking if it is machine-written. Ordinary prose has
 * spaces to break at, and a long English word broken mid-syllable reads worse
 * than the gap it avoids — those are left to the justification check, which
 * gives up on justifying the block rather than damaging the word.
 */
const MACHINE_MARKS = new Set([..."/:_=&?#%@~"]);

/** Cheap enough to run on every text node before deciding to tokenize. */
export const MACHINE_MARK_PATTERN = /[/:_=&?#%@~]/u;

const DEFAULT_MIN_LENGTH = 16;

function isRunClass(className: MojikumiClass): boolean {
  return (
    className === "latin" || className === "numeric" || className === "other"
  );
}

export function computeUnbreakableRuns(
  tokens: readonly MojikumiToken[],
  minLength = DEFAULT_MIN_LENGTH
): UnbreakableRun[] {
  const runs: UnbreakableRun[] = [];
  let start = -1;
  let marked = false;

  const close = (end: number) => {
    const first = tokens[start];
    const last = tokens[end - 1];
    if (start >= 0 && marked && first && last) {
      const length = last.offset + last.value.length - first.offset;
      if (length >= minLength) {
        runs.push({ start, end, offset: first.offset, length });
      }
    }
    start = -1;
    marked = false;
  };

  tokens.forEach((token, index) => {
    if (!isRunClass(token.class)) {
      close(index);
      return;
    }
    if (start < 0) start = index;
    if (MACHINE_MARKS.has(token.value)) marked = true;
  });
  close(tokens.length);

  return runs;
}
