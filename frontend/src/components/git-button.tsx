import { GitCompareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const GitButton = ({ setSelectedGitRevision }: { setSelectedGitRevision?: (gitRevision: string) => void }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      className="shadow-md hover:shadow-lg transition-shadow active:bg-neutral-200 w-1/3 text-center cursor-pointer"
      onClick={() => setSelectedGitRevision?.("")}
      disabled
    >
      <GitCompareIcon className="w-4 h-4" />
      <span>Select Git Revision</span>
    </Button>
  );
};

export default GitButton