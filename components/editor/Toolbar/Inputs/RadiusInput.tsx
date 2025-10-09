import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const RadiusInput = () => (
  <ToolbarItem
    propKey="radius"
    propType="root"
    type="slider"
    label="Radius"
    max={TailwindStyles.radius.length - 1}
    min={0}
    valueLabels={TailwindStyles.radius}
    showVarSelector={true}
    varSelectorPrefix="rounded"
  />
);
