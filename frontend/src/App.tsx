import { useCallback, useMemo, useState } from "react";
import Panel from "@/components/panel";
import DiffEditorComponent from "@/components/diff-editor";
import TabBar from "@/components/tab-bar";
import {
  createEmptyTab,
  deriveTabTitle,
  type EditorFile,
  type EditorTab,
  type PanelKey,
} from "@/lib/editor";
import { detectLanguageFromPath } from "@/lib/language";

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
        diffViewState: null,
        panels: {
          ...tab.panels,
          [panel]: {
            file,
          },
        },
      }));
    },
    [updateActiveTab]
  );

  const handleDiffViewStateChange = useCallback(
    (state: EditorTab["diffViewState"]) => {
      updateActiveTab((tab) => ({
        ...tab,
        diffViewState: state,
      }));
    },
    [updateActiveTab]
  );

  const handleAddTab = useCallback(() => {
    const newTab = createEmptyTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const handleSelectTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

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
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onAdd={handleAddTab}
        onSelect={handleSelectTab}
        onClose={handleCloseTab}
      />
      <div className="flex-1">
        {compareMode && activeTab.panels.left.file && activeTab.panels.right.file ? (
          <DiffEditorComponent
            leftFile={activeTab.panels.left.file}
            rightFile={activeTab.panels.right.file}
            language={detectLanguageFromPath(
              activeTab.panels.right.file?.name ?? activeTab.panels.left.file?.name
            )}
            viewState={activeTab.diffViewState}
            onViewStateChange={handleDiffViewStateChange}
          />
        ) : (
          <div className="flex h-full">
            <div className="w-1/2 h-full">
              <Panel
                label="Left"
                panelState={activeTab.panels.left}
                onFileSelect={(file) => handleFileSelect("left", file)}
              />
            </div>
            <div className="h-full w-0.5 bg-neutral-300" />
            <div className="w-1/2 h-full">
              <Panel
                label="Right"
                panelState={activeTab.panels.right}
                onFileSelect={(file) => handleFileSelect("right", file)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
