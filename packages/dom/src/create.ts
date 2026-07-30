import { resolveOptions } from "./options.js";
import {
  measureLineContext,
  processElement,
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

  root.classList.add("mjk", `mjk-${options.presetName}`);
  if (options.precision !== "native" && options.preset.fallback) {
    root.classList.add("mjk-fallback");
  }
  if (options.debug) root.setAttribute("data-mjk-debug", "");
  if (!root.closest("[lang]")) root.setAttribute("lang", "ja");
  root.classList.toggle("mjk-tst-native", support.textSpacingTrim);
  root.classList.toggle("mjk-autospace-native", support.textAutospace);

  return () => {
    if (originalClass === null) root.removeAttribute("class");
    else root.setAttribute("class", originalClass);
    if (originalLang === null) root.removeAttribute("lang");
    else root.setAttribute("lang", originalLang);
    if (originalDebug === null) root.removeAttribute("data-mjk-debug");
    else root.setAttribute("data-mjk-debug", originalDebug);
  };
}

export function createMojikumi(options: MojikumiOptions = {}) {
  const resolved = resolveOptions(options);

  return {
    mount(element: Element): MojikumiInstance {
      const document = element.ownerDocument;
      const view = document.defaultView;
      const support = detectNativeSupport(view);
      const restoreAttributes = applyRootAttributes(element, resolved, support);
      let destroyed = false;
      let frame = 0;
      let mutationObserver: MutationObserver | undefined;
      let resizeObserver: ResizeObserver | undefined;

      const scheduleMeasurement = () => {
        if (frame) view?.cancelAnimationFrame(frame);
        if (view?.requestAnimationFrame) {
          frame = view.requestAnimationFrame(() => {
            frame = 0;
            if (!destroyed) measureLineContext(element);
          });
        } else {
          measureLineContext(element);
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
        if (resolved.precision !== "native" && resolved.preset.fallback) {
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
      void document.fonts?.ready.then(scheduleRefresh);

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
