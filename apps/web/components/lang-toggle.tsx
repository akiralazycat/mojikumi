"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "../content";
import { switchLocalePath } from "../lib/site";

export function LangToggle({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname() ?? "/";
  const options: { value: Locale; short: string; title: string }[] = [
    { value: "ja", short: dictionary.language.ja, title: dictionary.language.jaTitle },
    { value: "en", short: dictionary.language.en, title: dictionary.language.enTitle }
  ];

  return (
    <div className="pill-toggle" role="group" aria-label={dictionary.language.label}>
      {options.map((option) => {
        const current = option.value === locale;
        return (
          <Link
            key={option.value}
            href={switchLocalePath(option.value, pathname)}
            hrefLang={option.value}
            aria-current={current ? "true" : undefined}
            data-active={current ? "true" : undefined}
            title={option.title}
          >
            {option.short}
          </Link>
        );
      })}
    </div>
  );
}
