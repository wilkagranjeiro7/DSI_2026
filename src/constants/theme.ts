import "@/global.css";

import { Platform } from "react-native";

export class ThemeCatalog {
  static readonly colors = {
    light: {
      text: "#000000",
      background: "#ffffff",
      backgroundElement: "#F0F0F3",
      backgroundSelected: "#E0E1E6",
      textSecondary: "#60646C",
    },
    dark: {
      text: "#ffffff",
      background: "#000000",
      backgroundElement: "#212225",
      backgroundSelected: "#2E3135",
      textSecondary: "#B0B4BA",
    },
  } as const;

  static readonly fonts = Platform.select({
    ios: {
      sans: "system-ui",
      serif: "ui-serif",
      rounded: "ui-rounded",
      mono: "ui-monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      rounded: "normal",
      mono: "monospace",
    },
    web: {
      sans: "var(--font-display)",
      serif: "var(--font-serif)",
      rounded: "var(--font-rounded)",
      mono: "var(--font-mono)",
    },
  });

  static readonly spacing = {
    half: 2,
    one: 4,
    two: 8,
    three: 16,
    four: 24,
    five: 32,
    six: 64,
  } as const;

  static readonly bottomTabInset =
    Platform.select({ ios: 50, android: 80 }) ?? 0;

  static readonly maxContentWidth = 800;
}

export type ThemeColor =
  keyof typeof ThemeCatalog.colors.light & keyof typeof ThemeCatalog.colors.dark;
