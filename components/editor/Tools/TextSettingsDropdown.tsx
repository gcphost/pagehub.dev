import { useTiptapContext } from "components/editor/TiptapContext";
import { ToolbarItem } from "components/editor/Toolbar";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { textPresets } from "components/selectors/Text/TextSettings";
import { useState } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import { TbAlignCenter, TbAlignLeft } from "react-icons/tb";

export function TextSettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { editor: tiptapEditor } = useTiptapContext();

  if (!tiptapEditor) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium w-16">Color</label>
        <div className="flex-1 h-8 rounded-md overflow-hidden border border-border">
          <ColorInput
            propKey="color"
            label=""
            prefix="text"
            propType="root"
            labelHide={true}
          />
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium w-16">Preset</label>
        <div className="flex-1">
          <PresetInput
            presets={textPresets}
            type="select"
            label=""
            labelHide={true}
            wrap="control"
          />
        </div>
      </div>


      {/* Text Alignment */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <label className="text-xs font-medium w-16">Align</label>
        <div className="flex-1">
          <ToolbarItem
            propKey="textAlign"
            type="radio"
            label=""
            labelHide={true}
            cols={true}
            wrap="control"
            options={[
              { value: "text-left", label: <TbAlignLeft /> },
              { value: "text-center", label: <TbAlignCenter /> },
              { value: "text-right", label: <AiOutlineAlignRight /> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default TextSettingsDropdown;
