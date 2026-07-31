import type { Metadata } from "next";
import { BenchmarksPage } from "../../../components/pages/benchmarks";
import { getDictionary } from "../../../content";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata("ja", "benchmarks");

export default function Page() {
  return <BenchmarksPage dictionary={getDictionary("ja")} locale="ja" />;
}
