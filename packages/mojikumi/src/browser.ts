/*
 * The entry point a browser loads directly, with no build step in front of it.
 * Everything here is about reading intent off a script tag and refusing to be
 * in the way: the typography itself is the same DOM layer the npm packages use.
 *
 * Nothing in this file may throw into the page. A site that pastes one line
 * into its header has not agreed to let that line break the article.
 */
import { createMojikumi } from "@mojikumi/dom";
import type { MojikumiInstance, Precision } from "@mojikumi/dom";
import { isPresetName, type PresetName } from "@mojikumi/presets";

/* Both are replaced at bundle time; the fallbacks keep the source runnable. */
declare const __MOJIKUMI_CSS__: string;
declare const __MOJIKUMI_VERSION__: string;

const STYLESHEET =
  typeof __MOJIKUMI_CSS__ === "string" ? __MOJIKUMI_CSS__ : "";

export const version =
  typeof __MOJIKUMI_VERSION__ === "string" ? __MOJIKUMI_VERSION__ : "0.0.0";

/*
 * Named for what the reader gets, not for how it is implemented. The preset
 * names stay available for anyone who has read the docs.
 */
const STYLE_ALIASES: Record<string, PresetName> = {
  article: "web",
  book: "book",
  headline: "editorial"
};

/*
 * Tried in order, and the first tier with a match wins. A site that names its
 * body container gets exactly that container; only a site that names nothing
 * falls back to the whole of `main`. This list grows as each CMS is checked on
 * real pages — a selector nobody has verified belongs in nobody's default.
 */
const AUTO_TARGETS = [".entry-content", "article", "main"];

/*
 * Admin bars, block editors, and anything being typed into. The DOM layer
 * already refuses to touch form controls and editable regions; this keeps us
 * from mounting a root that lives inside one, where the wrapping would show up
 * in what the author is editing.
 */
const EDITING_CONTEXT = [
  "#wpadminbar",
  ".block-editor",
  ".editor-styles-wrapper",
  "[contenteditable]:not([contenteditable='false'])",
  "[data-no-mojikumi]"
].join(",");

const STYLE_ATTRIBUTE = "data-mojikumi-style";
const REGISTRY_KEY = "__mojikumi__";

/** What a script tag, or a `start()` call, can ask for. */
export interface StartOptions {
  /** Selector for the body text, or `auto` to look for a known container. */
  target?: string | undefined;
  /** `article`, `book`, `headline`, or a preset name. */
  style?: string | undefined;
  precision?: string | undefined;
  /** Extra selectors to leave alone, comma separated when it comes from HTML. */
  exclude?: string | readonly string[] | undefined;
  /** Set to false when the stylesheet is already loaded separately. */
  css?: boolean | string | undefined;
  /** Set to false on the script tag to start Mojikumi by hand later. */
  auto?: boolean | string | undefined;
}

export interface ResolvedStartOptions {
  /** null means "look through AUTO_TARGETS". */
  target: string | null;
  preset: PresetName;
  precision: Precision;
  exclude: readonly string[];
  css: boolean;
  auto: boolean;
}

interface Registry {
  version: string;
  instances: Map<Element, MojikumiInstance>;
  observer: MutationObserver | undefined;
}

function parseList(
  value: string | readonly string[] | undefined
): readonly string[] {
  if (!value) return [];
  const items = typeof value === "string" ? value.split(",") : value;
  return items.map((item) => item.trim()).filter(Boolean);
}

function parsePreset(value: string | undefined): PresetName {
  const name = value?.trim().toLowerCase();
  if (!name) return "web";
  return STYLE_ALIASES[name] ?? (isPresetName(name) ? name : "web");
}

function parsePrecision(value: string | undefined): Precision {
  const precision = value?.trim().toLowerCase();
  if (precision === "native" || precision === "full") return precision;
  return "auto";
}

/** Anything but an explicit denial reads as yes: the defaults are the point. */
function parseBoolean(value: boolean | string | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (value === undefined) return true;
  const text = value.trim().toLowerCase();
  return !(text === "false" || text === "off" || text === "no" || text === "0");
}

export function resolveStartOptions(
  options: StartOptions = {}
): ResolvedStartOptions {
  const target = options.target?.trim();

  return {
    target: !target || target === "auto" ? null : target,
    preset: parsePreset(options.style),
    precision: parsePrecision(options.precision),
    exclude: parseList(options.exclude),
    css: parseBoolean(options.css),
    auto: parseBoolean(options.auto)
  };
}

/** A typo in `data-target` costs that site its typography, not its page. */
function queryAll(root: Document, selector: string): Element[] {
  try {
    return [...root.querySelectorAll(selector)];
  } catch {
    return [];
  }
}

function isMountable(element: Element): boolean {
  return !element.closest(EDITING_CONTEXT);
}

/*
 * Mounting both `main` and the `article` inside it would run the same text
 * through two instances, each with its own observers.
 */
function withoutNested(elements: Element[]): Element[] {
  return elements.filter(
    (element) => !elements.some((other) => other !== element && other.contains(element))
  );
}

export function selectRoots(root: Document, target: string | null): Element[] {
  for (const selector of target ? [target] : AUTO_TARGETS) {
    const found = queryAll(root, selector).filter(isMountable);
    if (found.length) return withoutNested(found);
  }
  return [];
}

/*
 * First in the head, so a page's own rules keep winning. Nearly all of the
 * stylesheet is in a cascade layer, so this is belt and braces rather than the
 * mechanism; the fallback hooks that sit outside the layer are held up by
 * specificity instead, and do not care where they land.
 */
