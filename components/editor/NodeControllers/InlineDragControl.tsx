import { useEditor, useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * InlineDragControl - A drag control that renders inline within the element
 * No portals, no position calculations - just CSS positioning
 */
export const InlineDragControl = ({
  position, // "top" | "bottom" | "left" | "right"
  direction, // "vertical" | "horizontal"
  propVar, // e.g., "height", "mt", "width"
  styleToUse, // e.g., "height", "marginTop"
  tooltip = "Drag to adjust",
  isPadding = false,
  gridSnap = 0,
}) => {
  const { id, actions: { setProp } } = useNode();
  const { enabled, query, isActive } = useEditor((_, query) => ({
    enabled: _.options.enabled,
    isActive: query.getEvent("selected").contains(id),
  }));

  const [dragging, setDragging] = useState(false);
  const [startValue, setStartValue] = useState(0);

  if (!enabled || !isActive) return null;

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
    const startPos = direction === "vertical" ? e.clientY : e.clientX;

    // Get current value from the element
    const element = document.querySelector(`[node-id="${id}"]`);
    if (!element) return;

    const computedStyle = window.getComputedStyle(element);
    const currentValue = parseInt(computedStyle[styleToUse]) || 0;
    setStartValue(currentValue);

    const handleMouseMove = (moveEvent) => {
      const currentPos = direction === "vertical" ? moveEvent.clientY : moveEvent.clientX;
      let delta = currentPos - startPos;

      // Invert delta for top/left positions
      if (position === "top" || position === "left") {
        delta = -delta;
      }

      let newValue = startValue + delta;

      // Apply grid snap if specified
      if (gridSnap > 0) {
        newValue = Math.round(newValue / gridSnap) * gridSnap;
      }

      // Ensure non-negative
      newValue = Math.max(0, newValue);

      // Convert to Tailwind class
      const pixelsToTailwindClass = (pixels, prop) => {
        const remValue = pixels / 16;
        const tailwindMap = {
          0: "0", 1: "0.5", 2: "1", 4: "1.5", 6: "2", 8: "2.5",
          10: "3", 12: "3.5", 14: "4", 16: "5", 20: "6", 24: "7",
          28: "8", 32: "9", 36: "10", 40: "11", 44: "12", 48: "14",
          56: "16", 64: "20", 80: "24", 96: "28", 112: "32", 128: "36",
          144: "40", 160: "44", 176: "48", 192: "52", 208: "56", 224: "60",
          240: "64", 256: "72", 288: "80", 320: "96",
        };

        const closest = Object.keys(tailwindMap).reduce((prev, curr) =>
          Math.abs(parseInt(curr) - pixels) < Math.abs(parseInt(prev) - pixels) ? curr : prev
        );

        const PROP_VAR_MAP = {
          height: "h",
          width: "w",
          marginTop: "mt",
          marginBottom: "mb",
          paddingTop: "pt",
          paddingBottom: "pb",
          paddingLeft: "pl",
          paddingRight: "pr",
        };

        const tailwindProp = PROP_VAR_MAP[prop] || prop;

        if (tailwindMap[closest]) {
          return `${tailwindProp}-${tailwindMap[closest]}`;
        }
        return `${tailwindProp}-[${pixels}px]`;
      };

      const newClass = pixelsToTailwindClass(newValue, propVar);

      changeProp({
        setProp,
        propKey: propVar,
        propType: "mobile",
        value: newClass,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Position styles based on position prop
  const positionStyles = {
    top: { top: isPadding ? '4px' : '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    bottom: { bottom: isPadding ? '4px' : '-4px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
    left: { left: isPadding ? '4px' : '-4px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
    right: { right: isPadding ? '4px' : '-4px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
  };

  return (
    <motion.div
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: dragging ? 1 : 0.7,
        scale: dragging ? 1.3 : 1
      }}
      whileHover={{ opacity: 1, scale: 1.3 }}
      whileTap={{ scale: 1.3 }}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        width: direction === "horizontal" ? '8px' : '20px',
        height: direction === "vertical" ? '8px' : '20px',
        backgroundColor: dragging ? '#3b82f6' : isPadding ? '#10b981' : '#ef4444',
        borderRadius: '2px',
        zIndex: 1000,
        pointerEvents: 'auto',
        cursor: positionStyles[position].cursor,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
      title={tooltip}
    />
  );
};

