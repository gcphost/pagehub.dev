import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { AnimationsInput } from "components/editor/Toolbar/Inputs/AnimationsInput";
import { BorderInput } from "components/editor/Toolbar/Inputs/BorderInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FileUploadInput } from "components/editor/Toolbar/Inputs/FileUploadInput";
import LinkSettingsInput from "components/editor/Toolbar/Inputs/LinkSettingsInput";
import { ShadowInput } from "components/editor/Toolbar/Inputs/ShadowInput";
import { SizeInput } from "components/editor/Toolbar/Inputs/SizeInput";
import { SpacingInput } from "components/editor/Toolbar/Inputs/SpacingInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbMouse, TbPhoto, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
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
      title: "Style",
      icon: <MdStyle />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const MainTab = () => (
    <TabBody>
      <ToolbarSection>
        <FileUploadInput
          propKey="videoId"
          typeKey="type"
          contentKey="content"
        />
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
          option=" "
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
          <option value="">None</option>
          <option value="eager">eager</option>
          <option value="lazy">lazy</option>
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

          <ToolbarSection title="Border">
            <BorderInput />
          </ToolbarSection>
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
