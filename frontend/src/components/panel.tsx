import FileButton from "@/components/file-button";
import FolderButton from "@/components/folder-button";
import GitButton from "@/components/git-button";
import Editor from "@/components/editor";
import type { PanelState } from "@/lib/editor";
import { detectLanguageFromPath } from "@/lib/language";

type PanelProps = {
  label: string;
  panelState: PanelState;
  onFileSelect: (file: Exclude<PanelState["file"], null>) => void;
};

const Panel = ({ label, panelState, onFileSelect }: PanelProps) => {
  const selectedFile = panelState.file;

  if (selectedFile) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
          {label}: {selectedFile.name}
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

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-2 items-center justify-center h-full">
        <FileButton setSelectedFile={onFileSelect} label={`Select ${label} File`} />
        <FolderButton setSelectedFolder={() => {}} />
        <GitButton setSelectedGitRevision={() => {}} />
      </div>
    </div>
  );
};
export default Panel;