function injectStylesheet(root: Document): void {
  if (!STYLESHEET) return;
  if (root.querySelector(`style[${STYLE_ATTRIBUTE}]`)) return;

  const style = root.createElement("style");
  style.setAttribute(STYLE_ATTRIBUTE, version);
  style.textContent = STYLESHEET;
  (root.head ?? root.documentElement)?.prepend(style);
}

function getRegistry(view: Window): Registry | undefined {
  return (view as unknown as Record<string, Registry | undefined>)[REGISTRY_KEY];
}

function registryOf(view: Window): Registry {
  const existing = getRegistry(view);
  if (existing) return existing;

  const registry: Registry = {
    version,
    instances: new Map(),
    observer: undefined
  };
  (view as unknown as Record<string, Registry>)[REGISTRY_KEY] = registry;
  return registry;
}

function mountAll(
  registry: Registry,
  root: Document,
  options: ResolvedStartOptions
): MojikumiInstance[] {
  const factory = createMojikumi({
    preset: options.preset,
    precision: options.precision,
    exclude: options.exclude
  });

  for (const element of selectRoots(root, options.target)) {
    if (registry.instances.has(element)) continue;
    try {
      registry.instances.set(element, factory.mount(element));
    } catch {
      /* One unusable root must not cost the page the others. */
    }
  }

  return [...registry.instances.values()];
}

/*
 * Articles that arrive after load — infinite scroll, a client-side route
 * change, a lazily rendered comment thread — should be picked up too. Each
 * mounted root already watches itself, so this only looks for new roots.
 */
function watch(
  registry: Registry,
  root: Document,
  options: ResolvedStartOptions
): void {
  const view = root.defaultView;
  if (registry.observer || !view || typeof view.MutationObserver !== "function") {
    return;
  }

  let queued = false;
  registry.observer = new view.MutationObserver((records) => {
    if (queued) return;
    /* Our own wrapping lands inside roots we own; that is not new content. */
    const outside = records.some((record) => {
      const target =
        record.target.nodeType === 1
          ? (record.target as Element)
          : record.target.parentElement;
      return !target || ![...registry.instances.keys()].some((element) => element.contains(target));
    });
    if (!outside) return;

    queued = true;
    view.setTimeout(() => {
      queued = false;
      try {
        mountAll(registry, root, options);
      } catch {
        /* A page that keeps changing must not keep throwing. */
      }
    }, 200);
  });

  const scope = root.documentElement ?? root;
  registry.observer.observe(scope, { childList: true, subtree: true });
}

/** Applies Mojikumi and keeps applying it as the page changes. */
export function start(options: StartOptions = {}): MojikumiInstance[] {
  const root = document;
  const view = root.defaultView;
  if (!view) return [];

  const resolved = resolveStartOptions(options);
  if (resolved.css) injectStylesheet(root);

  const registry = registryOf(view);
  const instances = mountAll(registry, root, resolved);
  watch(registry, root, resolved);
  return instances;
}

/** Re-measures what is mounted, and picks up roots that appeared since. */
export function refresh(): void {
  const view = typeof document === "undefined" ? undefined : document.defaultView;
  const registry = view ? getRegistry(view) : undefined;
  if (!registry) return;

  for (const [element, instance] of registry.instances) {
    if (element.isConnected) instance.refresh();
    else {
      instance.destroy();
      registry.instances.delete(element);
    }
  }
}

/** Puts the page back: no wrapping, no classes, no stylesheet. */
export function stop(): void {
  const view = typeof document === "undefined" ? undefined : document.defaultView;
  const registry = view ? getRegistry(view) : undefined;
  if (!view || !registry) return;

  registry.observer?.disconnect();
  for (const instance of registry.instances.values()) instance.destroy();
  registry.instances.clear();
  document.querySelector(`style[${STYLE_ATTRIBUTE}]`)?.remove();
  Reflect.deleteProperty(view, REGISTRY_KEY);
}

/*
 * Null when no script tag loaded this module, which is how an import from a
 * bundler arrives. Configuration comes from the tag, so without one there is
 * nothing to obey and nothing to start on the reader's behalf.
 */
export function readScriptOptions(
  script: HTMLOrSVGScriptElement | null
): StartOptions | null {
  if (!script) return null;
  const { dataset } = script;

  return {
    target: dataset.target,
    style: dataset.style,
    precision: dataset.precision,
    exclude: dataset.exclude,
    css: dataset.css,
    auto: dataset.auto
  };
}

/*
 * `document.currentScript` only answers while the script is being evaluated,
 * so the tag has to be read now even though the work waits for the document.
 */
const currentScript =
  typeof document === "undefined" ? null : document.currentScript;

function whenReady(run: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}

function autoStart(): void {
  if (typeof document === "undefined") return;

  try {
    const options = readScriptOptions(currentScript);
    if (!options || !parseBoolean(options.auto)) return;

    /*
     * The stylesheet goes in during evaluation rather than on ready: in the
     * head it then lands before the body is painted, and it survives anything
     * going wrong in the DOM pass below.
     */
    if (parseBoolean(options.css)) injectStylesheet(document);

    whenReady(() => {
      try {
        start({ ...options, css: false });
      } catch {
        /* Text the browser can already render beats text we broke. */
      }
    });
  } catch {
    /* Reading a script tag should be impossible to fail. Still. */
  }
}

autoStart();
