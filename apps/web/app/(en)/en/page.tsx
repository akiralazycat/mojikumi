import type { Metadata } from "next";
import { HomePage } from "../../../components/pages/home";
import { getDictionary } from "../../../content";
import { buildMetadata } from "../../../lib/site";

export const metadata: Metadata = buildMetadata("en", "home");

export default function Page() {
  return <HomePage dictionary={getDictionary("en")} locale="en" />;
}
