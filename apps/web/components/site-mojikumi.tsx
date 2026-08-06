"use client";

import { Mojikumi } from "@mojikumi/react";
import type { ReactNode } from "react";
import type { Locale } from "../content";

export function SiteMojikumi({
  children,
  locale
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <Mojikumi
      as="div"
      className="site-shell"
      lang={locale}
      preset="minimal"
      precision="auto"
      exclude={[".playground-controls", ".comparison"]}
    >
      {children}
    </Mojikumi>
  );
}
