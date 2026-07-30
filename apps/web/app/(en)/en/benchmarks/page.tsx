import type { Metadata } from "next";
import { BenchmarksPage } from "../../../../components/pages/benchmarks";
import { getDictionary } from "../../../../content";
import { buildMetadata } from "../../../../lib/site";

export const metadata: Metadata = buildMetadata("en", "benchmarks");

export default function Page() {
  return <BenchmarksPage dictionary={getDictionary("en")} />;
}
