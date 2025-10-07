import { useEditor, useNode } from "@craftjs/core";
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
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { IconDialogInput } from "components/editor/Toolbar/Inputs/IconDialogInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { OpacityInput } from "components/editor/Toolbar/Inputs/OpacityInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { Accord, Wrap } from "components/editor/Toolbar/ToolbarStyle";
import { TabAtom, ViewAtom } from "components/editor/Viewport";
import { changeProp } from "components/editor/Viewport/lib";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbAccessible,
  TbBoxPadding,
  TbMouse,
  TbNavigation,
  TbPlayerPlay,
  TbTrash,
} from "react-icons/tb";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { TailwindStyles } from "utils/tailwind";

export const SelectedNavItemAtom = atom({
  key: "SelectedNavItemAtom",
  default: 0,
});

const NavItemInput = ({ nodeProps, setProp }) => {
  const [accordion, setAccordion] = useRecoilState(SelectedNavItemAtom);

  const navItems = nodeProps.navItems ? [...nodeProps.navItems] : [];

  const saveNavItems = (_navItems) => {
    changeProp({
      setProp,
      propKey: "navItems",
      propType: "component",
      value: _navItems,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border rounded-md border-gray-500">
        {navItems.map((navItem, navKey) => (
          <Accord
            className="border-b p-3 border-gray-500"
            key={navKey}
            prop={navKey}
            accordion={accordion}
            setAccordion={setAccordion}
            title={
              <ToolbarItem
                propKey="navItems"
                propType="component"
                index={navKey}
                propItemKey="text"
                type="text"
                label=""
                placeholder="Enter nav item text"
                labelHide={true}
              />
            }
            buttons={[
              <button
                key="button-1"
                className="text-gray-500"
                aria-label="Delete nav item"
                onClick={(e) => {
                  e.preventDefault();

                  const _navItems = [...navItems];

                  delete _navItems[navKey];

                  saveNavItems(_navItems.filter((_) => _));
                }}
              >
                <TbTrash />
              </button>,
            ]}
          >
            <div className="flex flex-col gap-3">
              <LinkSettingsInput
                propKey="navItems"
                index={navKey}
                showAnchor={false}
                suggestedPageName={navItem.text}
              />

              <ToolbarSection full={2}>
                <IconDialogInput
                  propKey="navItems"
                  propType="component"
                  index={navKey}
                  propItemKey="icon"
                  label="Icon"
                />

                <ToolbarItem
                  propKey="navItems"
                  propType="component"
                  index={navKey}
                  propItemKey="iconOnly"
                  type="checkbox"
                  label="Icon Only"
                  on={true}
                  labelHide
                />
              </ToolbarSection>

              <ToolbarSection full={1}>
                <ToolbarItem
                  propKey="navItems"
                  propType="component"
                  index={navKey}
                  propItemKey="type"
                  type="select"
                  label="Type"
                >
                  <option value="button">Button</option>
                  <option value="submit">Submit</option>
                </ToolbarItem>
              </ToolbarSection>

              <ToolbarSection full={1}>
                <ColorInput
                  propKey="navItems"
                  propType="component"
                  index={navKey}
                  propItemKey="background"
                  label="Background"
                  prefix="bg"
                />
                <ColorInput
                  propKey="navItems"
                  propType="component"
                  index={navKey}
                  propItemKey="color"
                  label="Text"
                  prefix="text"
                />
              </ToolbarSection>
            </div>
          </Accord>
        ))}
      </div>

      <button
        className="btn p-3 w-full"
        onClick={async () => {
          const _navItems = [...navItems];

          // Fetch default icon SVG
          const defaultIconPath = "/icons/fa/solid/star.svg";
          let iconSvg = "";
          try {
            const response = await fetch(defaultIconPath);
            iconSvg = await response.text();
          } catch (error) {
            console.error("Failed to load default icon:", error);
          }

          _navItems.push({
            text: "Nav Item",
            icon: iconSvg,
            iconOnly: false
          });

          setAccordion(navItems.length - 1);

          saveNavItems(_navItems);
        }}
      >
        Add Nav Item
      </button>
    </div>
  );
};

const NavItem = (props) => {
  const view = useRecoilValue(ViewAtom);

  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  return (
    <Wrap props={props} lab="" propKey="navItems">
      <NavItemInput nodeProps={nodeProps} setProp={setProp} />
    </Wrap>
  );
};

export const NavSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

  const head = [
    {
      title: "Navigation",
      icon: <TbNavigation />,
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


      <ToolbarSection title="Mobile Navigation">
        <ToolbarItem
          propKey="enableMobileNav"
          propType="component"
          type="checkbox"
          label="Enable Mobile Navigation"
          on={true}
        />
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
      {activeTab === "Navigation" && <MainTab />}

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

      {activeTab === "Accessibility" && <AccessibilityInput />}

      {activeTab === "Layout" && <SpacingInput />}

      {activeTab === "Hover & Click" && (
        <TabBody>
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
    </TableBodyStyleControl>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );
};
