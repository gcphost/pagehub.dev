import { TabBody } from "components/editor/Toolbar/Tab";
import { BiPaint } from "react-icons/bi";

import { useEditor } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import {
  TableBodyStyleControl,
  TBWrap,
} from "components/editor/Toolbar/Helpers/SettingsHelper";
import { TabAtom } from "components/editor/Viewport";
import { useEffect } from "react";
import { BsInputCursorText } from "react-icons/bs";
import { MdStyle } from "react-icons/md";
import { TbBoxPadding, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";

export const SpacerSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

  const head = [
    {
      title: "Spacer",
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

  const presets = [];

  const MainTab = () => (
    <TabBody>
      <ToolbarSection
        title="Spacer Settings"
        help="Configure the spacing and appearance of the spacer"
      >
        <ToolbarItem
          propKey="height"
          propType="component"
          type="text"
          label="Custom Height"
          labelHide={true}
          placeholder="e.g., 50px, 2rem, 100vh"
        />
        <ToolbarItem
          propKey="width"
          propType="component"
          type="text"
          label="Custom Width"
          labelHide={true}
          placeholder="e.g., 200px, 50%, auto"
        />
      </ToolbarSection>
    </TabBody>
  );

  const TBBody = () => (
    <TableBodyStyleControl
      presets={presets}
      head={head}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      query={query}
      actions={actions}
    >
      <MainTab />
    </TableBodyStyleControl>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );
};
