import { useEditor, useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { ToolbarItem, ToolbarSection } from "components/editor/Toolbar";
import { BackgroundInput } from "components/editor/Toolbar/Inputs/BackgroundInput";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FileUploadInput } from "components/editor/Toolbar/Inputs/FileUploadInput";
import { FlexInput } from "components/editor/Toolbar/Inputs/FlexInput";
import { FontInput } from "components/editor/Toolbar/Inputs/FontInput";
import { PaddingInput } from "components/editor/Toolbar/Inputs/PaddingInput";
import { PatternInput } from "components/editor/Toolbar/Inputs/PatternInput";
import { TabBody } from "components/editor/Toolbar/Tab";
import { ToolbarWrapper } from "components/editor/Toolbar/ToolBarWrapper";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import React, { useState } from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import {
  TbBoxPadding,
  TbContainer,
  TbMouse,
  TbPhoto,
  TbPlayerPlay,
  TbRefresh,
} from "react-icons/tb";
import { useRecoilState } from "recoil";
import { getCdnUrl } from "utils/cdn";
import { autoOpenMenu, getPageMedia, syncPageMedia, useDefaultTab } from "utils/lib";

export const BackgroundSettings = () => {
  const { id } = useNode();
  const node = useGetNode();

  const { query, actions } = useEditor();
  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const [mediaList, setMediaList] = useState<any[]>([]);

  const [menu, setMenu] = useRecoilState(ToolboxMenu);
  autoOpenMenu(menu, setMenu, id, node);

  const head = [
    {
      title: "Background",
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
    {
      title: "Media Manager",
      icon: <TbPhoto />,
    },
  ];

  useDefaultTab(head, activeTab, setActiveTab);

  const refreshMediaList = () => {
    const media = getPageMedia(query);
    setMediaList(media);
  };

  const handleSyncMedia = () => {
    const usedIds = syncPageMedia(query, actions);
    refreshMediaList();
    console.log(`Synced media. ${usedIds.length} media items in use.`);
  };

  React.useEffect(() => {
    if (activeTab === "Media Manager") {
      refreshMediaList();
    }
  }, [activeTab]);

  return (
    <React.Fragment>
      <ToolbarWrapper head={head} foot="">
        {activeTab === "Background" && (
          <TabBody>
            <ToolbarSection title="Fav Icon">
              <FileUploadInput
                accept=".ico,.gif,.png"
                propKey="ico"
                typeKey="icoType"
                contentKey="icoContent"
              />
            </ToolbarSection>

            <ToolbarSection title="Custom Code">
              <ToolbarItem
                propKey="header"
                propType="component"
                type="textarea"
                rows={3}
                label="Header"
                placeholder="<style>...</style>
                <script>...</script>"
                labelHide={true}
              />

              <ToolbarItem
                propKey="footer"
                propType="component"
                type="textarea"
                rows={3}
                label="Footer"
                placeholder="<script>...</script>"
                labelHide={true}
              />
            </ToolbarSection>
          </TabBody>
        )}

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
                title: "Text",
                content: <div className="text-sm">Text</div>,
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

            <BackgroundInput />

            <PatternInput />

            <ToolbarSection title="Text">
              <FontInput />
            </ToolbarSection>
          </TabBody>
        )}

        {activeTab === "Style" && (
          <TabBody>
            <DisplaySettingsInput />
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
                title: "Padding",
                content: <div className="text-sm">Padding</div>,
              },
            ]}
          >
            <FlexInput />

            <PaddingInput />
          </TabBody>
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
            <p className="p-3">
              Hover settings are not available for this component.
            </p>
          </TabBody>
        )}

        {activeTab === "Media Manager" && (
          <TabBody>
            <ToolbarSection title="Page Media">
              <div className="text-sm text-gray-600 p-3">
                Track and manage all media uploaded to this page.
              </div>

              <div className="p-3">
                <button
                  onClick={handleSyncMedia}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 w-full justify-center"
                >
                  <TbRefresh /> Sync Media
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  Removes unused media from the list
                </div>
              </div>

              <div className="space-y-2 p-3">
                {mediaList.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">
                    No media uploaded yet
                  </div>
                ) : (
                  mediaList.map((media, idx) => (
                    <div
                      key={media.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      {media.type === "cdn" && (
                        <img
                          src={getCdnUrl(media.id)}
                          alt="Media thumbnail"
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono truncate">
                          {media.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          Type: {media.type}
                        </div>
                        {media.uploadedAt && (
                          <div className="text-xs text-gray-400">
                            {new Date(media.uploadedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 text-xs text-gray-500">
                Total: {mediaList.length} media item{mediaList.length !== 1 ? 's' : ''}
              </div>
            </ToolbarSection>
          </TabBody>
        )}
      </ToolbarWrapper>
    </React.Fragment>
  );
};
