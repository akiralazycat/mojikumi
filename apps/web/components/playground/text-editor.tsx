"use client";

import { useEffect, useRef, type ClipboardEvent } from "react";
import { useMojikumi } from "@mojikumi/react";

type PresetName = "web" | "book" | "editorial" | "minimal" | "native";

/*
 * The editable surface is a contenteditable host holding one <p> per paragraph,
 * so the preset's block-level typesetting applies while you type: hanging
 * punctuation, the book preset's paragraph indent, line-break: strict, and the
 * standard trimming properties all render live, none of which a <textarea> can
 * show.
 *
 * Mojikumi is mounted at precision "native", which is the only safe depth
 * inside an editing host. The DOM fallback wraps punctuation in generated
 * spans, and @mojikumi/dom excludes [contenteditable] from that pass by
 * default, precisely because browser editing commands would split and merge
 * those spans as you type. The comparison cards below carry the fallback.
 */

function toParagraphs(text: string): string[] {
  const paragraphs = text.split(/\n{2,}/u);
  return paragraphs.length > 0 ? paragraphs : [""];
}

/** Each block child is one paragraph, which is how the preview reads it back. */
function readText(host: HTMLElement): string {
  return [...host.childNodes]
    .map((node) => node.textContent ?? "")
    .join("\n\n");
}

function writeText(host: HTMLElement, text: string): void {
  host.replaceChildren(
    ...toParagraphs(text).map((paragraph) => {
      const element = host.ownerDocument.createElement("p");
      // An empty <p> collapses and cannot be clicked into, so keep a break.
      if (paragraph) element.textContent = paragraph;
      else element.append(host.ownerDocument.createElement("br"));
      return element;
    })
  );
}

export function TextEditor({
  label,
  labelId,
  text,
  preset,
  onChange
}: {
  label: string;
  labelId: string;
  text: string;
  preset: PresetName;
  onChange: (value: string) => void;
}) {
  const hostRef = useMojikumi<HTMLDivElement>({
    preset,
    precision: "native",
    observe: false
  });
  const composing = useRef(false);

  /*
   * The host is uncontrolled: React never re-renders its children, so the
   * caret, the selection and the native undo stack are left alone. This only
   * writes when the text arrived from somewhere other than the host itself,
   * which means the first render and the reset button.
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || readText(host) === text) return;
    writeText(host, text);
  }, [hostRef, text]);

  const publish = () => {
    const host = hostRef.current;
    if (host) onChange(readText(host));
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const plain = event.clipboardData.getData("text/plain");
    event.preventDefault();
    // execCommand is the only insert that keeps the browser's undo history.
    if (!document.execCommand("insertText", false, plain)) {
      const selection = document.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      if (!range) return;
      range.deleteContents();
      range.insertNode(document.createTextNode(plain));
      range.collapse(false);
    }
    publish();
  };

  return (
    <div className="control-field control-field-text">
      <span id={labelId}>{label}</span>
      <div
        className="control-editor"
        ref={hostRef}
        role="textbox"
        aria-multiline="true"
        aria-labelledby={labelId}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={() => {
          // Mid-conversion IME text is not the user's answer yet.
          if (!composing.current) publish();
        }}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={() => {
          composing.current = false;
          publish();
        }}
        onPaste={handlePaste}
      />
    </div>
  );
}
