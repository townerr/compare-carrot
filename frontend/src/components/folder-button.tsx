import { FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const FolderButton = ({ setSelectedFolder }: { setSelectedFolder?: (folder: string) => void }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className="shadow-md hover:shadow-lg transition-shadow active:bg-neutral-200 w-1/3 text-center cursor-pointer"
      onClick={() => setSelectedFolder?.("")}
      disabled
    >
      <FolderIcon className="w-4 h-4" />
      <span>Select Folder</span>
    </Button>
  );
};

export default FolderButton