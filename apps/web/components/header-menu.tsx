"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary, Locale } from "../content";
import { pageHref, repositoryUrl } from "../lib/site";
import { CloseIcon, MenuIcon } from "./icons";
import { LangToggle } from "./lang-toggle";
import { ThemeToggle } from "./theme-toggle";

export function HeaderMenu({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Same-locale links navigate on the client, so close on the route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: pageHref(locale, "docs"), label: dictionary.nav.docs },
    { href: pageHref(locale, "playground"), label: dictionary.nav.playground },
    { href: pageHref(locale, "benchmarks"), label: dictionary.nav.benchmarks }
  ];

  return (
    <div className="header-menu" ref={rootRef}>
      <button
        type="button"
        className="header-menu-trigger"
        ref={triggerRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dictionary.nav.close : dictionary.nav.settings}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="header-menu-mark" aria-hidden="true">
          <span>あ</span>
          <span>A</span>
        </span>
        <span className="header-menu-icon" aria-hidden="true">
          {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </span>
      </button>

      {open ? (
        <div className="header-panel" id={panelId}>
          <nav className="header-panel-nav" aria-label={dictionary.nav.label}>
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <a href={repositoryUrl}>{dictionary.nav.github}</a>
          </nav>

          <div className="header-panel-row">
            <p>{dictionary.language.label}</p>
            <LangToggle dictionary={dictionary} locale={locale} />
          </div>

          <div className="header-panel-row">
            <p>{dictionary.theme.label}</p>
            <ThemeToggle dictionary={dictionary} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
