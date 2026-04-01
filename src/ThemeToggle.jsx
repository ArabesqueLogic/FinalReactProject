import React from "react";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="theme-toggle__slider">
        {isDarkMode ? (
          <i class="fa-solid fa-circle"></i> // Crescent moon icon
        ) : (
          <i class="fa-regular fa-circle"></i> // Sun icon
        )}
      </div>
      <span className="theme-toggle__text">
        {isDarkMode ? "Dark" : "Light"}
      </span>
    </button>
  );
};

export default ThemeToggle;
