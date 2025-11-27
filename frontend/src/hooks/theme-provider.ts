import { createContext, useContext, useEffect, useState, ReactNode, createElement } from "react";
import { loader } from "@monaco-editor/react";

// Define theme configuration interface matching catpuccin-frappe format
export interface MonacoTokenColor {
  name?: string;
  scope?: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
}

export interface Theme {
  type?: "vs-dark" | "light" | "hc-black";
  name: string;
  displayName: string;
  colors: {
    // UI Component Colors (CSS variables) - extracted from colors
    background?: string;
    foreground?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    border?: string;
    input?: string;
    ring?: string;
    // Monaco Editor Colors (all other colors in the colors object)
    [key: string]: string | undefined;
  };
  tokenColors?: MonacoTokenColor[];
  semanticHighlighting?: boolean;
  semanticTokenColors?: {
    [key: string]: string;
  };
}

// UI color keys that should be extracted for CSS variables
const UI_COLOR_KEYS = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "border",
  "input",
  "ring",
];

// Dynamically load all theme files from the themes folder
const themeModules = import.meta.glob<{ default: Theme }>("@/themes/*.json", { eager: true });
const themes: Theme[] = Object.values(themeModules).map((module) => module.default);

// Convert tokenColors to Monaco rules format
function convertTokenColorsToRules(tokenColors?: MonacoTokenColor[]): Array<{
  token: string;
  foreground?: string;
  background?: string;
  fontStyle?: string;
}> {
  if (!tokenColors) return [];

  const rules: Array<{
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
  }> = [];

  tokenColors.forEach((tokenColor) => {
    if (!tokenColor.scope) return;

    const scopes = Array.isArray(tokenColor.scope) ? tokenColor.scope : [tokenColor.scope];
    
    scopes.forEach((scope) => {
      // Convert scope to token format (e.g., "comment" -> "comment", "string" -> "string")
      const token = scope.split(".")[0] || scope;
      
      rules.push({
        token,
        foreground: tokenColor.settings.foreground,
        background: tokenColor.settings.background,
        fontStyle: tokenColor.settings.fontStyle,
      });
    });
  });

  return rules;
}

// Extract UI colors from theme colors object
function extractUIColors(colors: Theme["colors"]): {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
} {
  return {
    background: colors.background || colors["editor.background"] || "#000000",
    foreground: colors.foreground || colors["editor.foreground"] || "#FFFFFF",
    card: colors.card || colors["editor.background"] || "#000000",
    cardForeground: colors.cardForeground || colors["editor.foreground"] || "#FFFFFF",
    popover: colors.popover || colors["editorWidget.background"] || "#000000",
    popoverForeground: colors.popoverForeground || colors["editor.foreground"] || "#FFFFFF",
    primary: colors.primary || colors["button.background"] || "#007ACC",
    primaryForeground: colors.primaryForeground || colors["button.foreground"] || "#FFFFFF",
    secondary: colors.secondary || colors["list.hoverBackground"] || "#2A2D2E",
    secondaryForeground: colors.secondaryForeground || colors["editor.foreground"] || "#FFFFFF",
    muted: colors.muted || colors["list.inactiveSelectionBackground"] || "#37373D",
    mutedForeground: colors.mutedForeground || colors["descriptionForeground"] || "#CCCCCC",
    accent: colors.accent || colors["list.activeSelectionBackground"] || "#094771",
    accentForeground: colors.accentForeground || colors["list.activeSelectionForeground"] || "#FFFFFF",
    destructive: colors.destructive || colors["errorForeground"] || "#E78284",
    border: colors.border || colors["editorWidget.border"] || "#454545",
    input: colors.input || colors["input.background"] || "#3C3C3C",
    ring: colors.ring || colors["focusBorder"] || "#007ACC",
  };
}

// Extract Monaco colors (all colors except UI colors)
function extractMonacoColors(colors: Theme["colors"]): { [key: string]: string } {
  const monacoColors: { [key: string]: string } = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    if (value && !UI_COLOR_KEYS.includes(key)) {
      monacoColors[key] = value;
    }
  });

  return monacoColors;
}

// Convert type to Monaco base theme
function getMonacoBase(themeType?: string, fallbackColors?: Theme["colors"]): "vs" | "vs-dark" | "hc-black" {
  if (themeType === "dark") return "vs-dark";
  if (themeType === "light") return "vs";
  if (themeType === "hc-black") return "hc-black";
  // Fallback: detect from editor background color
  if (fallbackColors?.["editor.background"]?.startsWith("#")) {
    const hex = fallbackColors["editor.background"].substring(1, 3);
    return parseInt(hex, 16) < 128 ? "vs-dark" : "vs";
  }
  return "vs-dark";
}

