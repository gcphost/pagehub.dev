import { NodeToolWrapper } from "components/editor/Tools/NodeDialog";
import OpenSettingsDialogNodeTool from "./OpenSettingsDialogNodeTool";

export function TextSettingsNodeTool() {
  return (
    <NodeToolWrapper>
      <OpenSettingsDialogNodeTool />
    </NodeToolWrapper>
  );
}

export default TextSettingsNodeTool;
