import { useEditor, useNode } from "@craftjs/core";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import { ItemAdvanceToggle } from "components/editor/Toolbar/Helpers/ItemSelector";
import {
  TBWrap,
  TableBodyStyleControl,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AccessibilityInput } from "components/editor/Toolbar/Inputs/AccessibilityInput";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SizeInput } from "components/editor/Toolbar/Inputs/SizeInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import { useState } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import { TbAccessible, TbBoxPadding, TbForms, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";

export const FormSettings = () => {
  const { actions, query } = useEditor();
  const { id } = useNode();
  const node = useGetNode();
  const props = node.data.props;

  const [formType, setFormType] = useState(props.type);

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const settings = useRecoilValue(SettingsAtom);

  const head = [
    {
      title: "Form",
      icon: <TbForms />,
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

  const MainTab = () => {
    let help = "";

    switch (formType) {
      case "iframe":
        help =
          "Submit your form to a hidden iframe. Define your URL and Methods to submit anywhere.";
        break;
      case "save":
        help =
          "Save your data here, you can view your submissions when they occur.";
        break;
      case "emailSave":
        help =
          "Save your data here and email you upon submission, you can view your submissions here when they occur.";
        break;
    }

    return (
      <TabBody>
        <ToolbarSection title="View State" help="Toggle between form states to design each one">
          <ToolbarItem
            propKey="view"
            propType="component"
            type="select"
            label="Current View"
            labelHide={true}
          >
            <option value="">Default (Form)</option>
            <option value="loading">Loading State</option>
            <option value="loaded">Submitted State</option>
          </ToolbarItem>
        </ToolbarSection>

        <ToolbarSection title="Presets">
          <PresetGroupRenderer presets={selectorPresets.form} />
        </ToolbarSection>

        <ToolbarSection title="Properties" help={help}
          footer={<ItemAdvanceToggle
            propKey="formSettings"
            title={
              <>
                <TbForms /> Additional Settings
              </>
            }
          >
            <ToolbarItem
              propKey="view"
              propType="component"
              type="select"
              label="View"
            >
              <option value="">Default</option>
              <option value="loading">loading</option>
              <option value="loaded">loaded</option>
            </ToolbarItem>
          </ItemAdvanceToggle>}>
          <ToolbarItem
            propKey="formName"
            propType="component"
            type="text"
            label="Form Name"
            placeholder="My Form"
            labelHide={true}
          />
          <ToolbarItem
            propKey="type"
            propType="component"
            type="select"
            label="Type"
            labelHide={true}
            onChange={(p) => {
              setFormType(p);
            }}
          >
            <option value="">None</option>
            <option>iframe</option>
            <option value="save">Save</option>
            <option value="emailSave">Email &amp; Save</option>
          </ToolbarItem>

          <ToolbarItem
            propKey="anchor"
            propType="component"
            type="text"
            labelHide={true}
            placeholder="Anchor Tag"
            inline
            description="Allows you to link to it with #tag"
            label="Anchor Tag"
          />
        </ToolbarSection>

        {formType === "emailSave" && (
          <ToolbarItem
            propKey="mailto"
            propType="component"
            type="text"
            label="Mail to"
            placeholder="you@domain.com"
            labelHide={true}
          />
        )}

        {formType === "iframe" && (
          <>
            <ToolbarItem
              propKey="action"
              propType="component"
              type="text"
              label="Action"
              placeholder="https://...."
              labelHide={true}
            />

            <ToolbarItem
              propKey="method"
              propType="component"
              type="select"
              label="method"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </ToolbarItem>
          </>
        )}



      </TabBody>
    );
  };

  const TBBody = () => (
    <TableBodyStyleControl
      actions={actions}
      activeTab={activeTab}
      head={head}
      query={query}
      tab={<MainTab />}
    >
      {activeTab === "Form" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>




          <ToolbarSection title="Colors">
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


          <BackgroundInput><PatternInput /></BackgroundInput>

          <BorderInput />

          <ToolbarSection title="Decoration">
            <ShadowInput />
          </ToolbarSection>
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
          <FlexInput />

          <SizeInput />

          <MarginInput />

          <PaddingInput />

        </TabBody>
      )}
      {activeTab === "Style" && (
        <>
          <TabBody>
            <DisplaySettingsInput />
          </TabBody>
        </>
      )}
      {activeTab === "Animations" && (
        <TabBody>
          <p className="p-3 text-xs text-center">
            Animation settings are not available for this component.
          </p>
        </TabBody>
      )}

      {activeTab === "Accessibility" && <AccessibilityInput />}
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
