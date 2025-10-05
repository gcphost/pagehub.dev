import { useEditor, useNode } from "@craftjs/core";
import { deleteNode } from "components/editor/Viewport/lib";
import { TbTrash, TbTrashOff } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";

interface DeleteNodeButtonProps {
  className?: string;
  iconSize?: number;
  title?: string;
  titleDisabled?: string;
  useSimpleDelete?: boolean; // If true, uses actions.delete() instead of deleteNode()
}

export const DeleteNodeButton = ({
  className = "text-white",
  iconSize = 16,
  title = "Delete",
  titleDisabled = "Cannot delete",
  useSimpleDelete = false,
}: DeleteNodeButtonProps) => {
  const { id, canDelete } = useNode((node) => ({
    canDelete: node.data.props?.canDelete !== false,
  }));

  const { actions, query } = useEditor();
  const settings = useRecoilValue(SettingsAtom);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!canDelete) return;

    try {
      if (useSimpleDelete) {
        actions.delete(id);
      } else {
        deleteNode(query, actions, id, settings);
      }
    } catch (error) {
      console.error("Error deleting node:", error);
    }
  };

  return (
    <button
      className={className}
      onClick={handleDelete}
      title={canDelete ? title : titleDisabled}
      disabled={!canDelete}
    >
      {canDelete ? <TbTrash size={iconSize} /> : <TbTrashOff size={iconSize} />}
    </button>
  );
};

