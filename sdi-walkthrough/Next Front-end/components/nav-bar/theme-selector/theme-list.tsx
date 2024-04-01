import React from "react";
import ThemeItem from "./theme-item";

export default function ThemeList({
  themes,
}: Readonly<{ themes: string[] }>): React.ReactNode {
  return (
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 z-10 shadow bg-base-200 rounded-box w-52 h-80 overflow-auto overscroll-auto"
      >
        <div className="grid grid-cols-1">
          {themes.map((theme) => (
            <ThemeItem key={theme} value={theme} />
          ))}
        </div>
      </ul>
  );
}
