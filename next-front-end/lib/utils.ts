import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  
  return {
    colorBackground: styles.getPropertyValue("--b3").trim(), // base-300
    colorPrimary: styles.getPropertyValue("--p").trim(), // primary
    colorText: styles.getPropertyValue("--bc").trim(), // base-content
    colorDanger: styles.getPropertyValue("--er").trim(), // error
    colorSuccess: styles.getPropertyValue("--su").trim(), // success
    colorWarning: styles.getPropertyValue("--wa").trim(), // warning
    colorNeutral: styles.getPropertyValue("--n").trim(), // neutral
    colorTextOnPrimaryBackground: styles.getPropertyValue("--pc").trim(), // primary-content
    colorTextSecondary: styles.getPropertyValue("--sc").trim(), // secondary-content
  };
}