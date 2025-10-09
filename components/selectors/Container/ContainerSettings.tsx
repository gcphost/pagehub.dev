import { useEditor, useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarSection } from "components/editor/Toolbar";
import {
  TBWrap,
  TableBodyStyleControl,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AccessibilityInput } from "components/editor/Toolbar/Inputs/AccessibilityInput";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import ClickItem from "components/editor/Toolbar/Inputs/ClickItem";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { ContainerTypeInput } from "components/editor/Toolbar/Inputs/ContainerTypeInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { OpacityInput } from "components/editor/Toolbar/Inputs/OpacityInput";
import { OrderInput } from "components/editor/Toolbar/Inputs/OrderInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SizeInput } from "components/editor/Toolbar/Inputs/SizeInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { ToolbarItem } from "components/editor/Toolbar/ToolbarItem";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbAccessible,
  TbBoxPadding,
  TbContainer,
  TbMouse,
  TbPlayerPlay,
} from "react-icons/tb";
import { useRecoilState } from "recoil";
import { autoOpenMenu, useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";

export const ContainerSettings = () => {
  const { id } = useNode();
  const node = useGetNode();
  const props = node.data.props;

  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const [menu, setMenu] = useRecoilState(ToolboxMenu);
  autoOpenMenu(menu, setMenu, id, node);

  const head = [
    {
      title: "Container",
      icon: <TbContainer />,
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

  // Get centralized presets from utils/selectorPresets.ts

  const MainTab = () => {
    // Check if header/footer already exist at root level
    const rootNode = query.node('ROOT').get();
    const rootChildren = rootNode?.data?.nodes || [];

    const hasHeader = rootChildren.some(nodeId => {
      const node = query.node(nodeId).get();
      return node?.data?.props?.type === 'header';
    });

    const hasFooter = rootChildren.some(nodeId => {
      const node = query.node(nodeId).get();
      return node?.data?.props?.type === 'footer';
    });

    const isHeader = props.type === 'header';
    const isFooter = props.type === 'footer';
    const isPage = props.type === 'page';
    const isComponent = props.type === 'component';

    // Only show header/footer options for regular containers or if this IS the header/footer
    const showHeaderOption = !isPage && !isComponent && !isFooter && (!hasHeader || isHeader);
    const showFooterOption = !isPage && !isComponent && !isHeader && (!hasFooter || isFooter);

    return (
      <TabBody>

        <ContainerTypeInput />

        <ToolbarSection title="Presets">
          <ToolbarSection full={2}>
            <PresetInput
              presets={selectorPresets.container.width.items}
              label={selectorPresets.container.width.label}
              type={selectorPresets.container.width.type}
              propKey={selectorPresets.container.width.propKey}
              propType={selectorPresets.container.width.propType}
            />

            <PresetInput
              presets={selectorPresets.container.maxWidth.items}
              label={selectorPresets.container.maxWidth.label}
              type={selectorPresets.container.maxWidth.type}
              propKey={selectorPresets.container.maxWidth.propKey}
              propType={selectorPresets.container.maxWidth.propType}
            />
          </ToolbarSection>
          <PresetInput
            presets={selectorPresets.container.padding.items}
            label={selectorPresets.container.padding.label}
            type={selectorPresets.container.padding.type}
            propKey={selectorPresets.container.padding.propKey}
            propType={selectorPresets.container.padding.propType}
          />
        </ToolbarSection>

        <ToolbarSection
          title="Order"
          help="Change the order of this component, useful to reposition items on mobile."
        >
          <OrderInput />
        </ToolbarSection>

        {props.type === "page" && (
          <ToolbarSection
            title="Page Settings"
          >
            <button
              onClick={() => {
                // Find and trigger the page settings modal
                // We'll dispatch a custom event that the PageSelector can listen to
                const event = new CustomEvent('openPageSettings', { detail: { pageId: id } });
                window.dispatchEvent(event);
              }}
              className="w-full px-4 py-3 btn"
            >
              <span>Edit Page Settings</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Configure page name, URL, SEO, and social media settings.
            </p>
          </ToolbarSection>
        )}

        {(showHeaderOption || showFooterOption) && (
          <ToolbarSection title="Special Container Types">
            {showHeaderOption && (
              <ToolbarItem
                propKey="type"
                propType="component"
                type="toggle"
                option={isHeader ? "This is the Header" : "Make this the Header"}
                on="header"
              />
            )}
            {showFooterOption && (
              <ToolbarItem
                propKey="type"
                propType="component"
                type="toggle"
                option={isFooter ? "This is the Footer" : "Make this the Footer"}
                on="footer"
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Headers and footers are special containers that appear on all pages.
            </p>
          </ToolbarSection>
        )}

      </TabBody>
    );
  };

  const TBBody = () => (
    <TableBodyStyleControl
      query={query}
      actions={actions}
      activeTab={activeTab}
      head={head}
      tab={<MainTab />}
    >
      {activeTab === "Container" && <MainTab />}
      {activeTab === "Appearance" && (
        <TabBody
          jumps={[
            {
              title: "Colors",
              content: <div className="text-sm">Colors</div>,
            },
            {
              title: "Background",
              content: <div className="text-sm">Background</div>,
            },

            {
              title: "Border",
              content: <div className="text-sm">Border</div>,
            },
            {
              title: "Decoration",
              content: <div className="text-sm">Decoration</div>,
            },
          ]}
        >
          <ToolbarSection title="Colors" full={2}>
            <ColorInput
              propKey="color"
              label="Text"
              prefix="text"
              propType="root"
            />

            <ColorInput
              propKey="background"
              label="Background"
              prefix="bg"
              propType="root"
            />
          </ToolbarSection>

          <BackgroundInput><PatternInput /></BackgroundInput>



          <ToolbarSection title="Border">
            <BorderInput />
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

          <ToolbarSection title="Opacity">
            <OpacityInput label="" propKey="opacity" />
          </ToolbarSection>
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
          <p className="p-3">
            Animations are not available for this component.
          </p>
        </TabBody>
      )}

      {activeTab === "Accessibility" && <AccessibilityInput />}
      {activeTab === "Hover & Click" && (
        <TabBody>
          <ClickItem />
          <LinkSettingsInput />

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
