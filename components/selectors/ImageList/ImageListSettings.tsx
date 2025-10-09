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
import DisplaySettingsInput from "components/editor/Toolbar/Inputs/DisplaySettingsInput";
import { FileUploadInput } from "components/editor/Toolbar/Inputs/FileUploadInput";
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
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbTrash,
} from "react-icons/tb";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { useChildNodes } from "../lib";

export const SelectedImageListItemAtom = atom({
  key: "selectedimagelistitem",
  default: 0,
});

export const ImageListSettings = () => {
  const { actions, query } = useEditor();
  const { id } = useNode();

  const [activeTab, setActiveTab] = useRecoilState(TabAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => setMenu({ enabled: false }), [setMenu]);

  // Get child Image nodes
  const { children: childImages } = useChildNodes(id, "Image");

  const head = [
    {
      title: "Image List",
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

  const [accordion, setAccordion] = useRecoilState(SelectedImageListItemAtom);

  const MainTab = () => {
    const {
      actions: { setProp },
      props,
    } = useNode((node) => ({
      props: node.data.props,
    }));

    return (
      <TabBody>
        <div className="flex flex-col gap-6">
          <ToolbarSection title="Gallery Mode">
            <ToolbarItem
              propKey="mode"
              propType="component"
              type="select"
              label="Mode"
            >
              <option value="flex">Flex (Default)</option>
              <option value="grid">Grid</option>
              <option value="carousel">Carousel</option>
              <option value="hero">Hero</option>
              <option value="masonry">Masonry</option>
              <option value="infinite">Infinite Scroll</option>
            </ToolbarItem>
          </ToolbarSection>

          <ToolbarSection title="Display Options">
            <ToolbarItem
              propKey="itemsPerView"
              propType="component"
              type="slider"
              label={`Items Per View: ${props.itemsPerView || 3}`}
              min={1}
              max={6}
              step={1}
            />
          </ToolbarSection>

          <ToolbarSection title="Controls">
            <ToolbarItem
              propKey="showNavigation"
              propType="component"
              type="checkbox"
              label="Show Navigation Arrows"
              labelHide={true}
            />

            <ToolbarItem
              propKey="showDots"
              propType="component"
              type="checkbox"
              label="Show Dots Indicator"
              labelHide={true}
            />
          </ToolbarSection>

          {props.mode === "infinite" ? (
            <>
              <ToolbarSection title="Animation">
                <ToolbarItem
                  propKey="animationEnabled"
                  propType="component"
                  type="checkbox"
                  label="Enable Animation"
                  on="enabled"
                />
                <ToolbarItem
                  propKey="previewInEditor"
                  propType="component"
                  type="checkbox"
                  label="Preview in Editor"
                  on="enabled"
                />
              </ToolbarSection>
              {(props.animationEnabled !== false) && (
                <ToolbarSection title="Scroll Speed">
                  <ToolbarItem
                    propKey="infiniteSpeed"
                    propType="component"
                    type="slider"
                    label={`${props.infiniteSpeed || 30} seconds`}
                    min={5}
                    max={60}
                    step={1}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Time for one complete scroll (lower = faster)
                  </p>
                </ToolbarSection>
              )}
            </>
          ) : (
            <ToolbarSection title="Auto-Scroll">
              <ToolbarItem
                propKey="autoScroll"
                propType="component"
                type="checkbox"
                label="Enable Auto-Scroll"
                labelHide={true}
              />

              {props.autoScroll && (
                <ToolbarItem
                  propKey="autoScrollInterval"
                  propType="component"
                  type="number"
                  label="Interval (ms)"
                  placeholder="3000"
                  min={1000}
                  max={10000}
                  step={500}
                  labelHide={true}
                />
              )}
            </ToolbarSection>
          )}

          <ToolbarSection title="Images">
          </ToolbarSection>
          <div className="border rounded-md border-gray-500">
            {childImages?.map((image, index) => (
              <Accord
                className="border-b p-3 border-gray-500"
                key={image.id}
                prop={index}
                accordion={accordion}
                setAccordion={setAccordion}
                title={
                  <div className="flex items-center gap-2">
                    <TbPhoto />
                    <span>Image {index + 1}</span>
                    {image.props?.src && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">
                        ({image.props.src.split('/').pop()})
                      </span>
                    )}
                  </div>
                }
                buttons={[
                  <button
                    key="edit"
                    className="text-blue-500 hover:text-blue-400"
                    title="Edit image"
                    onClick={(e) => {
                      e.preventDefault();
                      actions.selectNode(image.id);
                    }}
                  >
                    <TbEdit />
                  </button>,
                  <button
                    key="delete"
                    className="text-red-500 hover:text-red-400"
                    title="Delete image"
                    onClick={(e) => {
                      e.preventDefault();
                      actions.delete(image.id);
                    }}
                  >
                    <TbTrash />
                  </button>,
                ]}
              >
                <NodeProvider id={image.id}>
                  <div className="flex flex-col gap-3">
                    <ToolbarSection>
                      <FileUploadInput
                        propKey="videoId"
                        typeKey="type"
                        contentKey="content"
                      />
                    </ToolbarSection>

                    <ToolbarSection full={1}>
                      <ToolbarItem
                        propKey="alt"
                        propType="component"
                        type="text"
                        label="Alt Text"
                        placeholder="Descriptive text for screen readers"
                      />
                    </ToolbarSection>
                  </div>
                </NodeProvider>
              </Accord>
            ))}
          </div>

          <button
            className="btn p-3 w-full"
            onClick={() => {
              const Image = query.getOptions().resolver.Image;
              if (Image) {
                actions.addNodeTree(
                  query.parseReactElement(<Image src="/screenshots/clouds.webp" alt="New image" />).toNodeTree(),
                  id
                );
                setAccordion(childImages.length);
              }
            }}
          >
            <TbPlus className="inline mr-2" /> Add Image
          </button>
        </div>
      </TabBody>
    );
  };

  const TBBody = () => (
    <TableBodyStyleControl
      actions={actions}
      activeTab={activeTab}
      query={query}
      head={head}
      tab={<MainTab />}
    >
      {activeTab === "Image List" && <MainTab />}

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
              <option value="gap-4">Large</option>
              <option value="gap-8">Extra Large</option>
            </ToolbarItem>
          </ToolbarSection>
          <BackgroundInput />
          <BorderInput />
        </TabBody>
      )}

      {activeTab === "Layout" && (
        <TabBody>
          <SpacingInput />
        </TabBody>
      )}

      {activeTab === "Animations" && (
        <TabBody>
          <AnimationsInput />
        </TabBody>
      )}

      {activeTab === "Accessibility" && <AccessibilityInput />}

      {activeTab === "Style" && (
        <TabBody>
          <DisplaySettingsInput />
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

