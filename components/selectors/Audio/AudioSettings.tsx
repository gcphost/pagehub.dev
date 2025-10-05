import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { RadiusInput } from "components/editor/Toolbar/Inputs/RadiusInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbBoxPadding,
  TbMouse,
  TbMusic,
  TbPlayerPlay,
} from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";

export const AudioSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: "Audio",
      icon: <TbMusic />,
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
      <p className="p-3 text-md">
        Enter the URL of the audio file you&apos;d like to play.
      </p>

      <ToolbarSection title="Audio Source">
        <ToolbarItem
          propKey="audioUrl"
          propType="component"
          type="text"
          label="Audio URL"
          labelHide={true}
          placeholder="https://example.com/audio.mp3"
        />
      </ToolbarSection>

      <ToolbarSection title="Playback Options">
        <ToolbarItem
          propKey="controls"
          propType="component"
          type="checkbox"
          label="Show Controls"
        />

        <ToolbarItem
          propKey="autoplay"
          propType="component"
          type="checkbox"
          label="Autoplay"
        />

        <ToolbarItem
          propKey="loop"
          propType="component"
          type="checkbox"
          label="Loop"
        />
      </ToolbarSection>

      <ToolbarSection title="Accessibility">
        <ToolbarItem
          propKey="title"
          propType="component"
          type="text"
          label="Title"
          placeholder="Audio description"
        />
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
      {activeTab === "Audio" && <MainTab />}

      {activeTab === "Appearance" && (
        <TabBody>
          <ToolbarSection title="Decoration">
            <RadiusInput />
            <ShadowInput />
          </ToolbarSection>
        </TabBody>
      )}

      {activeTab === "Style" && (
        <TabBody>
          <DisplaySettingsInput />
        </TabBody>
      )}

      {activeTab === "Layout" && <SpacingInput />}

      {activeTab === "Animations" && (
        <TabBody>
          <AnimationsInput />
        </TabBody>
      )}

      {activeTab === "Hover & Click" && (
        <TabBody>
          <p className="p-3">
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

