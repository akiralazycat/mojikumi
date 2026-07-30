import type { NativeFeatureSupport } from "./types.js";

function supports(view: Window | null, property: string, value: string): boolean {
  const css = (view as (Window & { CSS?: typeof CSS }) | null)?.CSS;
  return typeof css?.supports === "function" && css.supports(property, value);
}

function typographyContext(context: Element): Element {
  const document = context.ownerDocument;
  const walker = document.createTreeWalker(
    context,
    document.defaultView?.NodeFilter.SHOW_TEXT ?? 4
  );
  let current: Node | null;
  while ((current = walker.nextNode())) {
    if ((current as Text).data.trim() && current.parentElement) {
      return current.parentElement;
    }
  }
  return context;
}

function spacingBehaviorWorks(
  view: Window,
  context: Element,
  value: string,
  sample: string
): boolean | undefined {
  const document = context.ownerDocument;
  if (!document.body) return undefined;

  const source = view.getComputedStyle(typographyContext(context));
  const container = document.createElement("div");
  const createSample = (textSpacingTrim: string) => {
    const element = document.createElement("span");
    element.lang = context.closest("[lang]")?.getAttribute("lang") ?? "ja";
    element.textContent = sample;
    element.style.display = "inline-block";
    element.style.fontFamily = source.fontFamily;
    element.style.fontSize = source.fontSize === "0px" ? "32px" : source.fontSize;
    element.style.fontStretch = source.fontStretch;
    element.style.fontStyle = source.fontStyle;
    element.style.fontWeight = source.fontWeight;
    element.style.letterSpacing = source.letterSpacing;
    element.style.lineHeight = "1";
    element.style.whiteSpace = "nowrap";
    element.style.setProperty("text-spacing-trim", textSpacingTrim);
    return element;
  };
  const untrimmed = createSample("space-all");
  const trimmed = createSample(value);

  container.style.contain = "strict";
  container.style.inset = "0 auto auto -10000px";
  container.style.position = "fixed";
  container.style.visibility = "hidden";
  container.append(untrimmed, trimmed);
  document.body.append(container);

  const untrimmedWidth = untrimmed.getBoundingClientRect().width;
  const trimmedWidth = trimmed.getBoundingClientRect().width;
  const fontSize = Number.parseFloat(source.fontSize) || 32;
  container.remove();

  if (untrimmedWidth === 0 || trimmedWidth === 0) return undefined;
  return untrimmedWidth - trimmedWidth > fontSize * 0.2;
}

export function detectNativeSupport(
  view: Window | null =
    typeof window === "undefined" ? null : window,
  context?: Element
): NativeFeatureSupport {
  const textSpacingTrimSyntax = supports(view, "text-spacing-trim", "normal");
  const textSpacingTrimStartSyntax = supports(
    view,
    "text-spacing-trim",
    "trim-start"
  );
  const textSpacingTrimBothSyntax = supports(
    view,
    "text-spacing-trim",
    "trim-both"
  );
  const behavior =
    view && context
      ? {
          normal: spacingBehaviorWorks(
            view,
            context,
            "normal",
            "「（例）」"
          ),
          start: spacingBehaviorWorks(view, context, "trim-start", "『例"),
          both: spacingBehaviorWorks(view, context, "trim-both", "『例。")
        }
      : undefined;

  return {
    textSpacingTrim:
      textSpacingTrimSyntax && (behavior?.normal ?? true),
    textSpacingTrimStart:
      textSpacingTrimStartSyntax && (behavior?.start ?? true),
    textSpacingTrimBoth:
      textSpacingTrimBothSyntax && (behavior?.both ?? true),
    textAutospace: supports(view, "text-autospace", "normal"),
    hangingPunctuation: supports(
      view,
      "hanging-punctuation",
      "first allow-end"
    ),
    autoPhrase: supports(view, "word-break", "auto-phrase")
  };
}
