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
import { MediaInput } from "components/editor/Toolbar/Inputs/MediaInput";
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
  TbPlayerPlay,
  TbPlus,
  TbTrash
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
      props,
    } = useNode((node) => ({
      props: node.data.props,
    }));

    return (
      <TabBody>
        <div className="flex flex-col gap-6">
          <div className="border rounded-md border-gray-900 overflow-hidden">
            {childImages?.map((image, index) => (
              <Accord
                className="border-b border-gray-900 group"
                key={image.id}
                prop={index}
                accordion={accordion}
                setAccordion={setAccordion}
                title={
                  <input
                    type="text"
                    value={image.props?.alt || `Image ${index + 1}`}
                    data-image-index={index}
                    onChange={(e) => {
                      actions.setProp(image.id, (props) => {
                        props.alt = e.target.value;
                      });
                    }}
                    onClick={(e) => {
                      // If accordion is closed, let it expand and then focus the input
                      if (accordion !== index) {
                        // Let the accordion expand first, then focus after a short delay
                        setTimeout(() => {
                          const input = document.querySelector(`input[data-image-index="${index}"]`) as HTMLInputElement;
                          if (input) {
                            input.focus();
                          }
                        }, 50);
                      } else {
                        // If already open, just focus
                        e.stopPropagation();
                      }
                    }}
                    onFocus={(e) => {
                      // Only prevent accordion toggle if this accordion is already open
                      if (accordion === index) {
                        e.stopPropagation();
                      }
                    }}
                    className="w-full bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-gray-800 px-2 py-1 rounded"
                    placeholder="Image alt text"
                  />
                }
                buttons={[
                  <button
                    key="edit"
                    className="text-white hover:text-blue-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
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
                    className="text-white hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center"
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
                  <div className="flex flex-col gap-3 bg-primary-700 p-3">
                    <MediaInput
                      propKey="videoId"
                      typeKey="type"
                      title="Image"
                    />
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
                  query.parseReactElement(<Image alt="New image" />).toNodeTree(),
                  id
                );
                setAccordion(childImages.length);
              }
            }}
          >
            <TbPlus className="inline mr-2" /> Add Image
          </button>
        </div>

        <ToolbarSection title="Properties">
          <ToolbarItem
            propKey="mode"
            propType="component"
            type="select"
            label="Mode"
            labelWidth="w-24"

          >
            <option value="flex">Flex (Default)</option>
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="hero">Hero</option>
            <option value="masonry">Masonry</option>
            <option value="infinite">Infinite Scroll</option>
          </ToolbarItem>

          <ToolbarItem
            propKey="itemsPerView"
            propType="component"
            type="slider"
            label={`Items Per View`}
            min={1}
            max={6}
            step={1}
            labelWidth="w-24"
          />
        </ToolbarSection>

        <ToolbarSection title="Controls" full={1}>
          <ToolbarItem
            propKey="showNavigation"
            propType="component"
            type="checkbox"
            label="Show Navigation Arrows"
            labelHide={true}
            inline
            labelWidth="w-full"
            on="enabled"

          />

          <ToolbarItem
            propKey="showDots"
            propType="component"
            type="checkbox"
            label="Show Dots Indicator"
            labelHide={true}
            inline
            labelWidth="w-full"
            on="enabled"


          />
        </ToolbarSection>

        {props?.mode === "infinite" ? (
          <>
            <ToolbarSection title="Animation" full={1}>
              <ToolbarItem
                propKey="animationEnabled"
                propType="component"
                type="checkbox"
                label="Enable Animation"
                on="enabled"
                inline
                labelWidth="w-full"
                labelHide={true}

              />
              <ToolbarItem
                propKey="previewInEditor"
                propType="component"
                type="checkbox"
                label="Preview in Editor"
                on="enabled"
                inline
                labelWidth="w-full"
                labelHide={true}

              />
            </ToolbarSection>
            {(props?.animationEnabled !== false) && (
              <>
                <ToolbarSection title="Scroll">
                  <ToolbarItem
                    propKey="infiniteDirection"
                    propType="component"
                    type="select"
                    label="Direction"
                  >
                    <option value="left">Scroll Left ←</option>
                    <option value="right">Scroll Right →</option>
                  </ToolbarItem>

                  <ToolbarItem
                    propKey="infiniteSpeed"
                    propType="component"
                    type="slider"
                    label="Speed"
                    min={5}
                    max={120}
                    step={1}
                    description="Time for one complete scroll (lower = faster)"
                  />

                </ToolbarSection>
              </>
            )}
          </>
        ) : (
          <ToolbarSection title="Auto-Scroll">
            <ToolbarItem
              propKey="autoScroll"
              propType="component"
              type="checkbox"
              label="Enable"
              labelHide={true}
              labelWidth="w-full"
            />

            {props?.autoScroll && (
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

      {activeTab === "Layout" && <SpacingInput />}

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