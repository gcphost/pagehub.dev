import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import { ButtonInput } from "components/editor/Toolbar/Inputs/ButtonInput";
import ClickItem from "components/editor/Toolbar/Inputs/ClickItem";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { OpacityInput } from "components/editor/Toolbar/Inputs/OpacityInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbBoxPadding,
  TbColorPicker,
  TbMouse,
  TbPlayerPlay,
} from "react-icons/tb";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { TailwindStyles } from "utils/tailwind";

export const SelectedButtonAtom = atom({
  key: "selectedbutton",
  default: 0,
});

export const ButtonSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: "Button",
      icon: <TbColorPicker />,
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

  const MainTab = () => (
    <TabBody>
      <ToolbarSection>
        <ToolbarItem
          propKey="flexDirection"
          type="select"
          labelHide={true}
          label="Container Type"
          cols={true}
        >
          <option value="">None</option>

          <option value="flex-col">Column</option>
          <option value="flex-row">Row</option>

          <option value="flex-col-reverse">Reverse Column</option>
          <option value="flex-row-reverse">Reverse Row</option>
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection>
        <ButtonInput />
      </ToolbarSection>
    </TabBody>
  );

  const TBBody = () => (
    <TableBodyStyleControl
      actions={actions}
      activeTab={activeTab}
      head={head}
      query={query}
      tab={<MainTab />}
    >
      {activeTab === "Button" && <MainTab />}
      {activeTab === "Appearance" && (
        <TabBody
          jumps={[
            {
              title: "Colors",
              content: <div className="text-sm">Colors</div>,
            },
            {
              title: "Icon",
              content: <div className="text-sm">Icon</div>,
            },
            {
              title: "Background",
              content: <div className="text-sm">Background</div>,
            },
            {
              title: "Text",
              content: <div className="text-sm">Text</div>,
            },
            {
              title: "Border",
              content: <div className="text-sm">Border</div>,
            },
          ]}
        >
          <ToolbarSection title="Colors" full={2}>
            <ColorInput
              propKey="color"
              label="Text Color"
              prefix="text"
              propType="root"
              labelHide={true}
            />

            <ToolbarSection>
              <ColorInput
                propKey="background"
                label="Background Color"
                prefix="bg"
                propType="root"
                labelHide={true}
              />
            </ToolbarSection>
          </ToolbarSection>

          <ToolbarSection title="Icon">
            <ToolbarItem
              propKey="iconPosition"
              propType="component"
              type="select"
              label="Position"
            >
              <option value="">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </ToolbarItem>

            <ToolbarSection full={2}>
              <ToolbarItem
                propKey="iconSize"
                propType="component"
                type="slider"
                label="Size"
                max={TailwindStyles.allWidths.length - 1}
                min={0}
                valueLabels={TailwindStyles.allWidths}
              />

              <ColorInput
                propKey="iconColor"
                propType="component"
                label="Color"
                prefix="text"
              />

              <ShadowInput propKey="iconShadow" propType="component" />

              <ToolbarItem
                propKey="iconGap"
                propType="component"
                type="slider"
                label="Gap"
                max={TailwindStyles.gap.length - 1}
                min={0}
                valueLabels={TailwindStyles.gap}
              />
            </ToolbarSection>
          </ToolbarSection>

          <BackgroundInput />

          <PatternInput />
          <ToolbarSection title="Text">
            <FontInput />
          </ToolbarSection>
          <ToolbarSection title="Border">
            <BorderInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Style" && (
        <TabBody>
          <DisplaySettingsInput />
        </TabBody>
      )}

      {activeTab === "Animations" && (
        <TabBody>
          <AnimationsInput />
        </TabBody>
      )}

      {activeTab === "Layout" && <SpacingInput />}

      {activeTab === "Hover & Click" && (
        <TabBody>
          <ClickItem />

          <ToolbarSection title="Colors" full={2}>
            <ColorInput
              propKey="background"
              label="Background"
              labelHide={true}
              prefix="bg"
              index="hover"
              propType="component"
            />

            <ColorInput
              propKey="color"
              label="Text"
              labelHide={true}
              prefix="text"
              index="hover"
              propType="component"
            />

            <ColorInput
              propKey="borderColor"
              label="Border"
              labelHide={true}
              prefix="border"
              propType="root"
              index="hover"
            />
          </ToolbarSection>

          <ToolbarSection title="Opacity">
            <OpacityInput label="" propKey="opacity" index="hover" />
          </ToolbarSection>
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
