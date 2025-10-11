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
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { IpsumGenerator } from "components/editor/Toolbar/Inputs/IpsumGenerator";
import { OpacityInput } from "components/editor/Toolbar/Inputs/OpacityInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
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
import { selectorPresets } from "utils/selectorPresets";
import { inputTypes } from ".";

export const FormElementSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  // Get the current field type using query instead of useNode
  const selected = query.getEvent("selected").first();
  const fieldType = selected
    ? query.node(selected).get().data.props?.type || ""
    : "";

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

  const MainTab = () => (
    <TabBody>
      <ToolbarSection
        title="Properties"
        help="The placeholder will be displayed when no text is entered. The name is how you identify this input."
      >
        <ToolbarItem
          propKey="placeholder"
          propType="component"
          type="text"
          labelHide={true}
          label="Placeholder"
        />
        <ToolbarItem
          propKey="name"
          propType="component"
          type="text"
          labelHide={true}
          label="Input Name"
        />
        <ToolbarItem
          propKey="type"
          propType="component"
          type="select"
          label="Type"
          labelHide={true}
        >
          {inputTypes.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>
      </ToolbarSection>

      <ToolbarSection title="Presets">
        <PresetGroupRenderer presets={selectorPresets.formElement} />
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

      <ToolbarSection title="Boolean Properties" full={2}>
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

      {[
        "number",
        "range",
        "date",
        "datetime-local",
        "time",
        "month",
        "week",
      ].includes(fieldType) && (
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

      <ToolbarSection title="Auto generate content" subtitle={true}>
        <IpsumGenerator propKey="placeholder" propType="component" />
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
        <TabBody
          jumps={[
            {
              title: "Colors",
              content: <div className="text-xs">Colors</div>,
            },
            {
              title: "Typography",
              content: <div className="text-xs">Typography</div>,
            },
            {
              title: "Background",
              content: <div className="text-xs">Background</div>,
            },

            {
              title: "Border",
              content: <div className="text-xs">Border</div>,
            },
          ]}
        >
          <ToolbarSection title="Colors" full={1} collapsible={false}>
            <ColorInput
              propKey="color"
              label="Text"
              prefix="text"
              propType="root"
              inline
            />

            <ColorInput
              propKey="background"
              label="Background"
              prefix="bg"
              propType="root"
              inline
            />
          </ToolbarSection>

          <FontInput />

          <BackgroundInput />

          <BorderInput />

          <ToolbarSection title="Decoration" collapsible={false}>
            <ShadowInput />
            <OpacityInput label="Opacity" propKey="opacity" />
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
          <ToolbarSection title="Hover">
            <ColorInput
              propKey="color"
              label="Color"
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
