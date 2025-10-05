import { useEditor, useNode } from "@craftjs/core";
import RenderNodeControlInline from "../RenderNodeControlInline";
import { DeleteNodeButton } from "./Tools/DeleteNodeButton";

export const DeleteNodeController = () => {
  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  if (!isActive) return null;

  return (
    <RenderNodeControlInline
      key={`${id}-delete`}
      position="left"
      align="middle"
      className="whitespace-nowrap items-center justify-center select-none"
    >
      <div className="px-2 py-1 border flex items-center justify-center bg-white rounded-md !text-base !font-normal fontfamily-base">
        <DeleteNodeButton
          className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          useSimpleDelete={false}
        />
      </div>
    </RenderNodeControlInline>
  );
};

