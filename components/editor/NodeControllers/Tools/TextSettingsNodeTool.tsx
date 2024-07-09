import { NodeToolWrapper } from 'components/editor/Tools/NodeDialog';
import { ColorInput } from '../../Toolbar/Inputs/ColorInput';
import { AnimatedTooltipButton } from '../../Tools/AnimatedButton';
import OpenSettingsDialogNodeTool from './OpenSettingsDialogNodeTool';

export function TextSettingsNodeTool() {
  return (
    <NodeToolWrapper>
      <AnimatedTooltipButton
        content="Color"
        placement="bottom"
        className="w-8 h-8 rounded-full overflow-hidden  border-gray-500 border"
      >
        <ColorInput
          propKey="color"
          label=""
          prefix="text"
          propType="root"
          labelHide={true}
        />
      </AnimatedTooltipButton>

      <OpenSettingsDialogNodeTool />
    </NodeToolWrapper>
  );
}

export default TextSettingsNodeTool;
