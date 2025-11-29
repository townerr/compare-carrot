import { DiffEditor } from "@monaco-editor/react";
import { ArrowLeft } from "lucide-react";
import type { EditorFile } from "@/lib/editor";
import { useTheme } from "@/hooks/theme-provider";

type DiffEditorProps = {
  leftFile: EditorFile;
  rightFile: EditorFile;
  language: string;
  onBack: () => void;
};

const DiffEditorComponent = ({ leftFile, rightFile, language, onBack }: DiffEditorProps) => {
  const { monacoTheme, font, fontSize } = useTheme();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex border-b border-border">
        <button
          onClick={onBack}
          className="px-3 py-2 hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-1/2 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-r border-border">
          {leftFile.path}
        </div>
        <div className="w-1/2 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
          {rightFile.path}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DiffEditor
          height="100%"
          width="100%"
          original={leftFile.contents}
          modified={rightFile.contents}
          language={language}
          theme={monacoTheme}
          options={{
            readOnly: false,
            renderSideBySide: true,
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

export default DiffEditorComponent;