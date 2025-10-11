import { ClassItem } from "../Items/ClassItem";
import { ToolbarSection } from "../ToolbarSection";
import { CSSEditorInput } from "./CSSEditorInput";

export const ClassNameInput = () => (
  <>
    <ToolbarSection title="Tailwind Classes">
      <ClassItem
        propKey="className"
        type="className"
        propType="component"
        label=""
        labelHide={true}
      />
    </ToolbarSection>

    <CSSEditorInput />
  </>
);
