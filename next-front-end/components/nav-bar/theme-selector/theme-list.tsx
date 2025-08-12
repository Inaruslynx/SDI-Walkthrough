import React from "react";
import ThemeItem from "./theme-item";

interface ThemeListProps {
  themes: string[];
  currentTheme?: string | null;
  onThemeSelect: (theme: string) => void;
}

export default function ThemeList({
  themes,
  currentTheme,
  onThemeSelect,
}: ThemeListProps): React.ReactNode {
  return (
    <ul
      tabIndex={0}
      className="dropdown-content p-2 z-10 shadow-sm bg-base-300 rounded-box w-52 h-80 overflow-auto overscroll-auto"
    >
      <div className="grid grid-cols-1">
        {themes.map((theme) => (
          <ThemeItem key={theme} value={theme} isActive={theme === currentTheme} onClick={() => onThemeSelect(theme)}/>
        ))}
      </div>
    </ul>
  );
}
