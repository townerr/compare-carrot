import MonacoEditor from "@monaco-editor/react";
import { useTheme } from "@/hooks/theme-provider";

type EditorProps = {
  content: string | null;
  language: string;
};

const Editor = ({ content, language }: EditorProps) => {
  const { monacoTheme, font, fontSize } = useTheme();

  return (
    <div className="h-full w-full">
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
  );
};

export default Editor;