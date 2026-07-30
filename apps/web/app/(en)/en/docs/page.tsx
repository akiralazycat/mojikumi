import type { Metadata } from "next";
import { DocsPage } from "../../../../components/pages/docs";
import { getDictionary } from "../../../../content";
import { buildMetadata } from "../../../../lib/site";

export const metadata: Metadata = buildMetadata("en", "docs");

export default function Page() {
  return <DocsPage dictionary={getDictionary("en")} locale="en" />;
}
