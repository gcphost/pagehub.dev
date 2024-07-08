import { Element, ROOT_NODE, useEditor } from "@craftjs/core";
var generate = require("boring-name-generator");

import { motion } from "framer-motion";
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
    let node = query.node(active).get();
    active = node.data.parent;
  }

  let activeNode = query.node(active).get();
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

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      className={`cursor-move w-full pointer-events-auto`}
      ref={(ref: any) => create(ref, tool)}
      onDragEnterCapture={() => {
        //  console.log("a");
        //  setMenu({enabled:false})
      }}
      onDragCapture={() => {}}
      onDragExitCapture={() => {
        //  console.log("de");
      }}
      onDragEndCapture={() => {
        // setMenu({ enabled: false });
        // console.log("end");
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
      {renderer || <div className={` w-full`}>{display}</div>}
    </motion.div>
  );
};
