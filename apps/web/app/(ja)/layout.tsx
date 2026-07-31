import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@mojikumi/css/mojikumi.css";
import "../globals.css";
import { RootDocument, rootMetadata } from "../../components/root-document";

export const metadata: Metadata = rootMetadata("ja");
export { viewport } from "../../components/root-document";

export default function JapaneseLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale="ja">{children}</RootDocument>;
}
