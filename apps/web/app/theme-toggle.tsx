"use client";

import { useEffect, useState } from "react";

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

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  return (
    <div className="theme-toggle" role="group" aria-label="カラーテーマ">
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => {
            applyTheme(value);
            setTheme(value);
          }}
        >
          {value === "light" ? "明" : "暗"}
        </button>
      ))}
    </div>
  );
}
