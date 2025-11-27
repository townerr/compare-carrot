import FileButton from "@/components/file-button"
import FolderButton from "@/components/folder-button"
import GitButton from "@/components/git-button"
import Editor from "@/components/editor"

const Panel = ({
    selectedFile,
    selectedFolder,
    selectedGitRevision,
    setSelectedFile,
    setSelectedFolder,
    setSelectedGitRevision,
}: {
    selectedFile: string | null,
    selectedFolder: string | null,
    selectedGitRevision: string | null,
    setSelectedFile: (file: string) => void,
    setSelectedFolder: (folder: string) => void,
    setSelectedGitRevision: (gitRevision: string) => void
}) => {

    if (selectedFile) {
        return (
            <div className="h-full w-full">
                <Editor file={selectedFile} />
            </div>
        )
    }
    else if (selectedFolder) {}
    else if (selectedGitRevision) {}
    else {
        return (
            <div className="h-full w-full">
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <FileButton setSelectedFile={setSelectedFile} />
                    <FolderButton setSelectedFolder={setSelectedFolder} />
                    <GitButton setSelectedGitRevision={setSelectedGitRevision} />
                </div>
            </div>
        )
    }
}
export default Panel