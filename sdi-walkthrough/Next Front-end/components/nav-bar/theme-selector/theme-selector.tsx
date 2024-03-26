"use client";
import { useEffect, ReactNode } from "react";
import { themeChange } from "theme-change";
import ThemeList from "./theme-list";


const themes: string[] = ["light",
"dark",
"cupcake",
"bumblebee",
"emerald",
"corporate",
"synthwave",
"retro",
"cyberpunk",
"valentine",
"halloween",
"garden",
"forest",
"aqua",
"lofi",
"pastel",
"fantasy",
"wireframe",
"black",
"luxury",
"dracula",
"cmyk",
"autumn",
"business",
"acid",
"lemonade",
"night",
"coffee",
"winter",
"dim",
"nord",
"sunset",] 

export default function ThemeSelector(): ReactNode {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1 hover:btn-primary">
        Theme
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ThemeList themes={themes} />
    </div>
  );
}
