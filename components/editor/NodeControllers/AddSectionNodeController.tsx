import { Element, ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { Container } from "components/selectors/Container";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { useIsInlineRender } from "../InlineRenderContext";
import RenderNodeControl from "../RenderNodeControl";
import RenderNodeControlInline from "../RenderNodeControlInline";
import { AddElement } from "../Viewport/Toolbox/lib";
import { useMousePosition } from "./lib";
import { SectionPickerDialog } from "./SectionPickerDialog";

const generate = require("boring-name-generator");

export const AddSectionNodeController = (props: { position; align }) => {
  const { position, align } = props as any;

  const ref = useRef(null);

  const { id } = useNode();

  const { isInBottomOrRight } = useMousePosition(id, 100);

  const { isHover } = useNode((node) => ({
    isHover: node.events.hovered,
  }));

  const [showSectionPicker, setShowSectionPicker] = useState(false);

  // Detect if we're being rendered inline (directly as child) vs through tools
  const isInlineRender = useIsInlineRender();
  const ControlComponent = isInlineRender ? RenderNodeControlInline : RenderNodeControl;


  const { parent, currentNodeType } = useNode((node) => ({
    parent: node.data.parent,
    currentNodeType: node.data.props?.type,
  }));

  const { query, actions } = useEditor();

  const parentNode = query.node(parent || ROOT_NODE).get();
  const propType = parentNode?.data?.props?.type;

  let type = null;
  // Only show "Add a Page" if this container itself is type="page"
  if (currentNodeType === "page") type = "Page";
  // For sections inside pages
  if (propType === "page") type = "Section";

  // Only show if this is a page or inside a page container
  if (!type) return null;

  return (
    <>
      {/* Modal always rendered, controlled by its own state */}
      <SectionPickerDialog
        isOpen={showSectionPicker}
        onClose={() => setShowSectionPicker(false)}
        onSelectSection={(element) => {
          // Get the parent node
          const parentNodeData = query.node(parent).get();
          const currentIndex = parentNodeData.data.nodes.indexOf(id);
          const newIndex = position === "bottom" ? currentIndex + 1 : currentIndex;

          const newElement = AddElement({
            element,
            actions,
            query,
            addTo: parent,
            index: newIndex,
          });

          // Scroll to the new element first, then select it
          if (newElement && newElement.rootNodeId) {
            setTimeout(() => {
              // Get DOM from CraftJS instead of querySelector
              const node = query.node(newElement.rootNodeId).get();
              if (node && node.dom) {
                node.dom.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Select after scrolling completes
                setTimeout(() => {
                  actions.selectNode(newElement.rootNodeId);
                }, 500);
              }
            }, 100);
          }
        }}
      />

      {/* Button only shows when hovering near bottom */}
      {isHover && isInBottomOrRight && (
        <AnimatePresence>
          <ControlComponent
            position={position}
            placement="middle"
            align={align}
            className={
              isInlineRender
                ? "whitespace-nowrap items-center justify-center select-none cursor-pointer pointer-events-auto"
                : "whitespace-nowrap fixed items-center justify-center select-none cursor-pointer pointer-events-auto"
            }
            animate={{
              initial: { opacity: 0, y: 2 },
              animate: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.5,
                },
              },
              exit: {
                opacity: 0,
                y: 2,
                transition: {
                  delay: 0.2,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 0.5,
                },
              },
              whileHover: { scale: 1.1, y: -5 },
              whileTap: { scale: 1.1 },
            }}
          >
            <motion.button
              ref={ref}
              className={
                "border btn text-white rounded-md flex flex-row px-3 py-1.5 gap-1.5 items-center cursor-pointer !text-xs !font-normal fontfamily-base pointer-events-auto"
              }
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (type === "Page") {
                  // Directly add a new blank page
                  const newPage = (
                    <Element
                      canvas
                      is={Container}
                      type="page"
                      canDelete={true}
                      canEditName={true}
                      root={{}}
                      mobile={{
                        mx: "mx-auto",
                        display: "flex",
                        justifyContent: "items-center",
                        flexDirection: "flex-col",
                        width: "w-full",
                        height: "h-full",
                        gap: "gap-8",
                        py: "py-6",
                        px: "px-3",
                      }}
                      desktop={{}}
                      custom={{ displayName: generate().spaced }}
                    />
                  );

                  // Get the current page's index in ROOT_NODE
                  const rootNode = query.node(ROOT_NODE).get();
                  const currentPageIndex = rootNode.data.nodes.indexOf(id);
                  const newIndex = position === "bottom" ? currentPageIndex + 1 : currentPageIndex;

                  const newElement = AddElement({
                    element: newPage,
                    actions,
                    query,
                    addTo: ROOT_NODE,
                    index: newIndex,
                  });

                  // Scroll to the new page first, then select it
                  if (newElement && newElement.rootNodeId) {
                    setTimeout(() => {
                      // Get DOM from CraftJS instead of querySelector
                      const node = query.node(newElement.rootNodeId).get();
                      if (node && node.dom) {
                        node.dom.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Select after scrolling completes
                        setTimeout(() => {
                          actions.selectNode(newElement.rootNodeId);
                        }, 500);
                      }
                    }, 100);
                  }
                } else {
                  // Open the section picker dialog
                  setShowSectionPicker(true);
                }
              }}
            >
              <TbPlus /> Add {type}
            </motion.button>
          </ControlComponent>
        </AnimatePresence>
      )}
    </>
  );
};
