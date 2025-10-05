import { useEditor, useNode } from "@craftjs/core";
import { ToolbarItem } from "components/editor/Toolbar";
import { FlexDirectionInput } from "components/editor/Toolbar/Inputs/FlexDirectionInput";
import { NodeToolWrapper } from "components/editor/Tools/NodeDialog";
import { ViewAtom } from "components/editor/Viewport";
import { getPropFinalValue } from "components/editor/Viewport/lib";
import { AddElement } from "components/editor/Viewport/Toolbox/lib";
import { Tooltip } from "components/layout/Tooltip";
import { Container } from "components/selectors/Container";
import {
  TbLayoutAlignBottom,
  TbLayoutAlignCenter,
  TbLayoutAlignLeft,
  TbLayoutAlignMiddle,
  TbLayoutAlignRight,
  TbLayoutAlignTop,
  TbPlus,
  TbRowInsertTop
} from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { MenuItemState, MenuState } from "utils/lib";
import { DeleteNodeButton } from "./DeleteNodeButton";
import { DuplicateNodeButton } from "./DuplicateNodeButton";

// Helper function to get alignment options based on direction and value
const getAlignmentOptions = (direction, value) => {
  const isHorizontal = direction === "horizontal";
  const horizontal = isHorizontal ? "items" : "justify";
  const vertical = isHorizontal ? "justify" : "items";

  if (isHorizontal) {
    return [
      {
        value: `${horizontal}-start`,
        label:
          value === "flex-row-reverse" ? (
            <TbLayoutAlignRight />
          ) : (
            <TbLayoutAlignLeft />
          ),
      },
      { value: `${horizontal}-center`, label: <TbLayoutAlignCenter /> },
      {
        value: `${horizontal}-end`,
        label:
          value === "flex-row-reverse" ? (
            <TbLayoutAlignLeft />
          ) : (
            <TbLayoutAlignRight />
          ),
      },
    ];
  } else {
    return [
      {
        value: `${vertical}-start`,
        label:
          value === "flex-col-reverse" ? (
            <TbLayoutAlignBottom />
          ) : (
            <TbLayoutAlignTop />
          ),
      },
      { value: `${vertical}-center`, label: <TbLayoutAlignMiddle /> },
      {
        value: `${vertical}-end`,
        label:
          value === "flex-col-reverse" ? (
            <TbLayoutAlignTop />
          ) : (
            <TbLayoutAlignBottom />
          ),
      },
    ];
  }
};

// Helper function to determine the propKey based on direction and value
const determinePropKey = (direction, value) => {
  if (direction === "horizontal") {
    return ["flex-row", "flex-row-reverse"].includes(value)
      ? "justifyContent"
      : "alignItems";
  } else {
    return ["flex-row", "flex-row-reverse"].includes(value)
      ? "alignItems"
      : "justifyContent";
  }
};

export function ContainerSettingsTopNodeTool({ direction = "horizontal" }) {
  const view = useRecoilValue(ViewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const { nodeProps, id } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
  }));

  const { value } = getPropFinalValue(
    {
      propKey: "flexDirection",
    },
    view,
    nodeProps
  );

  const propKey = determinePropKey(direction, value);
  const options = getAlignmentOptions(direction, value);

  const { actions, query } = useEditor();
  const {
    actions: { setProp },
  } = useEditor();

  const setShowMenu = useSetRecoilState(MenuState);
  const setShowMenuType = useSetRecoilState(MenuItemState);

  const match =
    (direction === "horizontal" &&
      ["flex-row", "flex-row-reverse"].includes(value)) ||
    (direction !== "horizontal" &&
      ["flex-col", "flex-col-reverse"].includes(value));


  return (
    <NodeToolWrapper
      col={direction !== "horizontal"}
      className={`bg-primary-500 inside-shadow text-black rounded-md m-1 ${direction == "horizontal" ? "px-3" : "py-3 px-1.5"}`}
      animate={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            delay: 0.2,
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
      }}
    >
      {direction === "horizontal" && (
        <div className="h-6 w-6 flex items-center justify-center">
          <Tooltip content="Delete container">
            <DeleteNodeButton
              className="text-white hover:text-gray-200"
              title="Delete container"
              titleDisabled="Cannot delete"
              useSimpleDelete={false}
            />
          </Tooltip>
        </div>
      )}

      {direction === "horizontal" && (
        <div className="h-6 w-6 flex items-center justify-center">
          <Tooltip content="Duplicate container">
            <DuplicateNodeButton
              className="text-white hover:text-gray-200"
              title="Duplicate container"
            />
          </Tooltip>
        </div>
      )}


      <Tooltip content={`Align items ${direction === "horizontal" ? "horizontally" : "vertically"}`}>
        <div className="h-6 w-6 flex items-center justify-center">
          <ToolbarItem
            propKey={propKey}
            type="toggleNext"
            label=""
            labelHide={true}
            cols={direction === "horizontal"}
            wrap="control"
            options={options}
            propType="class"
          />
        </div>
      </Tooltip>
      {direction == "horizontal" && (
        <div className="h-6 w-6 flex items-center justify-center">
          <FlexDirectionInput wrap="control" type="toggleNext" />
        </div>
      )}

      {match && (
        <div className="h-6 w-6 flex items-center justify-center">
          <Tooltip content={`Add ${["flex-row", "flex-row-reverse"].includes(value) ? "column" : "row"} container`}>
            <button
              className={`text-white hover:text-gray-200 ${direction == "horizontal" ? "-rotate-90" : ""
                }`}
              onClick={() => {
                const isRow = ["flex-row", "flex-row-reverse"].includes(value);
                AddElement({
                  element: (
                    <Container
                      canDelete={true}
                      mobile={{
                        display: "flex",
                        justifyContent: "justify-center",
                        flexDirection: isRow ? "flex-col" : "flex-row",
                        width: "w-full",
                      }}
                      desktop={{}}
                      custom={{ displayName: isRow ? "Column" : "Row" }}
                    />
                  ),
                  actions,
                  query,
                });
              }}
            >
              <TbRowInsertTop />
            </button>
          </Tooltip>
        </div>
      )}





      {match && (
        <div className="h-6 w-6 flex items-center justify-center">
          <Tooltip content="Add components">
            <button
              className={`text-white hover:text-gray-200 ${direction == "horizontal" ? "-rotate-90" : ""
                }`}
              onClick={() => {
                setShowMenu(true);
                setShowMenuType("components");
              }}
            >
              <TbPlus />
            </button>
          </Tooltip>
        </div>
      )}
    </NodeToolWrapper>
  );
}

export default ContainerSettingsTopNodeTool;
