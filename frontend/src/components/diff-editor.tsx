import { DiffEditor } from "@monaco-editor/react";
import type { EditorFile } from "@/lib/editor";
import { useTheme } from "@/hooks/theme-provider";

type DiffEditorProps = {
  leftFile: EditorFile;
  rightFile: EditorFile;
  language: string;
};

const DiffEditorComponent = ({ leftFile, rightFile, language}: DiffEditorProps) => {
  const { theme, font, fontSize } = useTheme();
  const monacoTheme = `carrot-${theme}`;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex border-b border-border">
        <div className="w-1/2 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-r border-border">
          {leftFile.path}
        </div>
        <div className="w-1/2 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground">
          {rightFile.path}
        </div>
      </div>
      <div className="flex-1">
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