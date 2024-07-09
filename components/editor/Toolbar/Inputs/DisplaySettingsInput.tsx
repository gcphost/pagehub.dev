import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { ClassNameInput } from "./ClassNameInput";
import { CursorInput } from "./CursorInput";
import { DisplayInput } from "./DisplayInput";
import { GptInput } from "./GptInput";
import { OverflowInput } from "./OverflowInput";

export default () => (
  <>
    <GptInput />
    <ClassNameInput />

    <DisplayInput />

    <ToolbarSection title="Cursor">
      <CursorInput />
    </ToolbarSection>
    <ToolbarSection title="Overflow">
      <OverflowInput />
    </ToolbarSection>
    <ToolbarSection title="ID" help="This can be used for Hover & Click">
      <ToolbarItem
        propKey="id"
        propType="component"
        type="text"
        label="ID"
        placeholder="myComponent"
        labelHide={true}
      />
    </ToolbarSection>
  </>
);
