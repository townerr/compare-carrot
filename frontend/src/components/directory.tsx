import { useState, useMemo } from "react";
import { FileIcon, FolderIcon, ChevronRight, ChevronDown } from "lucide-react";
import type { DirectoryItem, DirectoryState, EditorFile } from "@/lib/editor";
import type { ComparisonResult } from "@/lib/comparison";
import { ReadFileContents } from "../../wailsjs/go/main/App";
import { extractFileName } from "@/lib/editor";

type DirectoryProps = {
  directory: DirectoryState;
  comparisonResults?: ComparisonResult[];
  onFileOpen: (file: EditorFile, otherPanelFile?: EditorFile, fromPanel?: "left" | "right") => void;
  label: "left" | "right";
  showOnlyDifferent?: boolean;
};

type DirectoryTreeItem = {
  item: DirectoryItem;
  relativePath: string;
  level: number;
  comparison?: ComparisonResult;
};

const Directory = ({ directory, comparisonResults = [], onFileOpen, label, showOnlyDifferent = false }: DirectoryProps) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([directory.rootPath]));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const comparisonMap = useMemo(() => {
    const map = new Map<string, ComparisonResult>();
    for (const result of comparisonResults) {
      map.set(result.relativePath, result);
    }
    return map;
  }, [comparisonResults]);

  const getDirectChildren = (parentRelativePath: string): DirectoryItem[] => {
    return directory.items.filter((item) => {
      const itemRelativePath = getRelativePath(item.path, directory.rootPath);
      const itemParentPath = itemRelativePath.split("/").slice(0, -1).join("/");
      return itemParentPath === parentRelativePath;
    });
  };

  const treeItems = useMemo(() => {
    const rootChildren = getDirectChildren("");
    const dirs: DirectoryItem[] = [];
    const files: DirectoryItem[] = [];

    for (const item of rootChildren) {
      if (item.isDir) {
        dirs.push(item);
      } else {
        files.push(item);
      }
    }

    dirs.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    const tree: DirectoryTreeItem[] = [];
    for (const item of dirs) {
      const relativePath = getRelativePath(item.path, directory.rootPath);
      const comparison = comparisonMap.get(relativePath);
      
      // Filter: if showOnlyDifferent is true, only show directories that have differences
      if (showOnlyDifferent) {
        // For directories, check if they contain any different files
        const hasDifferentFiles = directory.items.some((child) => {
          const childRelativePath = getRelativePath(child.path, directory.rootPath);
          const childComparison = comparisonMap.get(childRelativePath);
          return childComparison && (
            childComparison.status === "different" ||
            childComparison.status === "left-only" ||
            childComparison.status === "right-only"
          );
        });
        if (!hasDifferentFiles) continue;
      }
      
      tree.push({
        item,
        relativePath,
        level: 0,
        comparison,
      });
    }
    for (const item of files) {
      const relativePath = getRelativePath(item.path, directory.rootPath);
      const comparison = comparisonMap.get(relativePath);
      
      // Filter: if showOnlyDifferent is true, only show files that are different
      if (showOnlyDifferent) {
        if (!comparison || (
          comparison.status !== "different" &&
          comparison.status !== "left-only" &&
          comparison.status !== "right-only"
        )) {
          continue;
        }
      }
      
      tree.push({
        item,
        relativePath,
        level: 0,
        comparison,
      });
    }
    return tree;
  }, [directory.items, directory.rootPath, comparisonMap, showOnlyDifferent]);

  const getItemColor = (comparison?: ComparisonResult): string => {
    if (!comparison) return "";
    if (comparison.status === "different") return "text-red-500";
    if (comparison.status === "left-only" && label === "left") return "text-blue-500";
    if (comparison.status === "right-only" && label === "right") return "text-blue-500";
    return "";
  };

  const handleItemClick = (item: DirectoryItem) => {
    if (item.isDir) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.path)) {
        newExpanded.delete(item.path);
      } else {
        newExpanded.add(item.path);
      }
      setExpandedItems(newExpanded);
    }
  };

  const handleFileDoubleClick = async (item: DirectoryItem) => {
    if (item.isDir) return;

    try {
      const contents = await ReadFileContents(item.path);
      const file: EditorFile = {
        path: item.path,
        name: extractFileName(item.path),
        contents,
      };

      const comparison = comparisonMap.get(getRelativePath(item.path, directory.rootPath));
      let otherPanelFile: EditorFile | undefined;

      if (comparison && comparison.status !== "left-only" && comparison.status !== "right-only") {
        const otherItem = label === "left" ? comparison.rightItem : comparison.leftItem;
        if (otherItem && !otherItem.isDir) {
          try {
            const otherContents = await ReadFileContents(otherItem.path);
            otherPanelFile = {
              path: otherItem.path,
              name: extractFileName(otherItem.path),
              contents: otherContents,
            };
          } catch (error) {
            console.error("Error reading other panel file:", error);
          }
        }
      }

      onFileOpen(file, otherPanelFile, label);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const renderTreeItem = (treeItem: DirectoryTreeItem) => {
    const { item, relativePath, level, comparison } = treeItem;
    const isExpanded = expandedItems.has(item.path);
    const colorClass = getItemColor(comparison);
    const indent = level * 16;

    return (
      <div key={item.path}>
        <div
          className={`flex items-center gap-1 px-2 py-1 hover:bg-muted/50 cursor-pointer select-none ${colorClass}`}
          style={{ paddingLeft: `${8 + indent}px` }}
          onClick={() => handleItemClick(item)}
          onDoubleClick={() => handleFileDoubleClick(item)}
        >
          {item.isDir ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <FolderIcon className="h-4 w-4 shrink-0" />
            </>
          ) : (
            <>
              <div className="w-5 shrink-0" />
              <FileIcon className="h-4 w-4 shrink-0" />
            </>
          )}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        {item.isDir && isExpanded && (
          <div>
            {(() => {
              const children = directory.items.filter((child) => {
                const childRelativePath = getRelativePath(child.path, directory.rootPath);
                const childParentPath = childRelativePath.split("/").slice(0, -1).join("/");
                return childParentPath === relativePath;
              });
              
              // Apply filter to children
              let filteredChildren = children;
              if (showOnlyDifferent) {
                filteredChildren = children.filter((child) => {
                  const childRelativePath = getRelativePath(child.path, directory.rootPath);
                  const childComparison = comparisonMap.get(childRelativePath);
                  if (child.isDir) {
                    // For directories, check if they contain any different files
                    return directory.items.some((descendant) => {
                      const descendantRelativePath = getRelativePath(descendant.path, directory.rootPath);
                      const descendantComparison = comparisonMap.get(descendantRelativePath);
                      return descendantRelativePath.startsWith(childRelativePath + "/") &&
                        descendantComparison && (
                          descendantComparison.status === "different" ||
                          descendantComparison.status === "left-only" ||
                          descendantComparison.status === "right-only"
                        );
                    });
                  } else {
                    // For files, check if they are different
                    return childComparison && (
                      childComparison.status === "different" ||
                      childComparison.status === "left-only" ||
                      childComparison.status === "right-only"
                    );
                  }
                });
              }
              
              const dirs = filteredChildren.filter((c) => c.isDir).sort((a, b) => a.name.localeCompare(b.name));
              const files = filteredChildren.filter((c) => !c.isDir).sort((a, b) => a.name.localeCompare(b.name));
              return [...dirs, ...files].map((child) => {
                const childRelativePath = getRelativePath(child.path, directory.rootPath);
                return {
                  item: child,
                  relativePath: childRelativePath,
                  level: level + 1,
                  comparison: comparisonMap.get(childRelativePath),
                };
              }).map((childTreeItem) => renderTreeItem(childTreeItem));
            })()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-auto">
      <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
        {directory.rootPath}
      </div>
      <div className="py-2">
        {treeItems.map((treeItem) => renderTreeItem(treeItem))}
      </div>
    </div>
  );
};

const getRelativePath = (fullPath: string, rootPath: string): string => {
  const normalizedFull = fullPath.replace(/\\/g, "/");
  const normalizedRoot = rootPath.replace(/\\/g, "/");
  
  if (normalizedFull.startsWith(normalizedRoot)) {
    const relative = normalizedFull.slice(normalizedRoot.length).replace(/^\/+/, "");
    return relative || extractFileName(normalizedFull);
  }
  return extractFileName(normalizedFull);
};

export default Directory;

