import { Element, ROOT_NODE, useEditor } from "@craftjs/core";

import { motion } from "framer-motion";
import { cloneElement, isValidElement, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { TbActiveMenuAtom } from "../atoms";

export const Tools: any = {};

export const SelectedNodeAtom = atom({
  key: "selectedNode",
  default: { id: null, position: "" },
});

export const AddElement = ({
  element,
  actions,
  query,
  index = 1,
  addTo = null,
  selected = null,
  position = "",
}) => {
  if (!element) return;

  let active = query.getEvent("selected").first();
  if (!active) active = ROOT_NODE;

  if (
    ["afterParent", "beforeParent"].includes(position) &&
    active !== ROOT_NODE
  ) {
    const node = query.node(active).get();
    active = node.data.parent;
  }

  const activeNode = query.node(active).get();
  if (!activeNode) return false;

  if (selected) {
    index = activeNode.data.nodes.indexOf(selected);
    if (["after", "afterParent"].includes(position)) {
      index += 1;
    } else index -= 1;
  }

  try {
    const newElement = query.parseReactElement(element).toNodeTree();

    const type =
      newElement?.nodes[newElement?.rootNodeId]?.data?.props?.type || "";

    if (type === "page") {
      addTo = ROOT_NODE;
    }

    const addToNode = addTo ? query.node(addTo).get() : activeNode;
    if (!addToNode) return false;

    if (
      !addToNode.rules.canMoveIn([newElement?.nodes[newElement?.rootNodeId]])
    ) {
      console.error("Cant move in.", addToNode, newElement);
      return false;
    }

    actions.addNodeTree(newElement, addTo || activeNode.id, index);

    return newElement;
  } catch (e) {
    console.error(e);
  }

  return false;
};

export const ToolboxItemDisplay = ({
  icon: Icon,
  label,
  isDragging = false,
}) => (
  <div className="pointer-events-none flex min-h-[60px] w-full flex-col items-center justify-center gap-2 px-1 py-2 transition-colors">
    <Icon className="text-2xl text-foreground" />
    <span className="text-center text-[10px] text-muted-foreground">
      {label}
    </span>
  </div>
);

export const RenderToolComponent = ({
  element,
  className = "",
  renderer = null,
  display = null,
  ...props
}) => {
  const { actions, query } = useEditor();
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const selectedNode = useRecoilValue(SelectedNodeAtom);
  const setActiveMenu = useSetRecoilState(TbActiveMenuAtom);
  const [isDragging, setIsDragging] = useState(false);

  const tool = (
    <Element
      canvas
      is={element}
      canDelete={true}
      canEditName={true}
      {...{ ...props, className: null }}
    />
  );

  const _className = [
    ...Object.keys(props.mobile || {}).map((_) => props.mobile[_]),
    ...Object.keys(props.root || {}).map((_) => props.root[_]),
  ].join(" ");

  // Clone display element and inject isDragging prop if it's a React element
  const displayWithProps =
    display && isValidElement(display)
      ? cloneElement(display, { isDragging } as any)
      : display;

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={`pointer-events-auto w-full cursor-move rounded-md border border-border hover:bg-accent ${isDragging ? "border-accent bg-accent text-accent-foreground" : ""}`}
      ref={(ref: any) => create(ref, tool)}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
      onDoubleClick={() => {
        const props = {
          element: tool,
          actions,
          query,
          selected: selectedNode.id,
          position: selectedNode.position,
        };

        AddElement(props);
      }}
    >
      {renderer || <div className={"w-full"}>{displayWithProps}</div>}
    </motion.div>
  );
};
