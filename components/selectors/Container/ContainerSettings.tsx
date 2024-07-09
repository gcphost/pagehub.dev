import { useEditor, useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarSection } from "components/editor/Toolbar";
import {
  TBWrap,
  TableBodyStyleControl,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { BackgroundSettingsInput } from "components/editor/Toolbar/Inputs/BackgroundSettingsInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { ContainerTypeInput } from "components/editor/Toolbar/Inputs/ContainerTypeInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { MarginInput } from "components/editor/Toolbar/Inputs/MarginInput";
import { OrderInput } from "components/editor/Toolbar/Inputs/OrderInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import SEOInput from "components/editor/Toolbar/Inputs/SEOInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SizeInput } from "components/editor/Toolbar/Inputs/SizeInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbBoxPadding,
  TbContainer,
  TbMouse,
  TbPlayerPlay,
} from "react-icons/tb";
import { useRecoilState } from "recoil";
import { autoOpenMenu, useDefaultTab } from "utils/lib";

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
      title: "Style",
      icon: <MdStyle />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const presetPadding = [
    {
      title: "No padding",
      var: "pad-none",
      mobile: {
        px: "",
        py: "",
      },
      desktop: {
        px: "",
        py: "",
      },
    },
    {
      title: "Small Padding",
      var: "pad-sm",
      mobile: {
        px: "px-3",
        py: "py-3",
      },
      desktop: {
        px: "px-5",
        py: "py-5",
      },
    },
    {
      title: "Medium Padding",
      var: "pad-md",
      mobile: {
        px: "px-6",
        py: "py-6",
      },
      desktop: {
        px: "px-12",
        py: "py-12",
      },
    },
    {
      title: "Large Padding",
      var: "pad-lg",
      mobile: {
        px: "px-12",
        py: "py-12",
      },
      desktop: {
        px: "px-24",
        py: "py-24",
      },
    },
    {
      title: "Extra Large Padding",
      var: "pad-xl",
      mobile: {
        px: "px-24",
        py: "py-24",
      },
      desktop: {
        px: "px-48",
        py: "py-48",
      },
    },
  ];

  const presetType = [
    {
      title: "Columns",
      var: "flexDirection",
      mobile: {
        flexDirection: "flex-col",
      },
    },
    {
      title: "Rows",
      var: "flexDirection",
      mobile: {
        flexDirection: "flex-row",
      },
    },
    {
      title: "Reverse Columns",
      var: "flexDirection",
      mobile: {
        flexDirection: "flex-col-reverse",
      },
    },
    {
      title: "Reverse Rows",
      var: "flexDirection",
      mobile: {
        flexDirection: "flex-row-reverse",
      },
    },
  ];

  const presetWidth = [
    {
      title: "Quarter",
      var: "size-1/4",
      mobile: {
        width: "w-3/12",
      },
    },
    {
      title: "Half",
      var: "size-1/2",
      mobile: {
        width: "w-6/12",
      },
    },
    {
      title: "Full",
      var: "size-full",
      mobile: {
        width: "w-full",
      },
    },
  ];

  const presetMaxWidth = [
    {
      title: "Small",
      var: "max-w-screen-lg",
      mobile: {
        maxWidth: "max-w-screen-lg",
      },
    },

    {
      title: "XL",
      var: "max-w-screen-xl",
      mobile: {
        maxWidth: "max-w-screen-xl",
      },
    },
    {
      title: "Double XL",
      var: "max-w-screen-2xl",
      mobile: {
        maxWidth: "max-w-screen-2xl",
      },
    },
    {
      title: "Full",
      var: "max-w-full",
      mobile: {
        maxWidth: "max-w-full",
      },
    },
  ];

  const preset = [
    {
      title: "Image with Overlay",
      var: "image-overlay",
      mobile: {
        backgroundPosition: "bg-center",
        backgroundSize: "bg-cover",
        height: "h-full",
        width: "w-full",
      },
      desktop: {},
      root: {
        backgroundGradient: "bg-gradient-to-br",
        backgroundFrom: "from-[rgba(223,222,228,0)]",
        backgroundTo: "to-[rgba(29,29,29,0.63)]",
      },
    },
  ];

  const MainTab = () => (
    <TabBody>
      {props.type === "imageContainer" && (
        <ToolbarSection
          title="Image Container"
          help="Display an image as a background while also allowing items inside. If you don't need items inside use a Image."
        >
          <BackgroundSettingsInput props={props} />
        </ToolbarSection>
      )}

      {props.type === "heroContainer" && (
        <ToolbarSection
          title="Hero Container"
          help="Display an image as a background while also allowing items inside. If you don't need items inside use a Image."
        >
          Hero type a Hero type b Hero type c...
        </ToolbarSection>
      )}

      <ContainerTypeInput />

      <ToolbarSection title="Presets">
        <ToolbarSection full={2}>
          <PresetInput
            presets={presetWidth}
            label="Preset Width"
            type="slider"
          />

          <PresetInput
            presets={presetMaxWidth}
            propKey="presetMaxWidth"
            label="Preset Max Width"
            type="slider"
          />
        </ToolbarSection>
        <PresetInput
          presets={presetPadding}
          propKey="presetPadding"
          label="Preset Padding"
          type="slider"
        />
      </ToolbarSection>

      <ToolbarSection
        title="Order"
        help="Change the order of this component, useful to reposition items on mobile."
      >
        <OrderInput />
      </ToolbarSection>

      {props.type === "page" && <SEOInput />}
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
              label="Text Color"
              prefix="text"
              propType="root"
              labelHide={true}
            />

            <ToolbarSection>
              <ColorInput
                propKey="background"
                label="Background Color"
                prefix="bg"
                propType="root"
                labelHide={true}
              />
            </ToolbarSection>
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
          <p className="p-3">
            Animations are not available for this component.
          </p>
        </TabBody>
      )}
      {activeTab === "Hover & Click" && (
        <TabBody>
          <LinkSettingsInput />
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
