import { useNode } from "@craftjs/core";
import { TailwindStyles } from "utils/tailwind";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { ColorInput } from "./ColorInput";
import { RadiusInput } from "./RadiusInput";

export const BorderInput = ({ index = "" }) => {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <>
      <ToolbarSection full={1} title="Border" footer={<ItemAdvanceToggle
        propKey="border"

      >
        <ToolbarSection full={1}>
          <ToolbarItem
            propKey="borderStyle"
            propType="root"
            type="select"
            label="Border Style"
            index={index}
            inline
          >
            <option value="">None</option>
            {TailwindStyles.borderStyle.map((_, k) => (
              <option key={_}>{_}</option>
            ))}
          </ToolbarItem>
        </ToolbarSection>

        <ToolbarSection full={4} title="Enable Position">
          <ToolbarItem
            propKey="borderTop"
            propType="root"
            type="checkbox"
            option="Top"
            on="border-t"
            cols={true}
            labelHide={true}
            label=""
            index={index}

          />
          <ToolbarItem
            propKey="borderBottom"
            propType="root"
            type="checkbox"
            option="Bottom"
            on="border-b"
            labelHide={true}
            cols={true}
            label={" "}
            index={index}
          />
          <ToolbarItem
            propKey="borderLeft"
            propType="root"
            type="checkbox"
            option="Left"
            on="border-l"
            labelHide={true}
            cols={true}
            label={" "}
            index={index}
          />
          <ToolbarItem
            propKey="borderRight"
            propType="root"
            type="checkbox"
            option="Right"
            on="border-r"
            labelHide={true}
            cols={true}
            label={" "}
            index={index}
          />
        </ToolbarSection>
      </ItemAdvanceToggle>}>
        <ToolbarItem
          propKey="border"
          propType="root"
          type="slider"
          label="Size"
          index={index}
          max={TailwindStyles.border.length - 1}
          min={0}
          valueLabels={TailwindStyles.border}
          showVarSelector={true}
          inline
        />

        <RadiusInput />


        {props?.root?.border && (
          <>
            <ToolbarSection full={1}>
              <ColorInput
                propKey="borderColor"
                label="Color"
                prefix="border"
                propType="root"
                index={index}
                inline
              />


            </ToolbarSection>


          </>
        )}

      </ToolbarSection>
    </>
  );
};
