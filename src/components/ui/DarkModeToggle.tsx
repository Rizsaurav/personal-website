import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Props = {
  variant?: "nav" | "floating";
  className?: string;
};

export default function DarkModeToggle({ variant = "nav", className }: Props) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const base =
    variant === "nav"
      ? // minimal, link-like icon button for navbar
        "relative inline-flex items-center justify-center p-1 rounded-md " +
        "text-text-secondary hover:text-accent-custom-primary " +
        "hover:bg-surface-variant/60 transition focus:outline-none " +
        "focus-visible:ring-2 focus-visible:ring-ring"
      : // fallback floating style (not used here)
        "fixed right-4 top-4 z-[9999] flex h-12 w-12 items-center justify-center rounded-full " +
        "border border-border shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 " +
        "hover:scale-105 transition";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`${base} ${className ?? ""}`}
    >
      {/* overlap icons and cross-fade/rotate */}
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
