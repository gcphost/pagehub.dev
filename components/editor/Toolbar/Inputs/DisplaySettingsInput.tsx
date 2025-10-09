import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { ClassNameInput } from "./ClassNameInput";
import { DisplayInput } from "./DisplayInput";
import { GptInput } from "./GptInput";

export default function DisplaySettingsInput() {
  return (
    <>
      <GptInput />
      <ClassNameInput />

      <DisplayInput />


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
}
