"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "../content";

type Theme = "light" | "dark";

const themeColors: Record<Theme, string> = {
  light: "#f5f0ea",
  dark: "#120d10"
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.backgroundColor = themeColors[theme];
  localStorage.setItem("mojikumi.theme", theme);

  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  themeColor?.setAttribute("content", themeColors[theme]);
}

export function ThemeToggle({ dictionary }: { dictionary: Dictionary }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const labels: Record<Theme, { short: string; title: string }> = {
    light: { short: dictionary.theme.light, title: dictionary.theme.lightTitle },
    dark: { short: dictionary.theme.dark, title: dictionary.theme.darkTitle }
  };

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  return (
    <div className="pill-toggle" role="group" aria-label={dictionary.theme.label}>
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={labels[value].title}
          title={labels[value].title}
          onClick={() => {
            applyTheme(value);
            setTheme(value);
          }}
        >
          {labels[value].short}
        </button>
      ))}
    </div>
  );
}
