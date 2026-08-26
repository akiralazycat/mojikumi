/**
 * The MathLive surface this app uses, described locally so the rest of the app
 * never imports the engine's own types.
 */

export type MathfieldOutputFormat =
  | "latex"
  | "ascii-math"
  | "math-ml"
  | "plain-text"
  | "spoken-text";

export type MathSelection = {
  ranges: Array<[number, number]>;
  direction?: "forward" | "backward" | "none";
};

export type MathfieldElement = HTMLElement & {
  value: string;
  smartFence: boolean;
  selectionIsCollapsed: boolean;
  selection: Readonly<MathSelection>;
  position: number;
  lastOffset: number;
  mathVirtualKeyboardPolicy: "auto" | "manual" | "sandboxed";
  getValue: {
    (format?: MathfieldOutputFormat): string;
    (selection: MathSelection, format?: MathfieldOutputFormat): string;
  };
  executeCommand: (command: string | [string, ...unknown[]]) => boolean;
  insert: (
    value: string,
    options?: {
      insertionMode?: "replaceSelection" | "replaceAll" | "insertBefore" | "insertAfter";
      selectionMode?: "placeholder" | "after" | "before" | "item";
    }
  ) => boolean;
};

export function readValue(
  field: MathfieldElement | null,
  format: MathfieldOutputFormat,
  fallback = ""
) {
  try {
    return field?.getValue(format) ?? fallback;
  } catch {
    return fallback;
  }
}

export function readRange(field: MathfieldElement, selection: MathSelection) {
  try {
    return field.getValue(selection, "latex");
  } catch {
    return "";
  }
}

export function copySelection(selection: Readonly<MathSelection>): MathSelection {
  const copied: MathSelection = {
    ranges: selection.ranges.map(([start, end]) => [start, end])
  };
  if (selection.direction) copied.direction = selection.direction;
  return copied;
}

export function selectionRange(field: MathfieldElement): [number, number] {
  const [start, end] = field.selection.ranges[0] ?? [field.position, field.position];
  return [Math.min(start, end), Math.max(start, end)];
}
