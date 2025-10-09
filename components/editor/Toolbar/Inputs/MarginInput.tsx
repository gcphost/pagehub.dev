import { TbBoxPadding } from "react-icons/tb";
import { TailwindStyles } from "utils/tailwind";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";

export const MarginInput = ({ propKey = "margin" }) => (
  <>
    <ToolbarSection
      title="Margin"
      full={2}
      help="The space around this component."
      footer={<ItemAdvanceToggle
        propKey={propKey}
        title={
          <>
            <TbBoxPadding /> Top, bottom, left, or right are also available
          </>
        }
      >
        <ToolbarSection full={2}>
          <ToolbarItem
            propKey="mt"
            type="slider"
            label="Top"
            max={TailwindStyles.mt.length - 1}
            min={0}
            valueLabels={TailwindStyles.mt}
            showVarSelector={true}
            varSelectorPrefix="mt"
          />
          <ToolbarItem
            propKey="mb"
            type="slider"
            label="Bottom"
            max={TailwindStyles.mb.length - 1}
            min={0}
            valueLabels={TailwindStyles.mb}
            showVarSelector={true}
            varSelectorPrefix="mb"
          />
          <ToolbarItem
            propKey="ml"
            type="slider"
            label="Left"
            max={TailwindStyles.ml.length - 1}
            min={0}
            valueLabels={TailwindStyles.ml}
            showVarSelector={true}
            varSelectorPrefix="ml"
          />
          <ToolbarItem
            propKey="mr"
            type="slider"
            label="Right"
            max={TailwindStyles.mr.length - 1}
            min={0}
            valueLabels={TailwindStyles.mr}
            showVarSelector={true}
            varSelectorPrefix="mr"
          />
        </ToolbarSection>
      </ItemAdvanceToggle>}
    >
      <ToolbarItem
        propKey="mx"
        type="slider"
        label="Horizontal"
        max={TailwindStyles.mx.length - 1}
        min={0}
        valueLabels={TailwindStyles.mx}
        showVarSelector={true}
        varSelectorPrefix="mx"
      />

      <ToolbarItem
        propKey="my"
        type="slider"
        label="Vertical"
        max={TailwindStyles.my.length - 1}
        min={0}
        valueLabels={TailwindStyles.my}
        showVarSelector={true}
        varSelectorPrefix="my"
      />




    </ToolbarSection>
  </>
);
