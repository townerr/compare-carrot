import { useState } from "react";
import { Plus, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditorTab } from "@/lib/editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import SettingsModal from "@/components/settings-modal";

type TabBarProps = {
  tabs: EditorTab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
  showOnlyDifferent: boolean;
  onShowOnlyDifferentChange: (value: boolean) => void;
};

const TabBar = ({ 
  tabs, 
  activeTabId, 
  onSelect, 
  onAdd, 
  onClose,
  showOnlyDifferent,
  onShowOnlyDifferentChange,
}: TabBarProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
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
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4" />
        New Tab
      </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
              Settings...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="flex items-center justify-between gap-4"
            >
              <span>Only show diffs</span>
              <Switch
                checked={showOnlyDifferent}
                onCheckedChange={onShowOnlyDifferentChange}
                onClick={(e) => e.stopPropagation()}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default TabBar;
