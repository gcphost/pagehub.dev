import { useEditor, useNode } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import RenderNodeControl from "../RenderNodeControl";

const EditableName = () => {
  const { name, id } = useNode((node) => ({
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { actions } = useEditor();

  return (
    <div
      className={
        "pointer-events-auto rounded-sm overflow-hidden border flex flex-row gap-3 bg-white/90 text-black !text-base !font-normal fontfamily-base"
      }
    >
      <div
        className="px-2"
        contentEditable={true}
        data-gramm="false"
        suppressContentEditableWarning={true}
        onInput={debounce((e) => {
          actions.setCustom(
            id,
            (custom) => (custom.displayName = e.target.innerText)
          );
        }, 500)}
      >
        {name}
      </div>
    </div>
  );
};

export const NameNodeController = (props: {
  position;
  align;
  placement;
  alt?: any;
}) => {
  const { position, align, placement, alt } = props as any;

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
          alt={alt}
          placement={placement}
          className={`${
            position === "top" && align === "start" && placement === "end"
              ? "m-1"
              : ""
          } whitespace-nowrap fixed items-center justify-center select-none will-change-auto`}
        >
          <motion.div
            {...{
              initial: {
                opacity: 0,
                width: 0,
              },
              animate: {
                opacity: 1,
                width: "unset",
                transition: { ease: "easeOut", duration: 0.5 },
              },
              exit: {
                opacity: 0,
                width: 0,
                transition: { ease: "easeOut", duration: 0.3 },
              },
            }}
          >
            <EditableName />
          </motion.div>
        </RenderNodeControl>
      )}
    </AnimatePresence>
  );
};
