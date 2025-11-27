import { FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpenDirectoryDialog, ListDirectory } from "../../wailsjs/go/main/App";
import type { DirectoryState } from "@/lib/editor";

type FolderButtonProps = {
  setSelectedFolder: (directory: DirectoryState) => void;
};

const FolderButton = ({ setSelectedFolder }: FolderButtonProps) => {
  const handleOpenDirectory = async () => {
    try {
      const dirPath = await OpenDirectoryDialog();
      if (dirPath && dirPath.length > 0) {
        try {
          const items = await ListDirectory(dirPath);
          const directory: DirectoryState = {
            rootPath: dirPath,
            items,
          };
          setSelectedFolder(directory);
        } catch (error) {
          console.error("Error listing directory:", error);
        }
      }
    } catch (error) {
      console.error("Error opening directory dialog:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="shadow-md hover:shadow-lg transition-shadow active:bg-neutral-200 w-1/3 text-center cursor-pointer"
      onClick={handleOpenDirectory}
    >
      <FolderIcon className="w-4 h-4" />
      <span>Select Folder</span>
    </Button>
  );
};

export default FolderButton