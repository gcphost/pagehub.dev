import { useNode } from "@craftjs/core";
import { TailwindStyles } from "utils/tailwind";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { BackgroundSettingsInput } from "./BackgroundSettingsInput";
import { ColorInput } from "./ColorInput";

export const BackgroundInput = ({ children }: { children?: React.ReactNode }) => {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <ToolbarSection title="Background" bodyClassName="px-3" footer={<ItemAdvanceToggle propKey="background">
      <ToolbarSection full={1} bodyClassName="px-3">
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


        </ToolbarSection>
        {props?.root?.backgroundGradient && (
          <ToolbarSection full={1}>
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


        {children}
      </ToolbarSection>
    </ItemAdvanceToggle>}>

      <BackgroundSettingsInput props={props} />


    </ToolbarSection>
  );
};
