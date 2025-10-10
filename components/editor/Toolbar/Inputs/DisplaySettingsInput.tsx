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


      <ToolbarSection title="Id Attribute" help="The HTML id attribute is used to specify a unique id for an HTML element.">
        <ToolbarItem
          propKey="id"
          propType="component"
          type="text"
          label="Id"
          placeholder="myComponent"
          labelHide={true}
          description="Assign a unique id to the element. Can be used in Hover & Click settings."
        />
      </ToolbarSection>
    </>
  );
}
