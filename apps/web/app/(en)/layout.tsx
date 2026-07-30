import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@mojikumi/css/mojikumi.css";
import "../globals.css";
import { RootDocument, rootMetadata } from "../../components/root-document";

export const metadata: Metadata = rootMetadata("en");
export { viewport } from "../../components/root-document";

export default function EnglishLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
