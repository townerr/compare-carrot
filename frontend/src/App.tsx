import { useEffect, useState } from "react";
import Panel from "@/components/panel";
import DiffEditorComponent from "@/components/diff-editor";

function App() {
    const [selectedFileLeft, setSelectedFileLeft] = useState<string | null>(null);
    const [selectedFileRight, setSelectedFileRight] = useState<string | null>(null);
    const [selectedFolderLeft, setSelectedFolderLeft] = useState<string | null>(null);
    const [selectedFolderRight, setSelectedFolderRight] = useState<string | null>(null);
    const [selectedGitRevisionLeft, setSelectedGitRevisionLeft] = useState<string | null>(null);
    const [selectedGitRevisionRight, setSelectedGitRevisionRight] = useState<string | null>(null);
    const [compareMode, setCompareMode] = useState<boolean>(false);

    useEffect(() => {
        if (selectedFileLeft && selectedFileRight) {
            setCompareMode(true);
        }
        else {
            setCompareMode(false);
        }
    }, [selectedFileLeft, selectedFileRight]);

    if (compareMode && selectedFileLeft && selectedFileRight) {
        return (
            <div className="flex h-screen w-screen">
                <DiffEditorComponent leftFile={selectedFileLeft} rightFile={selectedFileRight} />
            </div>
        );
    }
    else {
        return (
            <div className="flex flex-row h-screen">
                <div className="w-1/2 h-full">
                    <Panel 
                        selectedFile={selectedFileLeft} 
                        selectedFolder={selectedFolderLeft} 
                        selectedGitRevision={selectedGitRevisionLeft}
                        setSelectedFile={setSelectedFileLeft}
                        setSelectedFolder={setSelectedFolderLeft}
                        setSelectedGitRevision={setSelectedGitRevisionLeft}
                    />
                </div>
                <div className="h-full w-0.5 bg-neutral-300"></div>
                <div className="w-1/2 h-full">
                    <Panel 
                        selectedFile={selectedFileRight} 
                        selectedFolder={selectedFolderRight} 
                        selectedGitRevision={selectedGitRevisionRight}
                        setSelectedFile={setSelectedFileRight}
                        setSelectedFolder={setSelectedFolderRight}
                        setSelectedGitRevision={setSelectedGitRevisionRight}
                    />
                </div>
            </div>
        );
    }
}

export default App;
