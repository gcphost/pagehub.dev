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
import { SelectOptionsItem } from "components/editor/Toolbar/Items/SelectOptionsItem";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
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

  // Get the current field type using query instead of useNode
  const selected = query.getEvent("selected").first();
  const fieldType = selected ? query.node(selected).get().data.props?.type || "" : "";

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

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

      {fieldType === "select" && (
        <ToolbarSection
          title="Select Options"
          help="Manage options for select dropdowns"
        >
          <SelectOptionsItem
            propKey="options"
            propType="component"
            type="custom"
            label="Options"
            labelHide={false}
          />
        </ToolbarSection>
      )}



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

      <ToolbarSection
        title="Field Properties"
        help="Additional properties for form elements"
        full={2}
      >
        <ToolbarItem
          propKey="required"
          propType="component"
          type="checkbox"
          label="Required"
          labelHide={true}
        />
        <ToolbarItem
          propKey="disabled"
          propType="component"
          type="checkbox"
          label="Disabled"
          labelHide={true}
        />
        <ToolbarItem
          propKey="readOnly"
          propType="component"
          type="checkbox"
          label="Read Only"
          labelHide={true}
        />
      </ToolbarSection>

      {fieldType === "textarea" && (
        <ToolbarSection
          title="Textarea Settings"
          help="Settings specific to textarea elements"
        >
          <ToolbarItem
            propKey="rows"
            propType="component"
            type="number"
            label="Rows"
            labelHide={true}
            placeholder="4"
            min={1}
            max={20}
          />
          <ToolbarItem
            propKey="cols"
            propType="component"
            type="number"
            label="Columns"
            labelHide={true}
            placeholder="50"
            min={1}
            max={200}
          />
        </ToolbarSection>
      )}

      {["number", "range", "date", "datetime-local", "time", "month", "week"].includes(fieldType) && (
        <ToolbarSection
          title="Input Settings"
          help="Settings for input elements"
        >
          <ToolbarItem
            propKey="min"
            propType="component"
            type="text"
            label="Min Value"
            labelHide={true}
            placeholder="Minimum value"
          />
          <ToolbarItem
            propKey="max"
            propType="component"
            type="text"
            label="Max Value"
            labelHide={true}
            placeholder="Maximum value"
          />
          <ToolbarItem
            propKey="step"
            propType="component"
            type="text"
            label="Step"
            labelHide={true}
            placeholder="Step value"
          />
          <ToolbarItem
            propKey="pattern"
            propType="component"
            type="text"
            label="Pattern"
            labelHide={true}
            placeholder="Regex pattern"
          />
        </ToolbarSection>
      )}


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
