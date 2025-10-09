import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AccessibilityInput } from "components/editor/Toolbar/Inputs/AccessibilityInput";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import ClickItem from "components/editor/Toolbar/Inputs/ClickItem";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { IconDialogInput } from "components/editor/Toolbar/Inputs/IconDialogInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { OpacityInput } from "components/editor/Toolbar/Inputs/OpacityInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbAccessible,
  TbBoxPadding,
  TbColorPicker,
  TbMouse,
  TbPlayerPlay,
} from "react-icons/tb";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";
import { TailwindStyles } from "utils/tailwind";

export const SelectedButtonAtom = atom({
  key: "selectedbutton",
  default: 0,
});

export const ButtonSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

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
      title: "Accessibility",
      icon: <TbAccessible />,
    },
    {
      title: "Style",
      icon: <MdStyle />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const MainTab = () => (
    <TabBody>
      <ToolbarSection title="Button Content">
        <ToolbarItem
          propKey="text"
          type="text"
          label="Text"
          propType="component"
        />
      </ToolbarSection>

      <ToolbarSection title="Button Presets">
        <PresetGroupRenderer presets={selectorPresets.button} />
      </ToolbarSection>

      <LinkSettingsInput
        propKey="url"
        showAnchor={false}
      />

      <ToolbarSection title="Button Type">
        <ToolbarItem
          propKey="type"
          type="select"
          label="Type"
          propType="component"
        >
          <option value="button">Button</option>
          <option value="submit">Submit</option>
        </ToolbarItem>
      </ToolbarSection>

      <ToolbarSection title="Icon" full={2}>
        <IconDialogInput
          propKey="icon"
          propType="component"
          label="Icon"
        />
        <ToolbarItem
          propKey="iconOnly"
          type="checkbox"
          label="Icon Only"
          propType="component"
          on={true}
          labelHide
        />
      </ToolbarSection>

      <ToolbarSection title="Icon Settings">
        <ToolbarItem
          propKey="iconPosition"
          type="select"
          label="Icon Position"
          propType="component"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </ToolbarItem>
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

          <ToolbarSection title="Colors">
            <ColorInput
              propKey="background"
              label="Background"
              prefix="bg"
              index="hover"
              propType="component"
            />

            <ColorInput
              propKey="color"
              label="Text"
              prefix="text"
              index="hover"
              propType="component"
            />

            <ColorInput
              propKey="borderColor"
              label="Border"
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

      {activeTab === "Accessibility" && <AccessibilityInput />}
    </TableBodyStyleControl>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );
};
