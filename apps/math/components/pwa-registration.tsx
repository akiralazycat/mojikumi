"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(
        () => document.documentElement.setAttribute("data-pwa-ready", "true"),
        () => document.documentElement.setAttribute("data-pwa-ready", "false")
      );
  }, []);

  return null;
}
