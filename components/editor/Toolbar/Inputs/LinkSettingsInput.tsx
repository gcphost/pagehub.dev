import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { AnchorInput } from "./AnchorInput";

export default () => (
  <>
    <ToolbarSection
      full={2}
      title="Link"
      help="Provide a valid URL and target for when this component is clicked."
    >
      <ToolbarItem
        propKey="url"
        propType="component"
        type="text"
        labelHide={true}
        placeholder="https://...."
      />

      <ToolbarItem
        propKey="urlTarget"
        propType="component"
        type="select"
        label="Target"
      >
        <option value="_self">Same tab</option>
        <option value="_blank">New tab</option>
        <option value="_parent">Parent window</option>
        <option value="_top">New window</option>
      </ToolbarItem>
    </ToolbarSection>
    <AnchorInput />
  </>
);
