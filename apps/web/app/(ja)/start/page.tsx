import type { Metadata } from "next";
import { StartPage } from "../../../components/pages/start";
import { getDictionary } from "../../../content";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata("ja", "start");

export default function Page() {
  return <StartPage dictionary={getDictionary("ja")} locale="ja" />;
}
