import { useEditor, useNode } from "@craftjs/core";
import { RenderNodeControlInline } from "components/editor/RenderNodeControlInline";
import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { TbList } from "react-icons/tb";

export const SelectButtonListTool = () => {
  const { id } = useNode();
  const { query, actions } = useEditor();

  // Find the ButtonList parent
  const findButtonListParent = (nodeId: string): string | null => {
    try {
      const node = query.node(nodeId).get();
      if (!node?.data?.parent) return null;

      const parentNode = query.node(node.data.parent).get();
      if (!parentNode) return null;

      // Check if this parent is a ButtonList
      const parentName = parentNode.data.name;
      const parentDisplayName = parentNode.data.displayName;

      if (parentName === "ButtonList" || parentDisplayName === "ButtonList") {
        return parentNode.id;
      }

      // Recursively check parent's parent
      return findButtonListParent(parentNode.id);
    } catch (e) {
      return null;
    }
  };

  const buttonListId = findButtonListParent(id);

  // Only show the button if we're inside a ButtonList
  if (!buttonListId) return null;

  const handleSelectButtonList = () => {
    actions.selectNode(buttonListId);
  };

  return (
    <RenderNodeControlInline
      key={`${id}-select-button-list`}
      position="right"
      align="middle"
      className="whitespace-nowrap items-center select-none pointer-events-auto"
    > <motion.div initial={{ opacity: 0 }}
      animate={{
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
      }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0.2,
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.5,
        },
      }} className="p-0.5 flex items-center justify-center bg-muted rounded-md !text-base !font-normal fontfamily-base m-1">
        <Tooltip content="Select List" className="tool-bg h-fit whitespace-nowrap items-center select-none pointer-events-auto">
          <button
            type="button"
            className="text-foreground hover:text-muted-foreground disabled:text-muted-foreground disabled:cursor-not-allowed text-sm"
            onClick={handleSelectButtonList}
          >
            <TbList />
          </button>

        </Tooltip> </motion.div>
    </RenderNodeControlInline>
  );
};

export default SelectButtonListTool;
