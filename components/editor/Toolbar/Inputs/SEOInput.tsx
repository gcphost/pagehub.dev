import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";

const SEOInput = () => (
  <ToolbarSection title="SEO">
    <ToolbarItem
      propKey="pageTitle"
      propType="component"
      type="textarea"
      rows={3}
      label="Title"
      placeholder=""
      labelHide={true}
    />

    <ToolbarItem
      propKey="pageDescription"
      propType="component"
      type="textarea"
      rows={3}
      label="Description"
      placeholder=""
      labelHide={true}
    />
  </ToolbarSection>
);

export default SEOInput;
