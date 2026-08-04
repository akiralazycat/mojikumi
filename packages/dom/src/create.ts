import { getPreset } from "@mojikumi/presets";
import { resolveOptions } from "./options.js";
import {
  measureJustification,
  measureLineContext,
  processElement,
  requiresAutospaceFallback,
  requiresPunctuationFallback,
  restoreGeneratedMarkup
} from "./processor.js";
import { detectNativeSupport } from "./support.js";
import type {
  MojikumiInstance,
  MojikumiOptions,
  NativeFeatureSupport,
  ResolvedMojikumiOptions
} from "./types.js";

function applyRootAttributes(
  root: Element,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): () => void {
  const originalClass = root.getAttribute("class");
  const originalLang = root.getAttribute("lang");
  const originalDebug = root.getAttribute("data-mjk-debug");
  const originalStyle = root.getAttribute("style");

  root.classList.add("mjk", `mjk-${options.presetName}`);
  if (options.debug) root.setAttribute("data-mjk-debug", "");
  if (!root.closest("[lang]")) root.setAttribute("lang", "ja");
  syncRootClasses(root, options, support);

  return () => {
    if (originalClass === null) root.removeAttribute("class");
    else root.setAttribute("class", originalClass);
    if (originalLang === null) root.removeAttribute("lang");
    else root.setAttribute("lang", originalLang);
    if (originalDebug === null) root.removeAttribute("data-mjk-debug");
    else root.setAttribute("data-mjk-debug", originalDebug);
    if (originalStyle === null) root.removeAttribute("style");
    else root.setAttribute("style", originalStyle);
  };
}

/*
 * A modifier earns a class only where it disagrees with the preset it is
 * overriding, because the preset's own class already says the rest. Stating the
 * agreement instead would put `text-align: start` on every ragged root, and a
 * page that centres a pull quote inside the article would lose it.
 */
function syncModifierClasses(
  root: Element,
  options: ResolvedMojikumiOptions
): void {
  const preset = getPreset(options.presetName);
  const modifiers: [string, string, boolean, boolean][] = [
    [
      "mjk-indented",
      "mjk-flush",
      Boolean(options.preset.indent),
      Boolean(preset.indent)
    ],
    ["mjk-justified", "mjk-ragged", options.preset.justify, preset.justify],
    ["mjk-hanging", "mjk-no-hanging", options.preset.hanging, preset.hanging],
    [
      "mjk-heading-break",
      "mjk-no-heading-break",
      options.preset.headingBreak,
      preset.headingBreak
    ]
  ];

  for (const [on, off, resolved, byPreset] of modifiers) {
    root.classList.toggle(on, resolved && !byPreset);
    root.classList.toggle(off, !resolved && byPreset);
  }

  /*
   * Only an amount the caller asked for goes inline. Writing the preset's own
   * 1em there would beat `--mjk-paragraph-indent` set in the page's stylesheet,
   * which is the supported way to change it without touching JavaScript.
   */
  const indent = options.preset.indent;
  if (typeof indent === "string" && indent !== preset.indent) {
    (root as HTMLElement).style?.setProperty("--mjk-paragraph-indent", indent);
  }
}

function syncRootClasses(
  root: Element,
  options: ResolvedMojikumiOptions,
  support: NativeFeatureSupport
): void {
  root.classList.toggle(
    "mjk-fallback",
    options.precision !== "native"
  );
  root.classList.toggle(
    "mjk-punctuation-fallback",
    requiresPunctuationFallback(options, support)
  );
  root.classList.toggle(
    "mjk-autospace-fallback",
    requiresAutospaceFallback(options, support)
  );
  syncModifierClasses(root, options);
  root.classList.toggle(
    "mjk-force-fallback",
    options.precision === "full"
  );
  root.classList.toggle("mjk-tst-native", support.textSpacingTrim);
  root.classList.toggle(
    "mjk-tst-start-native",
    support.textSpacingTrimStart
  );
  root.classList.toggle("mjk-autospace-native", support.textAutospace);
}

export function createMojikumi(options: MojikumiOptions = {}) {
  const resolved = resolveOptions(options);

  return {
    mount(element: Element): MojikumiInstance {
      const document = element.ownerDocument;
      const view = document.defaultView;
      const support = detectNativeSupport(view, element);
      const restoreAttributes = applyRootAttributes(element, resolved, support);
      let destroyed = false;
      let frame = 0;
      let mutationObserver: MutationObserver | undefined;
      let resizeObserver: ResizeObserver | undefined;

      /*
       * Justification first: giving a block back its ragged edge changes where
       * the line ends sit, and line context has to describe the layout that the
       * reader is actually going to see.
       */
      const measure = () => {
        measureJustification(element);
        measureLineContext(element);
      };

      const scheduleMeasurement = () => {
        if (frame) view?.cancelAnimationFrame(frame);
        if (view?.requestAnimationFrame) {
          frame = view.requestAnimationFrame(() => {
            frame = 0;
            if (destroyed) return;
            measure();
          });
        } else {
          measure();
        }
      };

      const observe = () => {
        if (
          resolved.observeMutations &&
          typeof view?.MutationObserver === "function"
        ) {
          mutationObserver ??= new view.MutationObserver(() => {
            scheduleRefresh();
          });
          mutationObserver.observe(element, {
            childList: true,
            characterData: true,
            subtree: true
          });
        }
        if (
          resolved.observeResize &&
          typeof view?.ResizeObserver === "function"
        ) {
          resizeObserver ??= new view.ResizeObserver(scheduleMeasurement);
          resizeObserver.observe(element);
        }
      };

      const refresh = () => {
        if (destroyed || !element.isConnected) return;
        mutationObserver?.disconnect();
        restoreGeneratedMarkup(element);
        syncRootClasses(element, resolved, support);
        if (resolved.precision !== "native") {
          processElement(element, resolved, support);
        }
        scheduleMeasurement();
        observe();
      };

      let refreshQueued = false;
      const scheduleRefresh = () => {
        if (refreshQueued || destroyed) return;
        refreshQueued = true;
        queueMicrotask(() => {
          refreshQueued = false;
          refresh();
        });
      };

      refresh();
      void document.fonts?.ready.then(() => {
        if (destroyed) return;
        Object.assign(support, detectNativeSupport(view, element));
        refresh();
      });

      return {
        element,
        options: resolved,
        support,
        refresh,
        destroy() {
          if (destroyed) return;
          destroyed = true;
          mutationObserver?.disconnect();
          resizeObserver?.disconnect();
          if (frame) view?.cancelAnimationFrame(frame);
          restoreGeneratedMarkup(element);
          restoreAttributes();
        }
      };
    }
  };
}

export function mojikumi(
  target: string | Element,
  options: MojikumiOptions = {}
): MojikumiInstance {
  const element =
    typeof target === "string"
      ? document.querySelector(target)
      : target;
  if (!element) throw new Error(`Mojikumi target not found: ${String(target)}`);
  return createMojikumi(options).mount(element);
}
