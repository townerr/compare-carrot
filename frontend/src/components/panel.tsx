import FileButton from "@/components/file-button";
import FolderButton from "@/components/folder-button";
import GitButton from "@/components/git-button";
import Editor from "@/components/editor";
import Directory from "@/components/directory";
import type { PanelState, EditorFile, PanelKey } from "@/lib/editor";
import type { ComparisonResult } from "@/lib/comparison";
import { detectLanguageFromPath } from "@/lib/language";

type PanelProps = {
  label: PanelKey;
  panelState: PanelState;
  otherPanelState?: PanelState;
  onFileSelect: (file: Exclude<PanelState["file"], null>) => void;
  onDirectorySelect: (directory: Exclude<PanelState["directory"], null>) => void;
  onFileOpen: (file: EditorFile, otherPanelFile?: EditorFile, fromPanel?: "left" | "right") => void;
  comparisonResults?: ComparisonResult[];
};

const Panel = ({
  label,
  panelState,
  otherPanelState,
  onFileSelect,
  onDirectorySelect,
  onFileOpen,
  comparisonResults,
}: PanelProps) => {
  const selectedFile = panelState.file;
  const selectedDirectory = panelState.directory;

  if (selectedFile) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
          {selectedFile.path}
        </div>
        <div className="flex-1">
          <Editor
            content={selectedFile.contents}
            language={detectLanguageFromPath(selectedFile.name)}
          />
        </div>
      </div>
    );
  }

  if (selectedDirectory) {
    return (
      <div className="h-full w-full">
        <Directory
          directory={selectedDirectory}
          comparisonResults={comparisonResults}
          onFileOpen={onFileOpen}
          label={label}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full">
        <FileButton setSelectedFile={onFileSelect} label={`Select ${label} File`} />
        <FolderButton setSelectedFolder={onDirectorySelect} />
        <GitButton setSelectedGitRevision={() => {}} />
      </div>
    </div>
  );
};
export default Panel;