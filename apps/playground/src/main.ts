import "@mojikumi/css/mojikumi.css";
import { createMojikumi, type MojikumiInstance, type PresetName } from "mojikumi";
import "./style.css";

const SAMPLE =
  "『「引用部分」が行頭へ移るとき』、括弧のアキはどう見えるでしょうか。\n\nNext.jsと日本語、GPT-5を使う100円の本。約物「（例）」が連続する場面も比較できます。";

const elements = {
  input: document.querySelector<HTMLTextAreaElement>("#input")!,
  preset: document.querySelector<HTMLSelectElement>("#preset")!,
  font: document.querySelector<HTMLSelectElement>("#font")!,
  size: document.querySelector<HTMLInputElement>("#size")!,
  width: document.querySelector<HTMLInputElement>("#width")!,
  debug: document.querySelector<HTMLInputElement>("#debug")!,
  reset: document.querySelector<HTMLButtonElement>("#reset")!,
  sizeOutput: document.querySelector<HTMLOutputElement>("#size-output")!,
  widthOutput: document.querySelector<HTMLOutputElement>("#width-output")!,
  before: document.querySelector<HTMLElement>("#before")!,
  native: document.querySelector<HTMLElement>("#native")!,
  enhanced: document.querySelector<HTMLElement>("#enhanced")!
};

let instance: MojikumiInstance | undefined;

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

  instance = createMojikumi({
    preset: elements.preset.value as PresetName,
    precision: "full",
    observe: false,
    debug: elements.debug.checked
  }).mount(elements.enhanced);
}

function reset() {
  elements.input.value = SAMPLE;
  elements.preset.value = "book";
  elements.font.value = "serif";
  elements.size.value = "18";
  elements.width.value = "28";
  elements.debug.checked = false;
  render();
}

for (const control of [
  elements.input,
  elements.preset,
  elements.font,
  elements.size,
  elements.width,
  elements.debug
]) {
  control.addEventListener("input", render);
}
elements.reset.addEventListener("click", reset);
reset();
