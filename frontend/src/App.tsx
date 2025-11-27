import { useCallback, useMemo, useState } from "react";
import Panel from "@/components/panel";
import DiffEditorComponent from "@/components/diff-editor";
import TabBar from "@/components/tab-bar";
import MenuBar from "@/components/menu-bar";
import {
  createEmptyTab,
  deriveTabTitle,
  type EditorFile,
  type EditorTab,
  type PanelKey,
  type DirectoryState,
} from "@/lib/editor";
import { detectLanguageFromPath } from "@/lib/language";
import { compareDirectories, type ComparisonResult } from "@/lib/comparison";

function App() {
  const initialTab = useMemo(() => createEmptyTab(), []);
  const [tabs, setTabs] = useState<EditorTab[]>([initialTab]);
  const [activeTabId, setActiveTabId] = useState<string>(initialTab.id);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  const compareMode =
    Boolean(activeTab?.panels.left.file) && Boolean(activeTab?.panels.right.file);

  const comparisonResults = useMemo<ComparisonResult[]>(() => {
    const leftDir = activeTab?.panels.left.directory;
    const rightDir = activeTab?.panels.right.directory;
    if (leftDir || rightDir) {
      return compareDirectories(leftDir ?? null, rightDir ?? null);
    }
    return [];
  }, [activeTab?.panels.left.directory, activeTab?.panels.right.directory]);

  const updateActiveTab = useCallback(
    (updater: (tab: EditorTab) => EditorTab) => {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const updated = updater(tab);
          return { ...updated, title: deriveTabTitle(updated) };
        })
      );
    },
    [activeTabId]
  );

  const handleFileSelect = useCallback(
    (panel: PanelKey, file: EditorFile) => {
      updateActiveTab((tab) => ({
        ...tab,
        panels: {
          ...tab.panels,
          [panel]: {
            file,
            directory: null,
          },
        },
      }));
    },
    [updateActiveTab]
  );

  const handleDirectorySelect = useCallback(
    (panel: PanelKey, directory: DirectoryState) => {
      updateActiveTab((tab) => ({
        ...tab,
        panels: {
          ...tab.panels,
          [panel]: {
            file: null,
            directory,
          },
        },
      }));
    },
    [updateActiveTab]
  );

  const handleFileOpenFromDirectory = useCallback(
    (file: EditorFile, otherPanelFile?: EditorFile, fromPanel?: "left" | "right") => {
      const newTab = createEmptyTab();
      
      if (otherPanelFile && fromPanel) {
        // Place files on the correct sides based on which panel they came from
        if (fromPanel === "left") {
          newTab.panels.left = { file, directory: null };
          newTab.panels.right = { file: otherPanelFile, directory: null };
        } else {
          newTab.panels.left = { file: otherPanelFile, directory: null };
          newTab.panels.right = { file, directory: null };
        }
        newTab.title = file.name;
      } else {
        // Single file - place it on the side it came from, or default to left
        if (fromPanel === "right") {
          newTab.panels.right = { file, directory: null };
        } else {
          newTab.panels.left = { file, directory: null };
        }
        newTab.title = file.name;
      }

      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    },
    []
  );

  const handleAddTab = useCallback(() => {
    const newTab = createEmptyTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        if (prev.length === 1) {
          const replacement = createEmptyTab();
          setActiveTabId(replacement.id);
          return [replacement];
        }
        const filtered = prev.filter((tab) => tab.id !== id);
        if (id === activeTabId && filtered.length > 0) {
          const closedIndex = prev.findIndex((tab) => tab.id === id);
          const fallback = filtered[Math.max(0, closedIndex - 1)];
          setActiveTabId(fallback.id);
        }
        return filtered;
      });
    },
    [activeTabId]
  );

  if (!activeTab) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <MenuBar />
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onAdd={handleAddTab}
        onSelect={handleSelectTab}
        onClose={handleCloseTab}
      />
      <div className="flex-1">
        {compareMode ? (
          <DiffEditorComponent
            leftFile={activeTab.panels.left.file!}
            rightFile={activeTab.panels.right.file!}
            language={detectLanguageFromPath(
              activeTab.panels.right.file?.name ?? activeTab.panels.left.file?.name
            )}
          />
        ) : (
          <div className="flex h-full">
            <div className="w-1/2 h-full">
              <Panel
                label="left"
                panelState={activeTab.panels.left}
                otherPanelState={activeTab.panels.right}
                onFileSelect={(file) => handleFileSelect("left", file)}
                onDirectorySelect={(directory) => handleDirectorySelect("left", directory)}
                onFileOpen={handleFileOpenFromDirectory}
                comparisonResults={comparisonResults}
              />
            </div>
            <div className="h-full w-0.5 bg-neutral-300" />
            <div className="w-1/2 h-full">
              <Panel
                label="right"
                panelState={activeTab.panels.right}
                otherPanelState={activeTab.panels.left}
                onFileSelect={(file) => handleFileSelect("right", file)}
                onDirectorySelect={(directory) => handleDirectorySelect("right", directory)}
                onFileOpen={handleFileOpenFromDirectory}
                comparisonResults={comparisonResults}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
