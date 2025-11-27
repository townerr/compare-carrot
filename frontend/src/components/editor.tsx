import MonacoEditor from "@monaco-editor/react";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/hooks/theme-provider";

type EditorProps = {
  content: string | null;
  language: string;
  filePath: string;
  onBack?: () => void;
};

const Editor = ({ content, language, filePath, onBack }: EditorProps) => {
  const { monacoTheme, font, fontSize } = useTheme();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center border-b border-border">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
          {filePath}
        </div>
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme={monacoTheme}
          value={content ?? ""}
          options={{
            readOnly: false,
            renderIndicators: true,
            minimap: {
              enabled: false,
            },
            fontFamily: font,
            fontSize: fontSize,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;