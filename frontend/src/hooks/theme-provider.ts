import { createContext, useContext, useEffect, useState, ReactNode, createElement } from "react";
import { loader } from "@monaco-editor/react";

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

// Theme definitions
const themes: Theme[] = [
  {
    name: "dark",
    displayName: "Dark",
    colors: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)",
      cardForeground: "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      popoverForeground: "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)",
      primaryForeground: "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      mutedForeground: "oklch(0.708 0 0)",
      accent: "oklch(0.269 0 0)",
      accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.556 0 0)",
      monaco: {
        base: "vs-dark",
        colors: {
          "editor.background": "#252526",
          "editor.foreground": "#CCCCCC",
          "editorLineNumber.foreground": "#858585",
          "editorLineNumber.activeForeground": "#CCCCCC",
          "editor.selectionBackground": "#264F78",
          "editor.lineHighlightBackground": "#2A2D2E",
          "editorCursor.foreground": "#AEAFAD",
          "editorWhitespace.foreground": "#3B3A32",
          "editorIndentGuide.background": "#404040",
          "editorIndentGuide.activeBackground": "#707070",
          "editor.selectionHighlightBackground": "#ADD6FF26",
          "editor.wordHighlightBackground": "#575757B8",
          "editor.wordHighlightStrongBackground": "#004972B8",
          "editor.findMatchBackground": "#515C6A",
          "editor.findMatchHighlightBackground": "#EA5C0054",
          "editorBracketMatch.background": "#0064001A",
          "editorBracketMatch.border": "#888888",
          "editorGutter.background": "#1E1E1E",
          "editorWidget.background": "#252526",
          "editorWidget.border": "#454545",
          "input.background": "#3C3C3C",
          "input.border": "#454545",
          "input.foreground": "#CCCCCC",
          "inputOption.activeBorder": "#007ACC",
          "dropdown.background": "#3C3C3C",
          "dropdown.border": "#454545",
          "dropdown.foreground": "#CCCCCC",
          "list.activeSelectionBackground": "#094771",
          "list.activeSelectionForeground": "#FFFFFF",
          "list.hoverBackground": "#2A2D2E",
          "list.inactiveSelectionBackground": "#37373D",
          "scrollbarSlider.background": "#79797966",
          "scrollbarSlider.hoverBackground": "#646464B3",
          "scrollbarSlider.activeBackground": "#BFBFBF66",
        },
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
          { token: "class", foreground: "4EC9B0" },
          { token: "function", foreground: "DCDCAA" },
          { token: "variable", foreground: "9CDCFE" },
        ],
      },
    },
  },
  {
    name: "light",
    displayName: "Light",
    colors: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)",
      secondaryForeground: "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)",
      mutedForeground: "oklch(0.556 0 0)",
      accent: "oklch(0.97 0 0)",
      accentForeground: "oklch(0.205 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.922 0 0)",
      input: "oklch(0.922 0 0)",
      ring: "oklch(0.708 0 0)",
      monaco: {
        base: "vs",
        colors: {
          "editor.background": "#FFFFFF",
          "editor.foreground": "#000000",
          "editorLineNumber.foreground": "#237893",
          "editorLineNumber.activeForeground": "#0B216F",
          "editor.selectionBackground": "#ADD6FF",
          "editor.lineHighlightBackground": "#F0F0F0",
          "editorCursor.foreground": "#000000",
          "editorWhitespace.foreground": "#BFBFBF",
          "editorIndentGuide.background": "#D3D3D3",
          "editorIndentGuide.activeBackground": "#939393",
          "editor.selectionHighlightBackground": "#ADD6FF4D",
          "editor.wordHighlightBackground": "#57575733",
          "editor.wordHighlightStrongBackground": "#00497233",
          "editor.findMatchBackground": "#A8AC94",
          "editor.findMatchHighlightBackground": "#EA5C0026",
          "editorBracketMatch.background": "#0064001A",
          "editorBracketMatch.border": "#888888",
          "editorGutter.background": "#F7F7F7",
          "editorWidget.background": "#F3F3F3",
          "editorWidget.border": "#C1C1C1",
          "input.background": "#FFFFFF",
          "input.border": "#CECECE",
          "input.foreground": "#000000",
          "inputOption.activeBorder": "#007ACC",
          "dropdown.background": "#FFFFFF",
          "dropdown.border": "#CECECE",
          "dropdown.foreground": "#000000",
          "list.activeSelectionBackground": "#0064C1",
          "list.activeSelectionForeground": "#FFFFFF",
          "list.hoverBackground": "#E8E8E8",
          "list.inactiveSelectionBackground": "#E4E6F1",
          "scrollbarSlider.background": "#00000040",
          "scrollbarSlider.hoverBackground": "#0000006B",
          "scrollbarSlider.activeBackground": "#00000099",
        },
        rules: [
          { token: "comment", foreground: "008000", fontStyle: "italic" },
          { token: "keyword", foreground: "0000FF" },
          { token: "string", foreground: "A31515" },
          { token: "number", foreground: "098658" },
          { token: "type", foreground: "267F99" },
          { token: "class", foreground: "267F99" },
          { token: "function", foreground: "795E26" },
          { token: "variable", foreground: "001080" },
        ],
      },
    },
  },
  {
    name: "high-contrast",
    displayName: "High Contrast",
    colors: {
      background: "oklch(0.1 0 0)",
      foreground: "oklch(1 0 0)",
      card: "oklch(0.15 0 0)",
      cardForeground: "oklch(1 0 0)",
      popover: "oklch(0.15 0 0)",
      popoverForeground: "oklch(1 0 0)",
      primary: "oklch(1 0 0)",
      primaryForeground: "oklch(0.1 0 0)",
      secondary: "oklch(0.2 0 0)",
      secondaryForeground: "oklch(1 0 0)",
      muted: "oklch(0.2 0 0)",
      mutedForeground: "oklch(0.9 0 0)",
      accent: "oklch(0.2 0 0)",
      accentForeground: "oklch(1 0 0)",
      destructive: "oklch(0.8 0.2 20)",
      border: "oklch(1 0 0)",
      input: "oklch(0.15 0 0)",
      ring: "oklch(1 0 0)",
      monaco: {
        base: "hc-black",
        colors: {
          "editor.background": "#000000",
          "editor.foreground": "#FFFFFF",
          "editorLineNumber.foreground": "#FFFFFF",
          "editorLineNumber.activeForeground": "#FFFFFF",
          "editor.selectionBackground": "#FFFFFF",
          "editor.lineHighlightBackground": "#1F1F1F",
          "editorCursor.foreground": "#FFFFFF",
          "editorWhitespace.foreground": "#FFFFFF",
          "editorIndentGuide.background": "#FFFFFF",
          "editorIndentGuide.activeBackground": "#FFFFFF",
          "editor.selectionHighlightBackground": "#FFFFFF40",
          "editor.wordHighlightBackground": "#FFFFFF40",
          "editor.wordHighlightStrongBackground": "#FFFFFF60",
          "editor.findMatchBackground": "#FFFFFF",
          "editor.findMatchHighlightBackground": "#FFFFFF80",
          "editorBracketMatch.background": "#FFFFFF40",
          "editorBracketMatch.border": "#FFFFFF",
          "editorGutter.background": "#000000",
          "editorWidget.background": "#000000",
          "editorWidget.border": "#FFFFFF",
          "input.background": "#000000",
          "input.border": "#FFFFFF",
          "input.foreground": "#FFFFFF",
          "inputOption.activeBorder": "#FFFFFF",
          "dropdown.background": "#000000",
          "dropdown.border": "#FFFFFF",
          "dropdown.foreground": "#FFFFFF",
          "list.activeSelectionBackground": "#FFFFFF",
          "list.activeSelectionForeground": "#000000",
          "list.hoverBackground": "#1F1F1F",
          "list.inactiveSelectionBackground": "#1F1F1F",
          "scrollbarSlider.background": "#FFFFFF80",
          "scrollbarSlider.hoverBackground": "#FFFFFFB3",
          "scrollbarSlider.activeBackground": "#FFFFFF",
        },
        rules: [
          { token: "comment", foreground: "00FF00", fontStyle: "italic" },
          { token: "keyword", foreground: "00FFFF" },
          { token: "string", foreground: "FFFF00" },
          { token: "number", foreground: "00FF00" },
          { token: "type", foreground: "00FFFF" },
          { token: "class", foreground: "00FFFF" },
          { token: "function", foreground: "FFFF00" },
          { token: "variable", foreground: "FFFFFF" },
        ],
      },
    },
  },
];

const STORAGE_KEY = "carrot-theme";
const STORAGE_KEY_FONT = "carrot-font";
const STORAGE_KEY_FONT_SIZE = "carrot-font-size";
const DEFAULT_THEME = "dark";
const DEFAULT_FONT = "Consolas, 'Courier New', monospace";
const DEFAULT_FONT_SIZE = 14;

interface ThemeContextType {
  theme: string;
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

