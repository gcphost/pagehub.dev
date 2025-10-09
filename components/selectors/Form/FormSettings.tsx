import { useEditor, useNode } from "@craftjs/core";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import { ItemAdvanceToggle } from "components/editor/Toolbar/Helpers/ItemSelector";
import {
  TBWrap,
  TableBodyStyleControl,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AccessibilityInput } from "components/editor/Toolbar/Inputs/AccessibilityInput";
import { AlignItemsInput } from "components/editor/Toolbar/Inputs/AlignItemsInput";
import { AnchorInput } from "components/editor/Toolbar/Inputs/AnchorInput";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import { ClassNameInput } from "components/editor/Toolbar/Inputs/ClassNameInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { DisplayInput } from "components/editor/Toolbar/Inputs/DisplayInput";
import { FlexDirectionInput } from "components/editor/Toolbar/Inputs/FlexDirectionInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import { HeightInput } from "components/editor/Toolbar/Inputs/HeightInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { WidthInput } from "components/editor/Toolbar/Inputs/WidthInput";
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

        <ToolbarSection title="Form Presets">
          <PresetGroupRenderer presets={selectorPresets.form} />
        </ToolbarSection>

        <ToolbarSection title="Form Settings" help={help}>
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

        <ItemAdvanceToggle
          propKey="formSettings"
          title={
            <>
              <TbForms /> Additional Form Settings
            </>
          }
        >
          <ToolbarItem
            propKey="view"
            propType="component"
            type="select"
            label="view"
          >
            <option value="">Default</option>
            <option value="loading">loading</option>
            <option value="loaded">loaded</option>
          </ToolbarItem>
        </ItemAdvanceToggle>

        <AnchorInput />
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
          <ToolbarSection full={2} title="Alignment" tabClass={false}>
            <FlexDirectionInput />
            <AlignItemsInput />
          </ToolbarSection>

          <ToolbarSection full={2}>
            <WidthInput />
          </ToolbarSection>

          <ToolbarSection>
            <HeightInput />
          </ToolbarSection>
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

          <ToolbarSection title="Border">
            <BorderInput />
          </ToolbarSection>

          <ToolbarSection title="Decoration">
            <ShadowInput />
          </ToolbarSection>
        </TabBody>
      )}
      {activeTab === "Layout" && (
        <TabBody>
          <FlexInput />

          <MarginInput />
          <PaddingInput />
        </TabBody>
      )}
      {activeTab === "Style" && (
        <>
          <TabBody>
            <ClassNameInput />

            <ToolbarSection title="Display" onClick={() => { }} enabled={true}>
              <DisplayInput />
            </ToolbarSection>
          </TabBody>
        </>
      )}
      {activeTab === "Animations" && (
        <TabBody>
          <ToolbarSection title="Animations">
            <p className="text-sm text-gray-600">Animation settings will be available soon.</p>
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Accessibility" && <AccessibilityInput />}
      {activeTab === "Hover & Click" && (
        <TabBody>
          <ToolbarSection title="Hover & Click">
            <p className="text-sm text-gray-600">Hover and click settings will be available soon.</p>
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
