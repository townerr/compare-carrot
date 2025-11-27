import MonacoEditor from "@monaco-editor/react";

type EditorProps = {
  content: string | null;
  language: string;
};

const Editor = ({ content, language }: EditorProps) => {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        value={content ?? ""}
        options={{
          readOnly: false,
          renderIndicators: true,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};

export default Editor;