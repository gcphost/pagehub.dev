import { TabBody } from "components/editor/Toolbar/Tab";
import { BiPaint } from "react-icons/bi";

import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { IpsumGenerator } from "components/editor/Toolbar/Inputs/IpsumGenerator";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TypeInput } from "components/editor/Toolbar/Inputs/TypeInput";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BsInputCursorText } from "react-icons/bs";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { inputTypes } from ".";

export const FormElementSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: "Form Input",
      icon: <BsInputCursorText />,
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

  const presets = [];

  const MainTab = () => (
    <TabBody>
      <ToolbarSection
        title="Name & Placeholder"
        help="The placeholder will be displayed when no text is entered. The name is how you identify this input."
      >
        <ToolbarItem
          propKey="placeholder"
          propType="component"
          type="text"
          labelHide={true}
          placeholder="Placeholder"
        />
        <ToolbarItem
          propKey="name"
          propType="component"
          type="text"
          labelHide={true}
          placeholder="Input Name"
        />

        <ToolbarSection title="Auto generate content" subtitle={true}>
          <IpsumGenerator propKey="placeholder" propType="component" />
        </ToolbarSection>
      </ToolbarSection>
      <ToolbarSection
        title="Field Type"
        help="Each type will produce a different input, the most common are text, textarea, and email."
      >
        <ToolbarItem
          propKey="type"
          propType="component"
          type="select"
          label=""
          labelHide={true}
        >
          {inputTypes.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
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
      {activeTab === "Form Input" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>
          <PresetInput presets={presets} />

          <FontInput />
          <ToolbarSection>
            <ColorInput
              propKey="color"
              label="Color"
              prefix="text"
              propType="root"
            />
            <BorderInput />
            <TypeInput />
            <ShadowInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Layout" && <SpacingInput />}

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

      {activeTab === "Hover & Click" && (
        <TabBody>
          <ToolbarSection>
            <ColorInput
              propKey="color"
              label="Color"
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
