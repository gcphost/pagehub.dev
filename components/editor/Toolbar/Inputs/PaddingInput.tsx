import { useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { TbBoxPadding, TbInfoSquare } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { TailwindStyles } from "utils/tailwind";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";

export const PaddingInput = ({ propKey = "padding" }) => {
  const { propValues } = useNode((node) => ({
    propValue: node.data.props.activeTab,
    propValues: node.data.props,
    activeSettingVa: node.data.props.activeSetting,
    nodeData: node.data,
    id: node.id,
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const view = useRecoilValue(ViewAtom);

  return (
    <>
      <ToolbarSection
        title="Padding"
        full={1}
        help="The space inside this component."
        footer={
          <ItemAdvanceToggle
            propKey={propKey}
            title={
              <>
                <TbBoxPadding /> Top, bottom, left, or right are also available
              </>
            }
          >
            <ToolbarSection full={1}>
              <ToolbarItem
                propKey="pt"
                type="slider"
                label="Top"
                max={TailwindStyles.pt.length - 1}
                min={0}
                valueLabels={TailwindStyles.pt}
                inline
              />
              <ToolbarItem
                propKey="pb"
                type="slider"
                label="Bottom"
                max={TailwindStyles.pb.length - 1}
                min={0}
                valueLabels={TailwindStyles.pb}
                inline
              />
              <ToolbarItem
                propKey="pl"
                type="slider"
                label="Left"
                max={TailwindStyles.pl.length - 1}
                min={0}
                valueLabels={TailwindStyles.pl}
                inline
              />
              <ToolbarItem
                propKey="pr"
                type="slider"
                label="Right"
                max={TailwindStyles.pr.length - 1}
                min={0}
                valueLabels={TailwindStyles.pr}
                inline
              />
            </ToolbarSection>
          </ItemAdvanceToggle>
        }
      >
        <ToolbarItem
          propKey="px"
          type="slider"
          label="Horizontal"
          max={TailwindStyles.px.length - 1}
          min={0}
          valueLabels={TailwindStyles.px}
          showVarSelector={true}
          varSelectorPrefix="px"
          inline
        />

        <ToolbarItem
          propKey="py"
          type="slider"
          label="Vertical"
          max={TailwindStyles.py.length - 1}
          min={0}
          valueLabels={TailwindStyles.py}
          showVarSelector={true}
          varSelectorPrefix="py"
          inline
        />
      </ToolbarSection>

      {view === "mobile" &&
        TailwindStyles.px.indexOf(propValues[view]?.px) >
          TailwindStyles.px.indexOf("px-3") && (
          <ToolbarSection>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <TbInfoSquare /> Padding may be too large for mobile.
            </div>
          </ToolbarSection>
        )}
    </>
  );
};
