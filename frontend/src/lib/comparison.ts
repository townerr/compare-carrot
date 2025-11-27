import type { DirectoryItem, DirectoryState } from "./editor";

export type ComparisonStatus = "same" | "different" | "left-only" | "right-only";

export type ComparisonResult = {
  relativePath: string;
  status: ComparisonStatus;
  leftItem?: DirectoryItem;
  rightItem?: DirectoryItem;
};

export const compareDirectories = (
  left: DirectoryState | null,
  right: DirectoryState | null
): ComparisonResult[] => {
  if (!left && !right) return [];
  if (!left) {
    return (right?.items || []).map((item) => ({
      relativePath: getRelativePath(item.path, right?.rootPath ?? ""),
      status: "right-only" as ComparisonStatus,
      rightItem: item,
    }));
  }
  if (!right) {
    return (left.items || []).map((item) => ({
      relativePath: getRelativePath(item.path, left.rootPath),
      status: "left-only" as ComparisonStatus,
      leftItem: item,
    }));
  }

  const leftMap = new Map<string, DirectoryItem>();
  const rightMap = new Map<string, DirectoryItem>();

  for (const item of left.items) {
    const relPath = getRelativePath(item.path, left.rootPath);
    leftMap.set(relPath, item);
  }

  for (const item of right.items) {
    const relPath = getRelativePath(item.path, right.rootPath);
    rightMap.set(relPath, item);
  }

  const allPaths = new Set<string>();
  for (const path of leftMap.keys()) allPaths.add(path);
  for (const path of rightMap.keys()) allPaths.add(path);

  const results: ComparisonResult[] = [];

  for (const relPath of allPaths) {
    const leftItem = leftMap.get(relPath);
    const rightItem = rightMap.get(relPath);

    if (!leftItem) {
      results.push({
        relativePath: relPath,
        status: "right-only",
        rightItem,
      });
    } else if (!rightItem) {
      results.push({
        relativePath: relPath,
        status: "left-only",
        leftItem,
      });
    } else if (leftItem.isDir !== rightItem.isDir) {
      results.push({
        relativePath: relPath,
        status: "different",
        leftItem,
        rightItem,
      });
    } else if (!leftItem.isDir && !rightItem.isDir) {
      if (leftItem.size !== rightItem.size || leftItem.modTime !== rightItem.modTime) {
        results.push({
          relativePath: relPath,
          status: "different",
          leftItem,
          rightItem,
        });
      } else {
        results.push({
          relativePath: relPath,
          status: "same",
          leftItem,
          rightItem,
        });
      }
    } else {
      results.push({
        relativePath: relPath,
        status: "same",
        leftItem,
        rightItem,
      });
    }
  }

  return results;
};

const getRelativePath = (fullPath: string, rootPath: string): string => {
  const normalizedFull = fullPath.replace(/\\/g, "/");
  const normalizedRoot = rootPath.replace(/\\/g, "/");
  
  if (normalizedFull.startsWith(normalizedRoot)) {
    const relative = normalizedFull.slice(normalizedRoot.length).replace(/^\/+/, "");
    return relative || filepath.Base(normalizedFull);
  }
  return filepath.Base(normalizedFull);
};

const filepath = {
  Base: (path: string) => {
    const parts = path.replace(/\\/g, "/").split("/");
    return parts[parts.length - 1] || path;
  },
};