const STORAGE_KEY = "carrot-theme";
const STORAGE_KEY_FONT = "carrot-font";
const STORAGE_KEY_FONT_SIZE = "carrot-font-size";
const DEFAULT_THEME = "dark";
const DEFAULT_FONT = "Consolas, 'Courier New', monospace";
const DEFAULT_FONT_SIZE = 14;

interface ThemeContextType {
  theme: string;
  monacoTheme: string;
  setTheme: (theme: string) => void;
  themes: Theme[];
  themeColors: ReturnType<typeof extractUIColors> | null;
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && themes.find((t) => t.name === saved)) {
        return saved;
      }
    }
    return DEFAULT_THEME;
  });

  const [font, setFontState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_FONT);
      if (saved) {
        return saved;
      }
    }
    return DEFAULT_FONT;
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
    }
    return DEFAULT_FONT_SIZE;
  });

  const currentTheme = themes.find((t) => t.name === theme) || themes[0];
  const uiColors = currentTheme ? extractUIColors(currentTheme.colors) : null;

  // Apply CSS custom properties
  useEffect(() => {
    if (!uiColors) return;
    
    const root = document.documentElement;
    root.style.setProperty("--background", uiColors.background);
    root.style.setProperty("--foreground", uiColors.foreground);
    root.style.setProperty("--card", uiColors.card);
    root.style.setProperty("--card-foreground", uiColors.cardForeground);
    root.style.setProperty("--popover", uiColors.popover);
    root.style.setProperty("--popover-foreground", uiColors.popoverForeground);
    root.style.setProperty("--primary", uiColors.primary);
    root.style.setProperty("--primary-foreground", uiColors.primaryForeground);
    root.style.setProperty("--secondary", uiColors.secondary);
    root.style.setProperty("--secondary-foreground", uiColors.secondaryForeground);
    root.style.setProperty("--muted", uiColors.muted);
    root.style.setProperty("--muted-foreground", uiColors.mutedForeground);
    root.style.setProperty("--accent", uiColors.accent);
    root.style.setProperty("--accent-foreground", uiColors.accentForeground);
    root.style.setProperty("--destructive", uiColors.destructive);
    root.style.setProperty("--border", uiColors.border);
    root.style.setProperty("--input", uiColors.input);
    root.style.setProperty("--ring", uiColors.ring);
  }, [uiColors]);

  // Register and apply Monaco theme when theme changes
  useEffect(() => {
    if (!currentTheme) return;

    const registerAndApplyTheme = async () => {
      try {
        await loader.init();
        
        let monacoInstance: any;
        try {
          const monaco = await import("monaco-editor");
          monacoInstance = monaco;
        } catch {
          if (typeof window !== "undefined" && (window as any).monaco) {
            monacoInstance = (window as any).monaco;
          } else {
            return;
          }
        }
        
        const themeName = `carrot-${currentTheme.name}`;
        const monacoColors = extractMonacoColors(currentTheme.colors);
        const rules = convertTokenColorsToRules(currentTheme.tokenColors);
        const base = getMonacoBase(currentTheme.type, currentTheme.colors);

        // Register/update the theme
        monacoInstance.editor.defineTheme(themeName, {
          base,
          inherit: true,
          rules,
          colors: monacoColors,
        });

        // Apply the theme globally
        monacoInstance.editor.setTheme(themeName);
      } catch (error) {
        console.error("Failed to register Monaco theme:", error);
      }
    };

    registerAndApplyTheme();
  }, [currentTheme]);

  // Apply font settings to Monaco editor
  useEffect(() => {
    const applyFontSettings = async () => {
      try {
        await loader.init();
        
        let monacoInstance: any;
        try {
          const monaco = await import("monaco-editor");
          monacoInstance = monaco;
        } catch {
          if (typeof window !== "undefined" && (window as any).monaco) {
            monacoInstance = (window as any).monaco;
          } else {
            return;
          }
        }

        const updateOptions = {
          fontFamily: font,
          fontSize: fontSize,
        };
        
        monacoInstance.editor.getEditors().forEach((editor: any) => {
          editor.updateOptions(updateOptions);
        });
      } catch (error) {
        console.error("Failed to apply font settings:", error);
      }
    };

    applyFontSettings();
  }, [font, fontSize]);

  const setTheme = (newTheme: string) => {
    if (themes.find((t) => t.name === newTheme)) {
      setThemeState(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newTheme);
      }
    }
  };

  const setFont = (newFont: string) => {
    setFontState(newFont);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_FONT, newFont);
    }
  };

  const setFontSize = (newSize: number) => {
    if (newSize > 0 && newSize <= 72) {
      setFontSizeState(newSize);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_FONT_SIZE, newSize.toString());
      }
    }
  };

  return createElement(
    ThemeContext.Provider,
    {
      value: {
        theme,
        monacoTheme: currentTheme?.type || "vs-dark",
        setTheme,
        themes,
        themeColors: uiColors,
        font,
        setFont,
        fontSize,
        setFontSize,
      },
    },
    children
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
