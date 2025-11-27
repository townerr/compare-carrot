export type EditorFile = {
  path: string;
  name: string;
  contents: string;
};

export type PanelKey = "left" | "right";

export type DirectoryItem = {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  modTime: string;
};

export type DirectoryState = {
  rootPath: string;
  items: DirectoryItem[];
};

export type PanelState = {
  file: EditorFile | null;
  directory: DirectoryState | null;
};

export type EditorTab = {
  id: string;
  title: string;
  panels: Record<PanelKey, PanelState>;
};

const untitledTabName = "Directory";

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tab-${Math.random().toString(36).slice(2)}`;
};

export const createEmptyTab = (): EditorTab => ({
  id: generateId(),
  title: untitledTabName,
  panels: {
    left: { file: null, directory: null },
    right: { file: null, directory: null },
  },
});

export const extractFileName = (filePath: string) => {
  if (!filePath) {
    return untitledTabName;
  }
  const normalized = filePath.replace(/\\+/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || untitledTabName;
};

export const deriveTabTitle = (tab: EditorTab) => {
  const leftName = tab.panels.left.file?.name;
  const rightName = tab.panels.right.file?.name;

  if (leftName) return leftName;
  if (rightName) return rightName;
  return untitledTabName;
};
