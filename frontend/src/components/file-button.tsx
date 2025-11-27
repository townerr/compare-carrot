import { FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpenFileDialog, ReadFileContents } from "../../wailsjs/go/main/App";
import type { EditorFile } from "@/lib/editor";
import { extractFileName } from "@/lib/editor";

type FileButtonProps = {
  setSelectedFile: (file: EditorFile) => void
  label?: string
}

const FileButton = ({ setSelectedFile, label = "Select File" }: FileButtonProps) => {
  const handleOpenFile = async () => {
    const filePath = await OpenFileDialog();
    if (filePath && filePath.length > 0) {
      try {
        const fileContents = await ReadFileContents(filePath);
        const file: EditorFile = {
          path: filePath,
          name: extractFileName(filePath),
          contents: fileContents,
        };
        setSelectedFile(file);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="shadow-md hover:shadow-lg transition-shadow active:bg-neutral-200 w-1/3 text-center cursor-pointer"
      onClick={handleOpenFile}
    >
      <FileIcon className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};

export default FileButton