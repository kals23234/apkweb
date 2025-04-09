import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToRgba(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// This should be used in a React component, not directly called from a .ts file
export function getGlowTextStyle(color: string) {
  return {
    color,
    textShadow: `0 0 10px ${color}`,
    className: "glow-text"
  };
}

// Add CSS class to style glowing text
export const glowTextStyle = `
  .glow-text {
    text-shadow: 0 0 10px currentColor;
  }
`;

export function getRandomColor() {
  const colors = ["#6E44FF", "#00D1FF", "#FF3D71"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
