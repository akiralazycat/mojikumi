"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const themeColors: Record<Theme, string> = {
  light: "#f1f5f8",
  dark: "#07121d"
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.backgroundColor = themeColors[theme];
  try {
    localStorage.setItem("mojikumi.math.theme", theme);
  } catch {
    // The appearance still changes when private browsing blocks persistence.
  }

  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = themeColors[theme];
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  return (
    <div className="theme-toggle" role="group" aria-label="表示テーマ">
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={value === "light" ? "ライトテーマ" : "ダークテーマ"}
          onClick={() => {
            applyTheme(value);
            setTheme(value);
          }}
        >
          {value === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
