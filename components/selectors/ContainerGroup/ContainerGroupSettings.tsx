import { NodeProvider, useEditor, useNode } from "@craftjs/core";
import { TBWrap } from "components/editor/Toolbar/Helpers/SettingsHelper";
import { TabBody } from "components/editor/Toolbar/Tab";
import { Accord } from "components/editor/Toolbar/ToolbarStyle";
import { useGetNode } from "components/editor/Toolbar/Tools/lib";
import { TabAtom } from "components/editor/Viewport";
import React from "react";
import { BiPaint } from "react-icons/bi";
import { MdStyle } from "react-icons/md";
import { TbAccessible, TbBoxPadding, TbContainer, TbMouse, TbPlayerPlay } from "react-icons/tb";
import { atom, useRecoilState } from "recoil";
import { useDefaultTab } from "utils/lib";
import { Button } from "../Button";
import { Container } from "../Container";
import { Image } from "../Image";
import { Text } from "../Text";

interface ContainerGroupSettingsProps { }

export const SelectedContainerGroupAtom = atom({
  key: "selectedcontainergroup",
  default: "",
});

export const SelectedNestedAccordionAtom = atom({
  key: "selectednestedaccordion",
  default: "",
});

export const ContainerGroupSettings: React.FC<ContainerGroupSettingsProps> = () => {

  const { id } = useNode();
  const { query } = useEditor();
  const node = useGetNode();
  const [accordion, setAccordion] = useRecoilState(SelectedContainerGroupAtom);
  const [nestedAccordion, setNestedAccordion] = useRecoilState(SelectedNestedAccordionAtom);

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


  const [activeTab, setActiveTab] = useRecoilState(TabAtom);


  useDefaultTab(head, activeTab, setActiveTab);

  // Get child nodes from the ContainerGroup
  const childNodes = React.useMemo(() => {
    try {
      const nodeData = query.node(id).get();
      return nodeData.data.nodes || [];
    } catch (error) {
      console.warn("Could not get child nodes:", error);
      return [];
    }
  }, [query, id]);

  // Group child components by type
  const groupedComponents = React.useMemo(() => {
    const groups: { [type: string]: any[] } = {};

    childNodes.forEach((childId: string) => {
      try {
        const childNode = query.node(childId).get();
        const componentType = String(childNode.data.displayName || childNode.data.name || childNode.data.type);

        if (componentType) {
          if (!groups[componentType]) {
            groups[componentType] = [];
          }
          groups[componentType].push({
            id: childId,
            type: componentType,
            props: childNode.data.props
          });
        }
      } catch (error) {
        console.warn(`Could not process child node ${childId}:`, error);
      }
    });

    return groups;
  }, [childNodes, query]);




  const getComponentTabTools = (type: string) => {
    try {
      let Component;
      switch (type) {
        case 'Image':
          Component = Image;
          break;
        case 'Button':
          Component = Button;
          break;
        case 'Text':
          Component = Text;
          break;
        case 'Container':
          Component = Container;
          break;
        default:
          return null;
      }

      if (Component && Component.craft?.related) {
        return Component.craft.related;
      }

      return null;
    } catch (error) {
      console.warn(`Could not get groupTools for component type: ${type}`, error);
      return null;
    }
  };

  console.log('ContainerGroupSettings rendering - childNodes:', childNodes.length, 'groupedComponents:', Object.keys(groupedComponents));
  console.log('ContainerGroupSettings - accordion state:', accordion, 'setAccordion:', typeof setAccordion);

  const TBBody = () => (
    <TabBody>




      {/* Dynamic Group Settings */}
      {Object.entries(groupedComponents).map(([type, components]) => {
        console.log('ContainerGroupSettings - MAP EXECUTING for type:', type, 'components:', components);
        const ComponentTabTools = getComponentTabTools(type);



        return (
          <Accord
            key={type}
            prop={type}
            accordion={accordion}
            setAccordion={setAccordion}
            title={`${type}s (${components.length})`}
            className="border-b border-gray-900 group"

          >
            <div className="flex flex-col gap-3 bg-primary-700 p-3">
              {components.map((component, index) => (
                <Accord
                  key={component.id}
                  prop={`${type}-${index}`}
                  accordion={nestedAccordion}
                  setAccordion={setNestedAccordion}
                  title={`${type} ${index + 1}`}
                  className="border-b border-gray-900 group"

                >
                  <NodeProvider id={component.id}>
                    <div className="flex flex-col gap-3 bg-primary-700 p-3">
                      {ComponentTabTools.toolbar && React.createElement(ComponentTabTools.toolbar)}
                    </div>
                  </NodeProvider>


                </Accord>
              ))}

              {ComponentTabTools.groupSettings && (
                <div className="border border-gray-600 rounded-lg p-3 bg-gray-800 mb-3">
                  <div className="text-white text-sm mb-3 font-semibold">{type} Group Settings</div>
                  {React.createElement(ComponentTabTools.groupSettings, {
                    onAdd: () => {
                      // Refresh the component list after adding
                      console.log('Image added, refreshing...');
                    }
                  })}
                </div>
              )}
            </div>
          </Accord>
        );
      })}



    </TabBody>
  );

  return (
    <TBWrap head={head}>
      <TBBody />
    </TBWrap>
  );

};

export default ContainerGroupSettings;
