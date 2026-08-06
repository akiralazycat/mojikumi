"use client";

import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type Ref
} from "react";
import {
  createMojikumi,
  type MojikumiOptions
} from "@mojikumi/dom";

function optionSignature(options: MojikumiOptions): string {
  return JSON.stringify({
    preset: options.preset ?? "minimal",
    precision: options.precision ?? "auto",
    indent: options.indent ?? null,
    justify: options.justify ?? null,
    hanging: options.hanging ?? null,
    headingBreak: options.headingBreak ?? null,
    observe: options.observe ?? true,
    observeResize: options.observeResize,
    observeMutations: options.observeMutations,
    debug: options.debug ?? false,
    exclude: options.exclude ?? []
  });
}

export function useMojikumi<T extends Element = HTMLElement>(
  options: MojikumiOptions = {}
) {
  const elementRef = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const signature = optionSignature(options);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const instance = createMojikumi(optionsRef.current).mount(element);
    return () => instance.destroy();
  }, [signature]);

  return elementRef;
}

export interface MojikumiProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
  preset?: MojikumiOptions["preset"];
  precision?: MojikumiOptions["precision"];
  indent?: MojikumiOptions["indent"];
  justify?: MojikumiOptions["justify"];
  hanging?: MojikumiOptions["hanging"];
  headingBreak?: MojikumiOptions["headingBreak"];
  observe?: boolean;
  observeResize?: boolean;
  observeMutations?: boolean;
  debug?: boolean;
  exclude?: readonly string[];
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export const Mojikumi = forwardRef<HTMLElement, MojikumiProps>(
  function Mojikumi(
    {
      as = "article",
      children,
      className,
      lang = "ja",
      preset = "minimal",
      precision = "auto",
      indent,
      justify,
      hanging,
      headingBreak,
      observe,
      observeResize,
      observeMutations,
      debug,
      exclude,
      ...rest
    },
    forwardedRef
  ) {
    const options: MojikumiOptions = {
      preset,
      precision,
      ...(indent === undefined ? {} : { indent }),
      ...(justify === undefined ? {} : { justify }),
      ...(hanging === undefined ? {} : { hanging }),
      ...(headingBreak === undefined ? {} : { headingBreak }),
      ...(observe === undefined ? {} : { observe }),
      ...(observeResize === undefined ? {} : { observeResize }),
      ...(observeMutations === undefined ? {} : { observeMutations }),
      ...(debug === undefined ? {} : { debug }),
      ...(exclude === undefined ? {} : { exclude })
    };
    const internalRef = useMojikumi<HTMLElement>(options);
    const setRef = useCallback(
      (element: HTMLElement | null) => {
        internalRef.current = element;
        assignRef(forwardedRef, element);
      },
      [forwardedRef, internalRef]
    );
    const classes = ["mjk", className].filter(Boolean).join(" ");

    return createElement(
      as,
      {
        ...rest,
        ref: setRef,
        lang,
        className: classes,
        "data-mjk-preset": preset,
        ...(debug ? { "data-mjk-debug": "" } : {})
      },
      children
    );
  }
);
