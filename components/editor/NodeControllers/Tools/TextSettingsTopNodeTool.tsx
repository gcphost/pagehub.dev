import { ToolbarItem } from "components/editor/Toolbar";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { NodeToolWrapper } from "components/editor/Tools/NodeDialog";
import { textPresets } from "components/selectors/Text/TextSettings";
import { AiOutlineAlignRight } from "react-icons/ai";
import { TbAlignCenter, TbAlignLeft } from "react-icons/tb";

export function TextSettingsTopNodeTool() {
  return (
    <NodeToolWrapper
      className="bg-primary-500 inside-shadow text-black rounded-md px-3 m-1"
      animate={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
        exit: {
          opacity: 0,

          transition: {
            delay: 0.2,
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
      }}
    >
      <div className="w-16 h-6 rounded-md overflow-hidden border-gray-500 border-1">
        <ColorInput
          propKey="color"
          label=""
          prefix="text"
          propType="root"
          labelHide={true}
        />
      </div>

      <PresetInput
        presets={textPresets}
        type="select"
        label=""
        labelHide={true}
        wrap="control"
      />

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
    </NodeToolWrapper>
  );
}

export default TextSettingsTopNodeTool;
