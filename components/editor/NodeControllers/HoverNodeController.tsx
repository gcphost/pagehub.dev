import { useEditor, useNode } from "@craftjs/core";
import { AnimatePresence } from "framer-motion";
import RenderNodeControl from "../RenderNodeControl";

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

  return (
    <AnimatePresence mode="wait">
      {isHover && !isActive && (
        <RenderNodeControl
          key={`${id}-hover-${isHover}`}
          position={position}
          align={align}
          alt={alt}
          placement={placement || "start"}
          className={`${position === "top" && align === "start" && placement === "end"
            ? "m-0.5"
            : ""
            } whitespace-nowrap fixed items-center justify-center select-none will-change-auto`}
          animate={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { ease: "easeOut" },
            },
            exit: {
              opacity: 0,
              transition: { ease: "easeOut", duration: 0.3 },
            },
          }}
        >
          <div
            className={
              "px-2 border flex flex-row gap-3 bg-white text-black !text-base !font-normal fontfamily-base rounded-md"
            }
          >
            {name}
          </div>
        </RenderNodeControl>
      )}
    </AnimatePresence>
  );
};
