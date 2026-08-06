"use client";

import { usePathname } from "next/navigation";
import { useEffect, type RefObject } from "react";

/*
 * The sections that fade in as they come up the viewport. Kept here rather
 * than as a prop on each one: the pages are plain server components, and the
 * reveal is presentation the markup should not have to carry.
 */
const REVEAL_SELECTOR = [
  ".section-block",
  ".closing-panel",
  ".docs-content section",
  ".start-choice",
  ".next-step",
  ".benchmark-status",
  ".benchmark-results",
  ".benchmark-grid article",
  ".method-note",
  ".legal-content section + section"
].join(",");

/*
 * Hides the sections that are still below the fold and releases each one the
 * first time it comes into view.
 *
 * Nothing is hidden up front. The observer is pointed at every section while
 * they are all still visible, and the hiding happens inside its first report:
 * a section the browser tells us is off screen becomes `pending`, one that is
 * already on screen is let go untouched. That ordering is the whole safety
 * argument. Hiding content from a script means something has to bring it back,
 * and an observer that never reports — a document that loads in a background
 * tab and is never looked at, a callback that throws — would otherwise leave
 * the page with holes in it. Here the only code that can hide a section is the
 * same code that proves the observer is running.
 *
 * From there it is a latch. `pending` becomes `shown` the first time the
 * section intersects, and the section is unobserved on the way out, so a
 * webfont landing or a paragraph being rewritten underneath it has nothing
 * left to act on. A section can move toward visible and then stop; it has no
 * path back.
 */
export function useSectionReveal(root: RefObject<HTMLElement | null>) {
  const pathname = usePathname();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const sections = [...element.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;

        if (!entry.isIntersecting) {
          /*
           * Only ever on the first report, while the section is still off
           * screen, so the reader never sees it go out.
           */
          if (!section.dataset.reveal) section.dataset.reveal = "pending";
          continue;
        }

        if (section.dataset.reveal === "pending") section.dataset.reveal = "shown";
        observer.unobserve(section);
      }
    });

    for (const section of sections) observer.observe(section);

    return () => {
      observer.disconnect();
      /*
       * Unhiding is always the safe way to fail, so anything still waiting its
       * turn is handed back visible rather than left for a teardown that may
       * not come.
       */
      for (const section of sections) {
        if (section.dataset.reveal === "pending") delete section.dataset.reveal;
      }
    };
  }, [root, pathname]);
}
