import type { Metadata } from "next";
import "@mojikumi/css/mojikumi.css";
import "./globals.css";
import { NotFoundView } from "../components/pages/not-found";
import { RootDocument } from "../components/root-document";
import { getDictionary } from "../content";

export { viewport } from "../components/root-document";

/*
 * This file sits outside both root layouts and replaces them: Next.js cannot
 * pick one for a URL it never matched. Nothing wraps what is returned here, so
 * `RootDocument` has to be called for the document itself, and the stylesheets
 * the layouts normally import have to be imported again.
 */
export const metadata: Metadata = {
  /*
   * One document answers for both locales, and React restores whatever the
   * metadata says on hydration, so a title the script swapped would snap back.
   * The number reads the same in either language.
   */
  title: "404 — Mojikumi",
  /* A page with no address of its own, served for every address that missed. */
  robots: { index: false, follow: true }
};

/*
 * `output: "export"` writes one 404.html and Vercel serves it for every
 * unmatched URL, English ones included. Both locales are in the document and
 * this picks between them from the path, in the head, before the body is
 * parsed — so neither copy is ever painted and then swapped. With scripting
 * off the Japanese copy stands, and the header still offers the language
 * toggle.
 */
const localeScript = `
try {
  if (location.pathname === "/en" || location.pathname.startsWith("/en/")) {
    document.documentElement.lang = "en";
    document.documentElement.dataset.notFoundLocale = "en";
  }
} catch {}
`;

export default function NotFound() {
  return (
    <RootDocument
      locale="ja"
      head={<script dangerouslySetInnerHTML={{ __html: localeScript }} />}
    >
      <main className="page-shell">
        <NotFoundView dictionary={getDictionary("ja")} locale="ja" />
        <NotFoundView dictionary={getDictionary("en")} locale="en" />
      </main>
    </RootDocument>
  );
}
