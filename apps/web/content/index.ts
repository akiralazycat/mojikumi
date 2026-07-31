import { en } from "./en";
import { ja } from "./ja";
import { locales, type Dictionary, type Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { locales };
export type {
  CodeCopyLabels,
  Dictionary,
  DocsSection,
  DocsTable,
  Guide,
  LegalPage,
  LegalSection,
  Locale,
  TermDefinition
} from "./types";
