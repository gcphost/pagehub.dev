import { NodeToolWrapper } from 'components/editor/Tools/NodeDialog';
import OpenSettingsDialogNodeTool from './OpenSettingsDialogNodeTool';

export function ContainerSettingsNodeTool() {
  return (
    <NodeToolWrapper>
      <OpenSettingsDialogNodeTool />
    </NodeToolWrapper>
  );
}

export default ContainerSettingsNodeTool;
