"use client";
import { useEffect, ReactNode, useState } from "react";
import { themeChange } from "theme-change";
import ThemeList from "./theme-list";
import { Theme, User } from "@/types";
import { findUser, updateUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const themes: string[] = [
  "light",
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
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

export default function ThemeSelector(): ReactNode {
  const { isSignedIn, userId } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setCurrentTheme(getTheme(theme));
    }

    if (isSignedIn && userId) {
      (async () => {
        try {
          const user = await findUser(userId); // your API call
          if (user?.data.type) {
            const themeValue = user.data.type;
            setCurrentTheme(themeValue);
            document.documentElement.setAttribute("data-theme", themeValue); // apply theme
            localStorage.setItem("theme", themeValue); // store in localStorage
          }
        } catch (err) {
          console.error("Failed to load user theme:", err);
        }
      })();
    }
  }, [isSignedIn, userId]);

  const { mutate: handleUpdateUser } = useMutation({
    mutationFn: async (data: User) => {
      return updateUser(userId!, data);
    },
    onSuccess: () => {
      console.log("Profile updated successfully");
    },
    onError: (e) => {
      console.error("Error updating profile: ", e);
    },
  });

  const handleThemeChange = (themeValue: string) => {
    setCurrentTheme(getTheme(themeValue));
    localStorage.setItem("theme", themeValue);
    if (isSignedIn && userId) {
      handleUpdateUser({ clerkId: userId, type: getTheme(themeValue) }); // send to backend
    }
  };

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
      <ThemeList themes={themes} currentTheme={currentTheme} onThemeSelect={handleThemeChange} />
    </div>
  );
}

function getTheme(theme: string | null): Theme {
  switch (theme) {
    case "dark":
      return Theme.DARK;
    case "light":
      return Theme.LIGHT;
    case "cupcake":
      return Theme.CUPCAKE;
    case "bumblebee":
      return Theme.BUMBLEBEE;
    case "emerald":
      return Theme.EMERALD;
    case "corporate":
      return Theme.CORPORATE;
    case "synthwave":
      return Theme.SYNTHWAVE;
    case "retro":
      return Theme.RETRO;
    case "cyberpunk":
      return Theme.CYBERPUNK;
    case "valentine":
      return Theme.VALENTINE;
    case "halloween":
      return Theme.HALLOWEEN;
    case "garden":
      return Theme.GARDEN;
    case "forest":
      return Theme.FOREST;
    case "aqua":
      return Theme.AQUA;
    case "lofi":
      return Theme.LOFI;
    case "pastel":
      return Theme.PASTEL;
    case "fantasy":
      return Theme.FANTASY;
    case "wireframe":
      return Theme.WIREFRAME;
    case "black":
      return Theme.BLACK;
    case "luxury":
      return Theme.LUXURY;
    case "dracula":
      return Theme.DRACULA;
    case "cmyk":
      return Theme.CMYK;
    case "autumn":
      return Theme.AUTUMN;
    case "business":
      return Theme.BUSINESS;
    case "acid":
      return Theme.ACID;
    case "lemonade":
      return Theme.LEMONADE;
    case "night":
      return Theme.NIGHT;
    case "coffee":
      return Theme.COFFEE;
    case "winter":
      return Theme.WINTER;
    case "dim":
      return Theme.DIM;
    case "nord":
      return Theme.NORD;
    case "sunset":
      return Theme.SUNSET;
    case "caramellatte":
      return Theme.CARAMELLATTE;
    case "abyss":
      return Theme.ABYSS;
    case "silk":
      return Theme.SILK;
    default:
      return Theme.DARK;
  }
}