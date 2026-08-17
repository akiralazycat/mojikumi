import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "math-virtual-keyboard-policy"?: "auto" | "manual" | "sandboxed";
      };
    }
  }
}
