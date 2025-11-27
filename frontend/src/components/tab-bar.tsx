import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorTab } from "@/lib/editor";
import { useTheme } from "@/hooks/theme-provider";

type TabBarProps = {
  tabs: EditorTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
};

const TabBar = ({ tabs, activeTabId, onSelect, onAdd, onClose }: TabBarProps) => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center border-b border-border bg-muted/20">
      <div className="flex flex-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm border-r border-border whitespace-nowrap transition-colors",
                isActive ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onSelect(tab.id)}
            >
              <span>{tab.title}</span>
              {tabs.length > 1 && (
                <X
                  className="h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose(tab.id);
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-l border-border pl-2">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="px-2 py-1 text-sm bg-transparent border border-border rounded text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          aria-label="Select theme"
        >
          {themes.map((t) => (
            <option key={t.name} value={t.name}>
              {t.displayName}
            </option>
          ))}
        </select>
      </div>
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4" />
        New Tab
      </button>
    </div>
  );
};

export default TabBar;
