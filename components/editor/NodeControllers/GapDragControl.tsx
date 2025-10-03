import { useEditor, useNode } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilValue } from "recoil";
import { ViewAtom } from "../Viewport";
import { useElementColor } from "./lib";

const GAP_DETECTION_THRESHOLD = 40; // pixels - circular radius around gap control to trigger

// Convert pixel value to Tailwind gap class - snap to valid Tailwind values
const pixelsToGapClass = (pixels: number): string => {
  // Tailwind gap scale in pixels (1 unit = 4px)
  const tailwindGaps = [
    { class: "gap-0", px: 0 },
    { class: "gap-px", px: 1 },
    { class: "gap-0.5", px: 2 },
    { class: "gap-1", px: 4 },
    { class: "gap-1.5", px: 6 },
    { class: "gap-2", px: 8 },
    { class: "gap-2.5", px: 10 },
    { class: "gap-3", px: 12 },
    { class: "gap-3.5", px: 14 },
    { class: "gap-4", px: 16 },
    { class: "gap-5", px: 20 },
    { class: "gap-6", px: 24 },
    { class: "gap-7", px: 28 },
    { class: "gap-8", px: 32 },
    { class: "gap-9", px: 36 },
    { class: "gap-10", px: 40 },
    { class: "gap-11", px: 44 },
    { class: "gap-12", px: 48 },
    { class: "gap-14", px: 56 },
    { class: "gap-16", px: 64 },
    { class: "gap-20", px: 80 },
    { class: "gap-24", px: 96 },
    { class: "gap-28", px: 112 },
    { class: "gap-32", px: 128 },
    { class: "gap-36", px: 144 },
    { class: "gap-40", px: 160 },
    { class: "gap-44", px: 176 },
    { class: "gap-48", px: 192 },
    { class: "gap-52", px: 208 },
    { class: "gap-56", px: 224 },
    { class: "gap-60", px: 240 },
    { class: "gap-64", px: 256 },
    { class: "gap-72", px: 288 },
    { class: "gap-80", px: 320 },
    { class: "gap-96", px: 384 },
  ];

  // Find the closest Tailwind gap value
  let closest = tailwindGaps[0];
  let minDiff = Math.abs(pixels - closest.px);

  for (const gap of tailwindGaps) {
    const diff = Math.abs(pixels - gap.px);
    if (diff < minDiff) {
      minDiff = diff;
      closest = gap;
    }
  }

  return closest.class;
};

