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
      className="whitespace-nowrap items-center select-none p-2"
    >
      <div className="p-2 flex items-center justify-center bg-gray-600 rounded-md !text-base !font-normal fontfamily-base">
        <DeleteNodeButton
          className="text-white hover:text-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          useSimpleDelete={false}
        />
      </div>
    </RenderNodeControlInline>
  );
};

