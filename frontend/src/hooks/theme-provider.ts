import { createContext, useContext, useEffect, useState, ReactNode, createElement } from "react";
import { loader } from "@monaco-editor/react";
import themesData from "@/themes.json";

// Define theme configuration interface
export interface ThemeColors {
  // UI Component Colors (CSS variables)
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
  // Monaco Editor Colors
  monaco: {
    base: "vs" | "vs-dark" | "hc-black";
    colors: {
      [key: string]: string;
    };
    rules: Array<{
      token: string;
      foreground?: string;
      background?: string;
      fontStyle?: string;
    }>;
  };
}

export interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
}

// Theme definitions loaded from JSON file
const themes: Theme[] = themesData as Theme[];

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
  themeColors: ThemeColors | null;
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

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--popover", colors.popover);
    root.style.setProperty("--popover-foreground", colors.popoverForeground);
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--destructive", colors.destructive);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.input);
    root.style.setProperty("--ring", colors.ring);
  }, [currentTheme]);

  // Define all Monaco themes and apply current theme
  useEffect(() => {
    const defineMonacoThemes = async () => {
      try {
        // Initialize Monaco loader
        await loader.init();
        
        // Get monaco instance - try dynamic import first, then fallback to global
        let monacoInstance: any;
        try {
          const monaco = await import("monaco-editor");
          monacoInstance = monaco;
        } catch {
          // Fallback to global monaco if available
          if (typeof window !== "undefined" && (window as any).monaco) {
            monacoInstance = (window as any).monaco;
          } else {
            throw new Error("Monaco editor not available");
          }
        }
        
        // Define all themes upfront
        themes.forEach((theme) => {
          monacoInstance.editor.defineTheme(`carrot-${theme.name}`, {
            base: theme.colors.monaco.base,
            inherit: true,
            rules: theme.colors.monaco.rules,
            colors: theme.colors.monaco.colors,
          });
        });

        // Set the current theme
        monacoInstance.editor.setTheme(`carrot-${currentTheme.name}`);
      } catch (error) {
        console.error("Failed to initialize Monaco editor:", error);
      }
    };

    defineMonacoThemes();
  }, [currentTheme]);

  // Apply font and font size to Monaco editor
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

        // Update global editor options
        monacoInstance.editor.defineTheme("temp", {});
        const updateOptions = {
          fontFamily: font,
          fontSize: fontSize,
        };
        
        // Apply to all existing editors
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
        monacoTheme: currentTheme.colors.monaco.base,
        setTheme,
        themes,
        themeColors: currentTheme.colors,
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

