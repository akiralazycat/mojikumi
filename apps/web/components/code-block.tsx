"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import { CheckIcon, CopyIcon } from "./icons";

/*
 * Only the button needs the browser: the highlighted markup arrives already
 * rendered from the server as `children`, so nothing about the snippet itself
 * is re-done on the client.
 */

/** Clipboard access needs a secure context; fall back where it is missing. */
async function writeToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* Permission refused, or the document was not focused. */
    }
  }

  const holder = document.createElement("textarea");
  holder.value = text;
  holder.setAttribute("readonly", "");
  holder.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.append(holder);
  holder.select();
  const copied = document.execCommand?.("copy") ?? false;
  holder.remove();
  return copied;
}

export function CodeBlock({
  language,
  source,
  labels,
  children
}: {
  language: string;
  source: string;
  labels: { label: string; copied: string; action: string };
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<[number, number] | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /*
   * The two labels are stacked in one cell so the confirmation crossfades in
   * place, which otherwise sizes the button to the longer of them and leaves
   * the shorter one sitting against a gap. Measuring both lets the button be
   * exactly as wide as the label it is showing, and lets the change between
   * them ease rather than jump. Until the measurement lands the cell falls back
   * to `auto`, so a button that never reaches this code is merely wide, not
   * clipped. Mincho and the UI face both load late, so measure again once the
   * fonts are in.
   */
  useLayoutEffect(() => {
    const node = labelRef.current;
    if (!node) return;
    let cancelled = false;

    const measure = () => {
      const [idle, done] = node.children;
      if (cancelled || !idle || !done) return;
      setWidth([
        idle.getBoundingClientRect().width,
        done.getBoundingClientRect().width
      ]);
    };

    measure();
    void document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [labels.label, labels.copied]);

  const labelStyle = width
    ? ({
        "--copy-label-width": `${width[0]}px`,
        "--copy-label-width-done": `${width[1]}px`
      } as CSSProperties)
    : undefined;

  const copy = useCallback(async () => {
    if (!(await writeToClipboard(source))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2400);
  }, [source]);

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span className="code-language">{language}</span>
        <button
          type="button"
          className="code-copy"
          onClick={copy}
          data-copied={copied ? "" : undefined}
          aria-label={labels.action}
        >
          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          <span
            className="code-copy-label"
            aria-hidden="true"
            ref={labelRef}
            style={labelStyle}
          >
            <span>{labels.label}</span>
            <span>{labels.copied}</span>
          </span>
        </button>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
      {/* The button is named by aria-label, so announce the result separately. */}
      <span className="visually-hidden" role="status">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
