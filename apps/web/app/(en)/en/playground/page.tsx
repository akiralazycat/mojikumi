import type { Metadata } from "next";
import { PlaygroundPage } from "../../../../components/pages/playground";
import { getDictionary } from "../../../../content";
import { buildMetadata } from "../../../../lib/site";

export const metadata: Metadata = buildMetadata("en", "playground");

export default function Page() {
  return <PlaygroundPage dictionary={getDictionary("en")} />;
}
