import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AccessibilityInput } from "components/editor/Toolbar/Inputs/AccessibilityInput";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { MediaInput } from "components/editor/Toolbar/Inputs/MediaInput";
import { PresetGroupRenderer } from "components/editor/Toolbar/Inputs/PresetRenderer";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SizeInput } from "components/editor/Toolbar/Inputs/SizeInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import { TbAccessible, TbBoxPadding, TbMouse, TbPhoto, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { selectorPresets } from "utils/selectorPresets";
import { TailwindStyles } from "utils/tailwind";

export const ImageSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: "Image",
      icon: <TbPhoto />,
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
      <MediaInput
        propKey="videoId"
        typeKey="type"
        contentKey="content"
      />

      <ToolbarSection title="Image Presets">
        <PresetGroupRenderer presets={selectorPresets.image} />
      </ToolbarSection>

      <SizeInput />

      <ToolbarSection
        full={2}
        title="Loading"
        help="Preload important images, like the first ones on the page. Lazy load images that are below the first page."
      >
        <ToolbarItem
          propKey="priority"
          propType="component"
          type="checkbox"
          option=""
          on="priority"
          cols={true}
          labelHide={true}
          label="Preload"
        />
        <ToolbarItem
          propKey="loading"
          propType="component"
          type="select"
          label="Loading"
        >
          <option value="lazy">lazy</option>
          <option value="eager">eager</option>
        </ToolbarItem>
      </ToolbarSection>
      <ToolbarSection
        full={1}
        title="Fetch Priority"
        help="Set fetch priority for the image. High priority for above-the-fold images, low for less important ones."
      >
        <ToolbarItem
          propKey="fetchPriority"
          propType="component"
          type="select"
          label="Priority"
        >
          <option value="low">Low</option>
          <option value="high">High</option>
          <option value="">Auto</option>
        </ToolbarItem>
      </ToolbarSection>
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
      {activeTab === "Image" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>
          <ToolbarSection full={2}>
            <ToolbarItem propKey="objectFit" type="select" label={"Fit"}>
              <option value="">None</option>
              {TailwindStyles.objectFit.map((_, k) => (
                <option key={k}>{`${_}`}</option>
              ))}
            </ToolbarItem>
            <ToolbarItem
              propKey="objectPosition"
              type="select"
              label={"Position"}
            >
              <option value="">None</option>
              {TailwindStyles.objectPosition.map((_, k) => (
                <option key={k}>{`${_}`}</option>
              ))}
            </ToolbarItem>
          </ToolbarSection>

          <BorderInput />
          <ToolbarSection title="Decoration">
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

      {activeTab === "Accessibility" && <AccessibilityInput />}

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
