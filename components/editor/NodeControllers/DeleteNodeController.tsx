import { useEditor, useNode } from "@craftjs/core";
import { motion } from "framer-motion";
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
      className="whitespace-nowrap items-center select-none pointer-events-auto"
    >
      <motion.div initial={{ opacity: 0 }}
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
        }} className="p-1.5 flex items-center justify-center bg-muted rounded-md !text-base !font-normal fontfamily-base m-1">
        <DeleteNodeButton
          className="text-foreground hover:text-muted-foreground disabled:text-muted-foreground disabled:cursor-not-allowed text-sm"
        />
      </motion.div>
    </RenderNodeControlInline>
  );
};

