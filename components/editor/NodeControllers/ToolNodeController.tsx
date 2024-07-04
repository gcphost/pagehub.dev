import { useEditor, useNode } from "@craftjs/core";
import { AnimatePresence } from "framer-motion";
import RenderNodeControl from "../RenderNodeControl";

export const ToolNodeController = (props: {
  position;
  align;
  children;
  placement?: any;
  alt?: any;
}) => {
  const { position, align, children, placement = "end", alt } = props as any;

  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  return (
    <AnimatePresence>
      {isActive && (
        <RenderNodeControl
          position={position}
          align={align}
          placement={placement}
          alt={alt}
          className={`whitespace-nowrap fixed items-center justify-center select-none pointer-events-auto`}
        >
          {children}
        </RenderNodeControl>
      )}
    </AnimatePresence>
  );
};
