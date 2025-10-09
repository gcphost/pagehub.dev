import { NodeProvider, useEditor, useNode } from "@craftjs/core";
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
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { Accord } from "components/editor/Toolbar/ToolbarStyle";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbAccessible,
  TbBoxPadding,
  TbColorPicker,
  TbEdit,
  TbMouse,
  TbPlayerPlay,
  TbPlus,
  TbTrash,
} from "react-icons/tb";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";

export const SelectedButtonListItemAtom = atom({
  key: "selectedbuttonlistitem",
  default: 0,
});

export const ButtonListSettings = () => {
  const { actions, query } = useEditor();
  const { id } = useNode();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

  // Get child Button nodes (excluding hamburger buttons)
  const { childButtons } = useEditor((_, query) => {
    try {
      const node = query.node(id).get();
      const buttons = node.data.nodes
        .map(childId => {
          try {
            const childNode = query.node(childId).get();

            // Only include actual Button components
            if (childNode.data.name !== 'Button') return null;

            // Exclude hamburger/mobile menu buttons
            const isHamburger = childNode.data.props?.clickValue?.includes('mobile-menu');
            if (isHamburger) return null;

            return {
              id: childId,
              text: childNode.data.props.text || "Button",
              url: childNode.data.props.url || "",
              props: childNode.data.props,
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean); // Remove nulls

      return { childButtons: buttons };
    } catch (e) {
      return { childButtons: [] };
    }
  });

  const head = [
    {
      title: "Button List",
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

  const [accordion, setAccordion] = useRecoilState(SelectedButtonListItemAtom);

  const MainTab = () => (
    <TabBody>
      <div className="flex flex-col gap-6">
        <div className="border rounded-md border-gray-500">
          {childButtons?.map((button, index) => (
            <Accord
              className="border-b p-3 border-gray-500"
              key={button.id}
              prop={index}
              accordion={accordion}
              setAccordion={setAccordion}
              title={
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => {
                    actions.setProp(button.id, (props) => {
                      props.text = e.target.value;
                    });
                  }}
                  className="w-full bg-transparent text-white"
                  placeholder="Button text"
                />
              }
              buttons={[
                <button
                  key="edit"
                  className="text-blue-500 hover:text-blue-400"
                  title="Edit button"
                  onClick={(e) => {
                    e.preventDefault();
                    actions.selectNode(button.id);
                  }}
                >
                  <TbEdit />
                </button>,
                <button
                  key="delete"
                  className="text-red-500 hover:text-red-400"
                  title="Delete button"
                  onClick={(e) => {
                    e.preventDefault();
                    actions.delete(button.id);
                  }}
                >
                  <TbTrash />
                </button>,
              ]}
            >
              <NodeProvider id={button.id}>
                <div className="flex flex-col gap-3">
                  <LinkSettingsInput
                    propKey="url"
                    showAnchor={false}
                    suggestedPageName={button.text}
                  />

                  <ToolbarSection full={2}>
                    <IconDialogInput
                      propKey="icon"
                      propType="component"
                      label="Icon"
                    />

                    <ToolbarItem
                      propKey="iconOnly"
                      propType="component"
                      type="checkbox"
                      label="Icon Only"
                      on={true}
                      labelHide
                    />
                  </ToolbarSection>

                  <ToolbarSection full={1}>
                    <ToolbarItem
                      propKey="iconPosition"
                      propType="component"
                      type="select"
                      label="Icon Position"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </ToolbarItem>
                  </ToolbarSection>

                  <ToolbarSection full={1}>
                    <ToolbarItem
                      propKey="type"
                      propType="component"
                      type="select"
                      label="Type"
                    >
                      <option value="button">Button</option>
                      <option value="submit">Submit</option>
                    </ToolbarItem>
                  </ToolbarSection>
                </div>
              </NodeProvider>
            </Accord>
          ))}
        </div>

        <button
          className="btn p-3 w-full"
          onClick={() => {
            const Button = query.getOptions().resolver.Button;
            if (Button) {
              actions.addNodeTree(
                query.parseReactElement(<Button text="New Button" />).toNodeTree(),
                id
              );
              setAccordion(childButtons.length);
            }
          }}
        >
          <TbPlus className="inline mr-2" /> Add Button
        </button>
      </div>
    </TabBody>
  );

  const TBBody = () => (
    <TableBodyStyleControl
      actions={actions}
      activeTab={activeTab}
      query={query}
      head={head}
      tab={<MainTab />}
    >
      {activeTab === "Button List" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>
          <ToolbarSection title="Layout">
            <ToolbarItem
              propKey="flexDirection"
              type="select"
              label="Direction"
            >
              <option value="flex-row">Horizontal</option>
              <option value="flex-col">Vertical</option>
              <option value="flex-row-reverse">Horizontal Reverse</option>
              <option value="flex-col-reverse">Vertical Reverse</option>
            </ToolbarItem>
            <ToolbarItem
              propKey="alignItems"
              type="select"
              label="Align Items"
            >
              <option value="items-start">Start</option>
              <option value="items-center">Center</option>
              <option value="items-end">End</option>
              <option value="items-stretch">Stretch</option>
            </ToolbarItem>
            <ToolbarItem
              propKey="justifyContent"
              type="select"
              label="Justify Content"
            >
              <option value="justify-start">Start</option>
              <option value="justify-center">Center</option>
              <option value="justify-end">End</option>
              <option value="justify-between">Between</option>
              <option value="justify-around">Around</option>
              <option value="justify-evenly">Evenly</option>
            </ToolbarItem>
            <ToolbarItem
              propKey="gap"
              type="select"
              label="Gap"
            >
              <option value="gap-0">None</option>
              <option value="gap-1">Small</option>
              <option value="gap-2">Medium</option>
              <option value="gap-3">Large</option>
              <option value="gap-4">Extra Large</option>
              <option value="gap-6">2X Large</option>
              <option value="gap-8">3X Large</option>
            </ToolbarItem>
          </ToolbarSection>

          <BackgroundInput><PatternInput /></BackgroundInput>

          <ToolbarSection title="Text">
            <FontInput />
          </ToolbarSection>
          <BorderInput />
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

      {activeTab === "Accessibility" && <AccessibilityInput />}

      {activeTab === "Layout" && <SpacingInput />}

      {activeTab === "Hover & Click" && (
        <TabBody>
          <ClickItem />

          <ToolbarSection title="Hover">
            <ToolbarSection title="Colors">
              <ColorInput
                propKey="background"
                label="Background"
                prefix="bg"
                index="hover"
                propType="component"
                inline
              />

              <ColorInput
                propKey="color"
                label="Text"
                prefix="text"
                propType="component"
                index="hover"
                inline
              />

              <ColorInput
                propKey="borderColor"
                label="Border"
                prefix="border"
                propType="root"
                index="hover"
                inline
              />
            </ToolbarSection>

            <ToolbarSection title="Opacity">
              <OpacityInput label="" propKey="opacity" index="hover" />
            </ToolbarSection>
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
