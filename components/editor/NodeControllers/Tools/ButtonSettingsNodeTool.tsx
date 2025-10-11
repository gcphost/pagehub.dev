import { NodeToolWrapper } from "components/editor/Tools/NodeDialog";
import OpenSettingsDialogNodeTool from "./OpenSettingsDialogNodeTool";

export function ButtonSettingsNodeTool() {
  return (
    <NodeToolWrapper>
      {/* <AnimatedTooltipButton
        content="Color"
        placement="bottom"
        className="w-6 h-6 rounded-md overflow-hidden border-border border-1"
      >
        <ColorInput
          propKey="color"
          label=""
          prefix="text"
          propType="root"
          labelHide={true}
        />
      </AnimatedTooltipButton>

      <AnimatedTooltipButton
        content="Background Color"
        placement="bottom"
        className="w-6 h-6 rounded-md overflow-hidden border-border border-1"
      >
        <ColorInput
          propKey="background"
          label=""
          prefix="bg"
          propType="root"
          labelHide={true}
        />
      </AnimatedTooltipButton>
      */}
      <OpenSettingsDialogNodeTool />
    </NodeToolWrapper>
  );
}

export default ButtonSettingsNodeTool;