export const GapDragControl = () => {
  const { id, dom } = useNode((node) => ({
    dom: node.dom,
  }));

  const { isSelected } = useEditor((_, query) => ({
    isSelected: query.getEvent("selected").contains(id),
  }));

  const { actions: { setProp } } = useNode();
  const view = useRecoilValue(ViewAtom);

  // Get the current computed color from the DOM (same as border-current uses)
  const elementColor = useElementColor(dom as HTMLElement, isSelected);

  const [gapHoverInfo, setGapHoverInfo] = useState<{
    show: boolean;
    x: number;
    y: number;
    direction: "horizontal" | "vertical";
    currentGap: number;
    childIndex: number; // Track which gap (between child i and i+1)
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number; initialGap: number; childIndex: number } | null>(null);

  useEffect(() => {
    if (!dom || !isSelected) return;

    // Check if the element actually has flex display
    const styles = window.getComputedStyle(dom);
    const hasFlex = styles.display === "flex" || styles.display === "inline-flex";

    if (!hasFlex) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      // Handle dragging - lock to the specific gap we started dragging
      if (isDragging && dragStartPos && gapHoverInfo) {
        const distance = gapHoverInfo.direction === "vertical"
          ? e.clientX - dragStartPos.x
          : e.clientY - dragStartPos.y;

        const newGapPx = Math.max(0, dragStartPos.initialGap + distance);

        document.body.style.cursor = "move";

        // Convert to Tailwind class and snap to valid values
        const gapClass = pixelsToGapClass(newGapPx);

        // Apply the snapped gap value to DOM for visual feedback
        const tailwindGapToPx = {
          "gap-0": 0, "gap-px": 1, "gap-0.5": 2, "gap-1": 4, "gap-1.5": 6,
          "gap-2": 8, "gap-2.5": 10, "gap-3": 12, "gap-3.5": 14, "gap-4": 16,
          "gap-5": 20, "gap-6": 24, "gap-7": 28, "gap-8": 32, "gap-9": 36,
          "gap-10": 40, "gap-11": 44, "gap-12": 48, "gap-14": 56, "gap-16": 64,
          "gap-20": 80, "gap-24": 96, "gap-28": 112, "gap-32": 128, "gap-36": 144,
          "gap-40": 160, "gap-44": 176, "gap-48": 192, "gap-52": 208, "gap-56": 224,
          "gap-60": 240, "gap-64": 256, "gap-72": 288, "gap-80": 320, "gap-96": 384,
        };
        const snappedPx = tailwindGapToPx[gapClass] || newGapPx;
        dom.style.gap = `${snappedPx}px`;

        setProp((prop) => {
          prop[view] = prop[view] || {};
          prop[view].gap = gapClass;
        }, 200);

        // Update the control position to follow the gap center - use locked childIndex
        const children = Array.from(dom.children).filter((child) => {
          const el = child as HTMLElement;
          return el.offsetParent !== null || el.tagName === 'BODY';
        }) as HTMLElement[];

        // Use the locked child index from when we started dragging
        const lockedIndex = dragStartPos.childIndex;
        if (children.length > lockedIndex + 1) {
          const styles = window.getComputedStyle(dom);
          const flexDirection = styles.flexDirection;
          const child1 = children[lockedIndex].getBoundingClientRect();
          const child2 = children[lockedIndex + 1].getBoundingClientRect();

          let newX = gapHoverInfo.x;
          let newY = gapHoverInfo.y;

          if (gapHoverInfo.direction === "vertical") {
            // For row gaps (vertical control), update X position
            const isReverse = flexDirection === "row-reverse";
            const leftChild = isReverse ? child2 : child1;
            const rightChild = isReverse ? child1 : child2;
            const gapStart = leftChild.right;
            const gapEnd = rightChild.left;
            newX = (gapStart + gapEnd) / 2;
          } else {
            // For column gaps (horizontal control), update Y position
            const isReverse = flexDirection === "column-reverse";
            const topChild = isReverse ? child2 : child1;
            const bottomChild = isReverse ? child1 : child2;
            const gapStart = topChild.bottom;
            const gapEnd = bottomChild.top;
            newY = (gapStart + gapEnd) / 2;
          }

          setGapHoverInfo({
            ...gapHoverInfo,
            x: newX,
            y: newY,
          });
        }

        return;
      }

      // Don't update hover detection while dragging
      if (isDragging) return;

      rafId = requestAnimationFrame(() => {
        const rect = dom.getBoundingClientRect();
        // Filter out non-visible children (like portals, scripts, etc)
        const children = Array.from(dom.children).filter((child) => {
          const el = child as HTMLElement;
          return el.offsetParent !== null || el.tagName === 'BODY';
        }) as HTMLElement[];

        if (children.length < 2) {
          setGapHoverInfo(null);
          return;
        }

        // Get computed styles to check flex direction
        const styles = window.getComputedStyle(dom);
        const flexDirection = styles.flexDirection;
        const isRow = flexDirection === "row" || flexDirection === "row-reverse";
        const isColumn = flexDirection === "column" || flexDirection === "column-reverse";

        // Parse current gap value
        const currentGapPx = parseFloat(styles.gap) || 0;

        // Check if mouse is hovering in gap areas between children
        for (let i = 0; i < children.length - 1; i++) {
          const child1 = children[i].getBoundingClientRect();
          const child2 = children[i + 1].getBoundingClientRect();

          if (isRow) {
            // Horizontal gaps (between columns)
            // Handle both normal and reverse direction
            const isReverse = flexDirection === "row-reverse";
            const leftChild = isReverse ? child2 : child1;
            const rightChild = isReverse ? child1 : child2;

            const gapStart = leftChild.right;
            const gapEnd = rightChild.left;
            const gapCenter = (gapStart + gapEnd) / 2;
            const gapSize = Math.abs(gapEnd - gapStart);

            // Get the vertical bounds of the two children that form this gap
            const minTop = Math.min(child1.top, child2.top);
            const maxBottom = Math.max(child1.bottom, child2.bottom);

            // Calculate where the control would be positioned
            const controlX = gapCenter;
            const controlY = (minTop + maxBottom) / 2;

            // Check if mouse is within circular radius of the control position
            const distance = Math.sqrt(
              Math.pow(e.clientX - controlX, 2) + Math.pow(e.clientY - controlY, 2)
            );

            if (
              distance < GAP_DETECTION_THRESHOLD &&
              (gapSize >= 0 || Math.abs(gapEnd - gapStart) <= 50) // Allow showing for small or no gaps
            ) {
              setGapHoverInfo({
                show: true,
                x: controlX,
                y: controlY,
                direction: "vertical",
                currentGap: currentGapPx,
                childIndex: i,
              });
              return;
            }
          } else if (isColumn) {
            // Vertical gaps (between rows in column layout)
            // Handle both normal and reverse direction
            const isReverse = flexDirection === "column-reverse";
            const topChild = isReverse ? child2 : child1;
            const bottomChild = isReverse ? child1 : child2;

            const gapStart = topChild.bottom;
            const gapEnd = bottomChild.top;
            const gapCenter = (gapStart + gapEnd) / 2;
            const gapSize = Math.abs(gapEnd - gapStart);

            // Get the horizontal bounds of the two children that form this gap
            const minLeft = Math.min(child1.left, child2.left);
            const maxRight = Math.max(child1.right, child2.right);

            // Calculate where the control would be positioned
            const controlX = (minLeft + maxRight) / 2;
            const controlY = gapCenter;

            // Check if mouse is within circular radius of the control position
            const distance = Math.sqrt(
              Math.pow(e.clientX - controlX, 2) + Math.pow(e.clientY - controlY, 2)
            );

            if (
              distance < GAP_DETECTION_THRESHOLD &&
              (gapSize >= 0 || Math.abs(gapEnd - gapStart) <= 50) // Allow showing for small or no gaps
            ) {
              setGapHoverInfo({
                show: true,
                x: controlX,
                y: controlY,
                direction: "horizontal",
                currentGap: currentGapPx,
                childIndex: i,
              });
              return;
            }
          }
        }

        setGapHoverInfo(null);
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStartPos(null);
        document.body.style.cursor = "auto";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dom, isSelected, isDragging, dragStartPos, gapHoverInfo, view, setProp]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!gapHoverInfo) return;

    const styles = window.getComputedStyle(dom);
    const currentGapPx = parseFloat(styles.gap) || 0;

    document.body.style.cursor = "move";
    setIsDragging(true);
    setDragStartPos({
      x: e.clientX,
      y: e.clientY,
      initialGap: currentGapPx,
      childIndex: gapHoverInfo.childIndex, // Lock to the gap we're hovering
    });
  };

  const shouldShow = (gapHoverInfo?.show || isDragging) && gapHoverInfo;

  const container = document?.querySelector('[data-container="true"]');
  if (!container) return null;

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.div
          key={`gap-${id}-${gapHoverInfo.childIndex}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
          style={{
            position: "fixed",
            left: gapHoverInfo.x,
            top: gapHoverInfo.y,
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            pointerEvents: "auto",
            color: elementColor || undefined,
          }}
        >
          <Tooltip content="Drag to adjust gap" placement="right">
            <motion.button
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              className={`drag-control group ${gapHoverInfo.direction === "horizontal" ? "w-8 h-2" : "w-2 h-8"
                }`}
              onMouseDown={handleMouseDown}
              aria-label="Drag to adjust gap"
            />
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>,
    container
  );
};

