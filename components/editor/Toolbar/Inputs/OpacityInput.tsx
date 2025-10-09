import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const OpacityInput = ({
  propKey = "opacity",
  index = null,
  prefix = "",
  labelHide = false,
  label = "Opacity",
  inline = true,
}) => (
  <ToolbarItem
    propKey={propKey}
    type="slider"
    label={label}
    labelHide={labelHide}
    max={TailwindStyles.opacity.length - 1}
    min={0}
    valueLabels={TailwindStyles[propKey]}
    index={index}
    propType="root"
    showVarSelector={true}
    inline={inline}
  />
);
