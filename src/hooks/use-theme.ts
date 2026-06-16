import { ThemeCatalog } from "@/constants/theme";
import ColorSchemeService from "@/hooks/use-color-scheme";

export class ThemeService {
  static current() {
    const scheme = ColorSchemeService.read();

    return ThemeCatalog.colors[scheme];
  }
}

export default ThemeService;
