"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className=""
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Moon
        size={24}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <Sun
        size={24}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
    </button>
  );
};

export default ThemeToggle;
