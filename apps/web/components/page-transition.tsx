"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useSectionReveal } from "./section-reveal";

/*
 * A client-side navigation replaces the whole page subtree, and the Mojikumi
 * runtime pass re-runs over the shell in the same task, because its mutation
 * observer sees the swap. Both land before the browser gets to paint, so an
 * animation that starts at commit time spends its opening frames on a blocked
 * main thread: on a throttled CPU the wrapper measured 0 for 70ms and then
 * jumped straight to half opacity — the fade was over before it was visible.
 *
 * So the new page is pinned at its "from" state during the commit and released
 * two frames later, once that work has drained. The transition then runs on
 * its own, with nothing mutating underneath it. The first render is left
 * alone: server-rendered markup should be readable the moment it paints, and
 * sections below the fold have their own reveal in useSectionReveal.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const settled = useRef(false);

  useSectionReveal(ref);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!settled.current) {
      settled.current = true;
      return;
    }

    element.dataset.pageState = "enter";
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        element.dataset.pageState = "ready";
      });
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      element.dataset.pageState = "ready";
    };
  }, [pathname]);

  return (
    <div className="page-transition" data-page-state="ready" ref={ref}>
      {children}
    </div>
  );
}
