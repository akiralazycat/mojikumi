import { Fragment } from "react";
import type { CodeCopyLabels } from "../content";
import { tokenize } from "../lib/highlight";
import { CodeBlock } from "./code-block";

/* Highlighting happens here, while the page is prerendered. */
export function Snippet({
  language,
  source,
  title,
  labels
}: {
  language: string;
  source: string;
  /** Named in the copy button, so the label says which snippet it copies. */
  title: string;
  labels: CodeCopyLabels;
}) {
  return (
    <CodeBlock
      language={language}
      source={source}
      labels={{ ...labels, action: labels.action.replace("{title}", title) }}
    >
      {tokenize(source).map((token, index) =>
        token.type === "plain" ? (
          <Fragment key={index}>{token.value}</Fragment>
        ) : (
          <span key={index} className={`tok-${token.type}`}>
            {token.value}
          </span>
        )
      )}
    </CodeBlock>
  );
}
