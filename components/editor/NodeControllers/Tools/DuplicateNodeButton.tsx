import { useEditor, useNode } from "@craftjs/core";
import { addHandler, buildClonedTree, saveHandler } from "components/editor/Viewport/lib";
import { useCallback } from "react";
import { TbCopy } from "react-icons/tb";

interface DuplicateNodeButtonProps {
  className?: string;
  iconSize?: number;
}

export const DuplicateNodeButton = ({
  className = "text-white",
  iconSize = 16,
}: DuplicateNodeButtonProps) => {
  const { id } = useNode();

  const { actions, query } = useEditor();
  const {
    actions: { setProp },
  } = useEditor();

  const getCloneTree = useCallback(
    (tree) => buildClonedTree({ tree, query, setProp, createLinks: false }),
    [query, setProp]
  );

  const handleSaveTemplate = useCallback(
    () => saveHandler({ query, id, component: null, actions }),
    [id, query, actions]
  );

  const handleAdd = useCallback(() => {
    addHandler({
      actions,
      query,
      getCloneTree,
      id,
      setProp,
    });
  }, [actions, getCloneTree, id, query, setProp]);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      handleSaveTemplate();
      handleAdd();
    } catch (error) {
      console.error("Error duplicating node:", error);
    }
  };

  return (
    <button
      className={className}
      onClick={handleDuplicate}
    >
      <TbCopy size={iconSize} />
    </button>
  );
};

