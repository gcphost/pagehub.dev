import { useEditor } from '@craftjs/core';
import { ToolboxMenu } from 'components/editor/RenderNode';
import { ToolbarItem, ToolbarSection } from 'components/editor/Toolbar';
import {
  TableBodyStyleControl,
  TBWrap,
} from 'components/editor/Toolbar/Helpers/SettingsHelper';
import { AnimationsInput } from 'components/editor/Toolbar/Inputs/AnimationsInput';
import { DisplayInput } from 'components/editor/Toolbar/Inputs/DisplayInput';
import DisplaySettingsInput from 'components/editor/Toolbar/Inputs/DisplaySettingsInput';
import { RadiusInput } from 'components/editor/Toolbar/Inputs/RadiusInput';
import { ShadowInput } from 'components/editor/Toolbar/Inputs/ShadowInput';
import { TabBody } from 'components/editor/Toolbar/Tab';
import { TabAtom } from 'components/editor/Viewport';
import { useEffect } from 'react';
import { BiPaint } from 'react-icons/bi';
import { MdStyle } from 'react-icons/md';
import {
  TbBoxPadding, TbCode, TbMouse, TbPlayerPlay
} from 'react-icons/tb';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useDefaultTab } from 'utils/lib';

export const EmbedSettings = () => {
  const { actions, query } = useEditor();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), []);

  const head = [
    {
      title: 'Embed',
      icon: <TbCode />,
    },
    {
      title: 'Appearance',
      icon: <BiPaint />,
    },
    {
      title: 'Layout',
      icon: <TbBoxPadding />,
    },
    {
      title: 'Hover & Click',
      icon: <TbMouse />,
    },
    {
      title: 'Animations',
      icon: <TbPlayerPlay />,
    },
    {
      title: 'Style',
      icon: <MdStyle />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const MainTab = () => (
    <TabBody>
      <p className="p-3 text-md">
        Paste things like embeded javascript, iframes, and other raw code to
        render in your component.
      </p>

      <ToolbarSection title="">
        <ToolbarItem
          propKey="videoId"
          propType="component"
          type="textarea"
          rows={12}
          labelHide={true}
        />
      </ToolbarSection>

      <p className="p-3 text-md">
        Change the display to hidden for things like analytics and tracking.
      </p>

      <DisplayInput />
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
        {activeTab === 'Embed' && <MainTab />}
        <>
          {activeTab === 'Appearance' && (
            <TabBody>
              <ToolbarSection>
                <RadiusInput />
                <ShadowInput />
              </ToolbarSection>
            </TabBody>
          )}

          {activeTab === 'Style' && (
            <TabBody>
              <DisplaySettingsInput />
            </TabBody>
          )}

          {activeTab === 'Layout' && (
            <TabBody>
              <p className="p-3">
                Spacing is not available for this component.
              </p>
            </TabBody>
          )}

          {activeTab === 'Animations' && (
            <TabBody>
              <AnimationsInput />
            </TabBody>
          )}

          {activeTab === 'Hover & Click' && (
            <TabBody>
              <p className="p-3">
                Hover settings are not available for this component.
              </p>
            </TabBody>
          )}
        </>
      </TableBodyStyleControl>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );
};
