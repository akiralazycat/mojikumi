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
    preset: options.preset ?? "web",
    precision: options.precision ?? "auto",
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
      preset = "web",
      precision = "auto",
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
    const classes = ["mjk", `mjk-${preset}`, className]
      .filter(Boolean)
      .join(" ");

    return createElement(
      as,
      {
        ...rest,
        ref: setRef,
        lang,
        className: classes,
        ...(debug ? { "data-mjk-debug": "" } : {})
      },
      children
    );
  }
);
