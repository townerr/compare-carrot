import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import SettingsModal from "@/components/settings-modal";

const MenuBar = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Menubar className="rounded-none border-b border-x-0 border-t-0">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open File</MenubarItem>
            <MenubarItem>Open Folder</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save</MenubarItem>
            <MenubarItem>Save As...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Compare</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Compare Files</MenubarItem>
            <MenubarItem>Compare Folders</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Compare with Git</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Options</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => setSettingsOpen(true)}>
              Settings...
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default MenuBar;

