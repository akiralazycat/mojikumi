import "@mojikumi/css/mojikumi.css";
import {
  createMojikumi,
  detectNativeSupport,
  type MojikumiInstance,
  type Precision,
  type PresetName
} from "mojikumi";
import "./style.css";

const SAMPLE =
  "『行頭の括弧』は、半角分のアキを詰めると版面が揃います。\n\nNext.jsと日本語、GPT-5を使う100円の本。約物「（例）」が連続する場面や、改行直後の『括弧』も比較できます。";

const requirements = {
  web: { start: true, both: false, autospace: true },
  book: { start: true, both: true, autospace: true },
  editorial: { start: true, both: true, autospace: false },
  minimal: { start: false, both: false, autospace: false },
  native: { start: true, both: true, autospace: true }
} as const;

const elements = {
  input: document.querySelector<HTMLTextAreaElement>("#input")!,
  preset: document.querySelector<HTMLSelectElement>("#preset")!,
  font: document.querySelector<HTMLSelectElement>("#font")!,
  precision: document.querySelector<HTMLSelectElement>("#precision")!,
  size: document.querySelector<HTMLInputElement>("#size")!,
  width: document.querySelector<HTMLInputElement>("#width")!,
  debug: document.querySelector<HTMLInputElement>("#debug")!,
  reset: document.querySelector<HTMLButtonElement>("#reset")!,
  sizeOutput: document.querySelector<HTMLOutputElement>("#size-output")!,
  widthOutput: document.querySelector<HTMLOutputElement>("#width-output")!,
  before: document.querySelector<HTMLElement>("#before")!,
  native: document.querySelector<HTMLElement>("#native")!,
  enhanced: document.querySelector<HTMLElement>("#enhanced")!,
  compatStatus: document.querySelector<HTMLElement>("#compat-status")!,
  enhancedStatus: document.querySelector<HTMLElement>("#enhanced-status")!
};

let instance: MojikumiInstance | undefined;
let support = detectNativeSupport();

function setSampleText(element: HTMLElement, text: string) {
  element.replaceChildren(
    ...text.split(/\n{2,}/u).map((paragraph) => {
      const node = document.createElement("p");
      node.textContent = paragraph;
      return node;
    })
  );
}

function render() {
  instance?.destroy();
  const text = elements.input.value;
  for (const element of [elements.before, elements.native, elements.enhanced]) {
    setSampleText(element, text);
    element.style.fontFamily =
      elements.font.value === "serif"
        ? '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif'
        : '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif';
    element.style.fontSize = `${elements.size.value}px`;
    element.style.setProperty("--sample-width", `${elements.width.value}em`);
  }

  elements.sizeOutput.value = `${elements.size.value}px`;
  elements.widthOutput.value = `${elements.width.value}em`;
  elements.enhanced.toggleAttribute("data-mjk-debug", elements.debug.checked);
  support = detectNativeSupport(window, elements.enhanced);

  const preset = elements.preset.value as PresetName;
  const precision = elements.precision.value as Precision;
  const required = requirements[preset];
  const missing = [
    !support.textSpacingTrim && "約物間",
    required.start && !support.textSpacingTrimStart && "行頭",
    required.both && !support.textSpacingTrimBoth && "行末",
    required.autospace && !support.textAutospace && "和欧文間"
  ].filter(Boolean);
  const allowsFallback = preset !== "native";
  const usingFallback =
    allowsFallback && (precision === "full" || missing.length > 0);
  elements.compatStatus.innerHTML = `
    <div>
      <span class="compat-status__dot ${usingFallback ? "is-fallback" : ""}" aria-hidden="true"></span>
      <strong>${
        precision === "full"
          ? allowsFallback
            ? "DOMフォールバックを再現中"
            : "Nativeプリセット：標準CSSのみ"
          : missing.length
            ? allowsFallback
              ? `不足機能を補完中：${missing.join("・")}`
              : "Nativeプリセット：標準CSSのみ"
            : "このブラウザでは標準CSSを使用中"
      }</strong>
    </div>
    <p>Autoは対応済みの標準CSSを優先します。Fallback demoでは、未対応ブラウザ向けの補完結果を強制表示します。</p>
  `;
  elements.enhancedStatus.textContent = usingFallback
    ? "標準CSS ＋ DOM補完"
    : preset === "native"
      ? "標準CSSのみ"
      : "標準CSSをそのまま使用";

  instance = createMojikumi({
    preset,
    precision,
    observe: false,
    debug: elements.debug.checked
  }).mount(elements.enhanced);
}

function reset() {
  elements.input.value = SAMPLE;
  elements.preset.value = "web";
  elements.font.value = "serif";
  elements.precision.value = "auto";
  elements.size.value = "18";
  elements.width.value = "24";
  elements.debug.checked = false;
  render();
}

for (const control of [
  elements.input,
  elements.preset,
  elements.font,
  elements.precision,
  elements.size,
  elements.width,
  elements.debug
]) {
  control.addEventListener("input", render);
}
elements.reset.addEventListener("click", reset);
reset();
