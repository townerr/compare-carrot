import { useEffect, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { EditorFile } from "@/lib/editor";

type DiffEditorProps = {
  leftFile: EditorFile;
  rightFile: EditorFile;
  language: string;
  viewState: editor.IDiffEditorViewState | null;
  onViewStateChange?: (state: editor.IDiffEditorViewState | null) => void;
};

const DiffEditorComponent = ({ leftFile, rightFile, language, viewState, onViewStateChange }: DiffEditorProps) => {
  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const lastAppliedViewStateRef = useRef<editor.IDiffEditorViewState | null>(null);

  const handleMount = (mountedEditor: editor.IStandaloneDiffEditor) => {
    editorRef.current = mountedEditor;
    if (viewState) {
      mountedEditor.restoreViewState(viewState);
      lastAppliedViewStateRef.current = viewState;
    }
    mountedEditor.focus();
    const saveState = () => onViewStateChange?.(mountedEditor.saveViewState());
    mountedEditor.getOriginalEditor().onDidBlurEditorWidget(saveState);
    mountedEditor.getModifiedEditor().onDidBlurEditorWidget(saveState);
  };

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        onViewStateChange?.(editorRef.current.saveViewState());
      }
    };
  }, [onViewStateChange]);

  useEffect(() => {
    if (editorRef.current && viewState && viewState !== lastAppliedViewStateRef.current) {
      editorRef.current.restoreViewState(viewState);
      lastAppliedViewStateRef.current = viewState;
      editorRef.current.focus();
    } else if (editorRef.current && !viewState) {
      lastAppliedViewStateRef.current = null;
    }
  }, [viewState]);

  return (
    <div className="w-full h-full">
      <DiffEditor
        height="100%"
        width="100%"
        original={leftFile.contents}
        modified={rightFile.contents}
        language={language}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          readOnly: false,
          renderSideBySide: true,
          renderIndicators: true,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};

export default DiffEditorComponent;