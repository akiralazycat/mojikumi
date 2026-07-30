"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/*
 * Keying on the pathname remounts the wrapper on every client-side navigation,
 * which replays the CSS animation. The header and footer stay outside it, so
 * only the page content settles in. `prefers-reduced-motion` is handled in
 * globals.css, where the keyframe defines a `from` state only: cutting the
 * duration there leaves the content at its resting state rather than hidden.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page-transition" key={pathname}>
      {children}
    </div>
  );
}
