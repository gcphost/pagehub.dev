import { useEditor, useNode } from "@craftjs/core";
import RenderNodeControlInline from "../RenderNodeControlInline";

export const HoverNodeController = (props: {
  position;
  align;
  placement;
  alt?: any;
}) => {
  const { position, align, placement, alt } = props as any;

  const { name, id } = useNode((node) => ({
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { isHover } = useNode((node) => ({
    isHover: node.events.hovered,
  }));

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  if (!isHover || isActive) return null;

  return (
    <RenderNodeControlInline
      key={`${id}-hover`}
      position={position}
      align={align}
      alt={alt}
      placement={placement || "start"}
      className={`${position === "top" && align === "start" && placement === "end" ? "m-0.5" : ""} whitespace-nowrap items-center justify-center select-none`}
    >
      <div
        className={
          "px-2 border flex flex-row gap-3 bg-white text-black !text-base !font-normal fontfamily-base rounded-md"
        }
      >
        {name}
      </div>
    </RenderNodeControlInline>
  );
};
