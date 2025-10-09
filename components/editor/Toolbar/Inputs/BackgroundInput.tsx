import { useNode } from "@craftjs/core";
import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { BackgroundSettingsInput } from "./BackgroundSettingsInput";
import { ColorInput } from "./ColorInput";

export const BackgroundInput = ({ children }: { children?: React.ReactNode }) => {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <ToolbarSection title="Background">
      <ToolbarSection title="Image" subtitle={true}>
        <BackgroundSettingsInput props={props} />

        <ToolbarSection title="Gradient" subtitle={true}>
          <ToolbarItem
            propKey={"backgroundGradient"}
            propType="root"
            type="select"
            label={""}
            labelHide={true}
          >
            <option value="">None</option>
            {TailwindStyles.gradients.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>

          {props?.root?.backgroundGradient && (
            <ToolbarSection full={2}>
              <ColorInput
                propKey="backgroundGradientFrom"
                label="From"
                prefix="from"
                propType="root"
              />
              <ColorInput
                propKey="backgroundGradientTo"
                label="To"
                prefix="to"
                propType="root"
              />
            </ToolbarSection>
          )}
        </ToolbarSection>
      </ToolbarSection>

      {children}
    </ToolbarSection>
  );
};
