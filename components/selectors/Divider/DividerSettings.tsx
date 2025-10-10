import { useEditor, useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarSection } from "components/editor/Toolbar";
import { NoSettings } from "components/editor/Toolbar/Helpers/CloneHelper";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { HeightInput } from "components/editor/Toolbar/Inputs/HeightInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { RadiusInput } from "components/editor/Toolbar/Inputs/RadiusInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { WidthInput } from "components/editor/Toolbar/Inputs/WidthInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbLine, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";

export const DividerSettings = () => {
  const { id } = useNode();
  const propValues = useGetNode().data.props;

  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

  const head = [
    {
      title: "Divider",
      icon: <TbLine />,
    },
    {
      title: "Appearance",
      icon: <BiPaint />,
    },
    {
      title: "Layout",
      icon: <TbBoxPadding />,
    },
    {
      title: "Hover & Click",
      icon: <TbMouse />,
    },
    {
      title: "Animations",
      icon: <TbPlayerPlay />,
    },
    {
      title: "Style",
      icon: <MdStyle />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const MainTab = () => {
    if (propValues.relationType === "style") {
      return (
        <TabBody>
          <ToolbarSection>
            <NoSettings query={query} actions={actions} id={id} />
          </ToolbarSection>
        </TabBody>
      );
    }

    return (
      <TabBody>
        <ToolbarSection title="Divider Presets">
          <PresetGroupRenderer presets={selectorPresets.divider} />
        </ToolbarSection>

        <ToolbarSection full={1} title="Size">
          <WidthInput />
          <HeightInput />
        </ToolbarSection>


        <ToolbarSection full={1} title="Colors">
          <ColorInput
            propKey="background"
            label="Background"
            prefix="bg"
            propType="root"
          />
        </ToolbarSection>
      </TabBody>
    );
  };

  const TBBody = () => (
    <TableBodyStyleControl
      query={query}
      actions={actions}
      activeTab={activeTab}
      head={head}
      tab={<MainTab />}
    >
      {activeTab === "Divider" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>
          <ToolbarSection>
            <RadiusInput />
            <ShadowInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Style" && (
        <TabBody>
          <DisplaySettingsInput />
        </TabBody>
      )}

      {activeTab === "Layout" && (
        <TabBody>
          <MarginInput />
          <PaddingInput />
        </TabBody>
      )}

      {activeTab === "Animations" && (
        <TabBody>
          <p className="p-3 text-xs text-center">
            Animation settings are not available for this component.
          </p>
        </TabBody>
      )}

      {activeTab === "Hover & Click" && (
        <TabBody>
          <p className="p-3 text-xs text-center">
            Hover settings are not available for this component.
          </p>
        </TabBody>
      )}
    </TableBodyStyleControl>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );
};
