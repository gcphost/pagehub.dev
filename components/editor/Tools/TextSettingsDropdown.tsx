import { useTiptapContext } from "components/editor/TiptapContext";
import { ToolbarItem } from "components/editor/Toolbar";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { Tooltip } from "components/layout/Tooltip";
import { textPresets } from "components/selectors/Text/TextSettings";
import { useState } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import { TbAlignCenter, TbAlignLeft, TbChevronDown, TbSettings } from "react-icons/tb";

export function TextSettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { editor: tiptapEditor } = useTiptapContext();

  if (!tiptapEditor) return null;

  return (
    <div className="relative">
      {/* Dropdown Trigger Button */}
      <Tooltip content="Text Settings" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${isOpen ? 'bg-gray-700 text-white' : ''
            }`}
        >
          <TbSettings className="w-4 h-4" />
          <TbChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </Tooltip>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 rounded shadow-lg z-50 p-3 min-w-80">
          <div className="flex flex-col gap-3">
            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 font-medium w-16">Color</label>
              <div className="flex-1 h-8 rounded-md overflow-hidden border border-gray-300">
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
              <label className="text-xs text-gray-700 font-medium w-16">Preset</label>
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
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <label className="text-xs text-gray-700 font-medium w-16">Align</label>
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
        </div>
      )}
    </div>
  );
}

export default TextSettingsDropdown;
