"use client";

import * as React from "react";
import { updateThemeMode } from "@/lib/theme-utils";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? getSystemTheme();

    setTheme(initial);
    updateThemeMode(initial);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    updateThemeMode(next);
  };

  return (
    <button
      type="button"
      aria-label="Chuyển chế độ sáng/tối"
      onClick={toggleTheme}
      className={[
        "inline-flex items-center justify-center",
        "w-10 h-10 rounded-full",
        "border border-gray-3 bg-background dark:bg-surface hover:bg-gray-2 dark:hover:bg-surface-hover",
        "transition-colors duration-200",
        "dark:bg-dark dark:border-dark-3 dark:hover:bg-dark-2",
        className,
      ].join(" ")}
    >
      {/* Tránh nháy icon sai theme khi SSR/CSR */}
      {!mounted ? (
        <span className="block w-[18px] h-[18px] opacity-0" />
      ) : theme === "dark" ? (
        // 🌙 Moon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
        </svg>
      ) : (
        // ☀️ Sun icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}