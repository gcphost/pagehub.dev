import { useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarSection } from "components/editor/Toolbar";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { ToolbarWrapper } from "components/editor/Toolbar/ToolBarWrapper";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import React from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbBoxPadding,
  TbMouse,
  TbPlayerPlay
} from "react-icons/tb";
import { useRecoilState } from "recoil";
import { autoOpenMenu, useDefaultTab } from "utils/lib";

export const BackgroundSettings = () => {
  const { id } = useNode();
  const node = useGetNode();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const [menu, setMenu] = useRecoilState(ToolboxMenu);
  autoOpenMenu(menu, setMenu, id, node);

  const head = [

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

  return (
    <React.Fragment>
      <ToolbarWrapper head={head} foot="">


        {activeTab === "Appearance" && (
          <TabBody
            jumps={[
              {
                title: "Colors",
                content: <div className="text-sm">Colors</div>,
              },
              {
                title: "Background",
                content: <div className="text-sm">Background</div>,
              },
              {
                title: "Text",
                content: <div className="text-sm">Text</div>,
              },
            ]}
          >
            <ToolbarSection title="Colors">
              <ColorInput
                propKey="color"
                label="Text Color"
                prefix="text"
                propType="root"
              />

              <ColorInput
                propKey="background"
                label="Background Color"
                prefix="bg"
                propType="root"
              />
            </ToolbarSection>

            <BackgroundInput />

            <PatternInput />

            <ToolbarSection title="Text">
              <FontInput />
            </ToolbarSection>
          </TabBody>
        )}

        {activeTab === "Style" && (
          <TabBody>
            <DisplaySettingsInput />
          </TabBody>
        )}

        {activeTab === "Layout" && (
          <TabBody
            jumps={[
              {
                title: "Flex",
                content: <div className="text-sm">Flex</div>,
              },

              {
                title: "Padding",
                content: <div className="text-sm">Padding</div>,
              },
            ]}
          >
            <FlexInput />

            <PaddingInput />
          </TabBody>
        )}

        {activeTab === "Animations" && (
          <TabBody>
            <p className="p-3">
              Animations are not available for this component.
            </p>
          </TabBody>
        )}

        {activeTab === "Hover & Click" && (
          <TabBody>
            <p className="p-3">
              Hover settings are not available for this component.
            </p>
          </TabBody>
        )}
      </ToolbarWrapper>
    </React.Fragment>
  );
};
