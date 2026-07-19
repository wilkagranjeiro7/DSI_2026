import { Appearance } from "react-native";

export class ColorSchemeService {
  static read(): "light" | "dark" {
    return Appearance.getColorScheme() === "dark" ? "dark" : "light";
  }
}

export default ColorSchemeService;
