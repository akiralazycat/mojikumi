"use client";

import { Mojikumi } from "@mojikumi/react";
import type { ReactNode } from "react";

export function SiteMojikumi({ children }: { children: ReactNode }) {
  return (
    <Mojikumi
      as="div"
      className="site-shell"
      preset="web"
      precision="auto"
      exclude={[".playground-controls", ".comparison"]}
    >
      {children}
    </Mojikumi>
  );
}
