import { TabBody } from "components/editor/Toolbar/Tab";
import { BiFont, BiPaint } from "react-icons/bi";

import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { IpsumGenerator } from "components/editor/Toolbar/Inputs/IpsumGenerator";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { TypeInput } from "components/editor/Toolbar/Inputs/TypeInput";
import { WidthInput } from "components/editor/Toolbar/Inputs/WidthInput";
import { TabAtom } from "components/editor/Viewport";
import { useEffect, useRef } from "react";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";

export const textPresets = [
  {
    title: "H7",
    var: "h7",
    mobile: {
      fontSize: "text-base",
    },
    desktop: {
      fontSize: "text-xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H6",
    var: "h6",
    mobile: {
      fontSize: "text-lg",
    },
    desktop: {
      fontSize: "text-2xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H5",
    var: "h5",
    mobile: {
      fontSize: "text-xl",
    },
    desktop: {
      fontSize: "text-3xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H4",
    var: "h4",
    mobile: {
      fontSize: "text-2xl",
    },
    desktop: {
      fontSize: "text-4xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H3",
    var: "h3",
    mobile: {
      fontSize: "text-3xl",
    },
    desktop: {
      fontSize: "text-5xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H2",
    var: "h2",
    mobile: {
      fontSize: "text-4xl",
    },
    desktop: {
      fontSize: "text-6xl",
    },
    root: {
      tagName: "h2",
    },
  },
  {
    title: "H1",
    var: "h1",
    mobile: {
      fontSize: "text-5xl",
    },
    desktop: {
      fontSize: "text-7xl",
    },
    root: {
      tagName: "h1",
    },
  },
];

export const TextSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: "Text",
      icon: <BiFont />,
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

  const ref = useRef(null);

  useEffect(() => {
    const time = setTimeout(() => {
      ref?.current?.editor.focus();
      ref?.current?.editor.setSelection(ref?.current?.editor.getLength(), 0);
    }, 100);

    return () => {
      clearTimeout(time);
    };
  }, [ref]);

  const MainTab = () => (
    <TabBody>
      <ToolbarSection>
        <ToolbarItem
          propKey="text"
          propType="component"
          rows={4}
          type="quill"
          labelHide={true}
          placeholder="Enter text"
        />

        <PresetInput presets={textPresets} type="slider" label="Preset Sizes" />

        <IpsumGenerator propKey="text" propType="component" />
      </ToolbarSection>
    </TabBody>
  );

  const TBBody = () => (
    <TableBodyStyleControl
      query={query}
      actions={actions}
      activeTab={activeTab}
      head={head}
      tab={<MainTab />}
    >
      {activeTab === "Text" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody
          jumps={[
            {
              title: "Colors",
              content: <div className="text-sm">Colors</div>,
            },
            {
              title: "Text",
              content: <div className="text-sm">Text</div>,
            },
            {
              title: "Decoration",
              content: <div className="text-sm">Decoration</div>,
            },
          ]}
        >
          <ToolbarSection title="Colors">
            <ColorInput
              propKey="color"
              label="Color"
              prefix="text"
              propType="root"
            />
          </ToolbarSection>

          <ToolbarSection title="Text">
            <FontInput />
          </ToolbarSection>
          <ToolbarSection title="Decoration">
            <ShadowInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Layout" && (
        <TabBody
          jumps={[
            {
              title: "Size",
              content: <div className="text-sm">Size</div>,
            },

            {
              title: "Margin",
              content: <div className="text-sm">Margin</div>,
            },
            {
              title: "Padding",
              content: <div className="text-sm">Padding</div>,
            },
          ]}
        >
          <ToolbarSection title="Size">
            <WidthInput />
          </ToolbarSection>

          <ToolbarSection
            title="Max Size"
            subtitle={true}
            help="Maximum width this component can be."
          >
            <WidthInput
              propKey="maxWidth"
              values="maxWidths"
              sliderValues="maxWidths"
              propTag="max-w"
            />
          </ToolbarSection>
          <MarginInput />
          <PaddingInput />
        </TabBody>
      )}

      {activeTab === "Style" && (
        <TabBody>
          <DisplaySettingsInput />

          <ToolbarSection title="Element Type">
            <TypeInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Animations" && (
        <TabBody>
          <AnimationsInput />
        </TabBody>
      )}

      {activeTab === "Hover & Click" && (
        <TabBody>
          <LinkSettingsInput />
          <ToolbarSection title="Color">
            <ColorInput
              propKey="color"
              label="Text Color"
              prefix="text"
              index="hover"
              propType="component"
            />
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
