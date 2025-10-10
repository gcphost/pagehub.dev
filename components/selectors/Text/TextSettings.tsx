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
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { TypeInput } from "components/editor/Toolbar/Inputs/TypeInput";
import { WidthInput } from "components/editor/Toolbar/Inputs/WidthInput";
import { TabAtom } from "components/editor/Viewport";
import { useEffect, useRef } from "react";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";

// Export for backwards compatibility (array of items)
export const textPresets = selectorPresets.text.sizes.items;


export const TextSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

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
          rows={8}
          type="textarea"
          labelHide={true}
          placeholder="Enter text"
          inline={false}
        />

        {/* Loop over all text presets automatically */}
        <PresetGroupRenderer presets={selectorPresets.text} />

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
              title: "Typography",
              content: <div className="text-sm">Typography</div>,
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
              label="Text"
              prefix="text"
              propType="root"
              inline
            />
          </ToolbarSection>

          <ToolbarSection title="Typography">
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

            <WidthInput
              propKey="maxWidth"
              values="maxWidths"
              sliderValues="maxWidths"
              propTag="max-w"
              label="Max Width"
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
          <ToolbarSection title="Click">
            <LinkSettingsInput />
          </ToolbarSection>

          <ToolbarSection title="Hover">
            <ColorInput
              propKey="color"
              label="Text Color"
              prefix="text"
              index="hover"
              propType="component"
              inline
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
