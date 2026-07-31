import type { Metadata } from "next";
import { LegalPageView } from "../../../components/pages/legal";
import { getDictionary } from "../../../content";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata("ja", "terms");

export default function Page() {
  return <LegalPageView page={getDictionary("ja").terms} />;
}
