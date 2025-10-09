import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const ShadowInput = ({
  propKey = "shadow",
  propType = "root",
  label = "Shadow",
  inline = true,
}) => (
  <ToolbarItem
    propKey={propKey}
    propType={propType}
    type="slider"
    label={label}
    max={TailwindStyles.dropShadows.length - 1}
    min={0}
    valueLabels={TailwindStyles.dropShadows}
    showVarSelector={true}
    varSelectorPrefix="shadow"
    inline={inline}
  />
);
