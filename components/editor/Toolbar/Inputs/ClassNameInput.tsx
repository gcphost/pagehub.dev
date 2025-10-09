import { ClassItem } from "../Items/ClassItem";
import { ToolbarSection } from "../ToolbarSection";
import { CSSEditorInput } from "./CSSEditorInput";

export const ClassNameInput = () => (
  <>
    <ToolbarSection>
      <ClassItem
        propKey="className"
        type="className"
        propType="component"
        label="Classes"
        labelHide={true}
      />
    </ToolbarSection>

    <CSSEditorInput />

  </>
);
