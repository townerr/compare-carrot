import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/theme-provider";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FONT_OPTIONS = [
  "Consolas, 'Courier New', monospace",
  "Monaco, 'Courier New', monospace",
  "'Fira Code', 'Courier New', monospace",
  "'Source Code Pro', 'Courier New', monospace",
  "'JetBrains Mono', 'Courier New', monospace",
  "'Cascadia Code', 'Courier New', monospace",
  "Menlo, 'Courier New', monospace",
  "'Courier New', monospace",
];

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { theme, setTheme, themes, font, setFont, fontSize, setFontSize } = useTheme();
  const [localFontSize, setLocalFontSize] = useState(fontSize.toString());

  const handleFontSizeChange = (value: string) => {
    setLocalFontSize(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 72) {
      setFontSize(numValue);
    }
  };

  const handleFontSizeBlur = () => {
    const numValue = parseInt(localFontSize, 10);
    if (isNaN(numValue) || numValue <= 0) {
      setLocalFontSize(fontSize.toString());
    } else if (numValue > 72) {
      setLocalFontSize("72");
      setFontSize(72);
    } else {
      setFontSize(numValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your editor theme, font, and font size.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.name} value={t.name}>
                    {t.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="font">Font Family</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger id="font">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((fontOption) => (
                  <SelectItem key={fontOption} value={fontOption}>
                    {fontOption.split(",")[0].replace(/['"]/g, "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Input
              id="font-size"
              type="number"
              min="8"
              max="72"
              value={localFontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              onBlur={handleFontSizeBlur}
              placeholder="14"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;

