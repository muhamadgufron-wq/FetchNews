"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-all hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-600 transition-transform" />
      )}
    </button>
  );
}
