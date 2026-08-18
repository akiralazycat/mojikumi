import type { PresetName } from "@mojikumi/presets";

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export interface RehypeMojikumiOptions {
  preset?: PresetName;
  selector?: readonly string[];
  lang?: string;
}

const DEFAULT_TARGETS = ["article", "main"] as const;
const EXCLUDED = new Set(["code", "pre", "kbd", "samp", "script", "style"]);

function classNames(properties: Record<string, unknown>): string[] {
  const value = properties.className;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/u).filter(Boolean);
  return [];
}

function visit(
  node: HastNode,
  options: Required<RehypeMojikumiOptions>,
  excluded = false
): void {
  const tagName = node.tagName?.toLowerCase();
  const isExcluded = excluded || Boolean(tagName && EXCLUDED.has(tagName));

  if (!isExcluded && tagName && options.selector.includes(tagName)) {
    const properties = (node.properties ??= {});
    const classes = new Set(classNames(properties));
    classes.add("mjk");
    classes.add(`mjk-${options.preset}`);
    properties.className = [...classes];
    properties.lang ??= options.lang;
  }

  for (const child of node.children ?? []) {
    visit(child, options, isExcluded);
  }
}

export default function rehypeMojikumi(
  options: RehypeMojikumiOptions = {}
) {
  const resolved: Required<RehypeMojikumiOptions> = {
    preset: options.preset ?? "minimal",
    selector: options.selector ?? DEFAULT_TARGETS,
    lang: options.lang ?? "ja"
  };

  return function transform(tree: HastNode): void {
    visit(tree, resolved);
  };
}
