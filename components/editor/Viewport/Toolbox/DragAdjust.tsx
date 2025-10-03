import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function DragAdjust({
  targetElement,
  direction = "vertical",
  unit = "px",
  showButton = true,
  className = "",
  styleToUse = "marginTop",
  tooltip = "",
  onChange = (value) => { },
  onDragStart = () => { },
  onDragEnd = () => { },
}) {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [initialMarginTop, setInitialMarginTop] = useState(null);
  const [initialWidth, setInitialWidth] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleMouseDown = (e) => {
    if (!targetElement) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    const computedStyle = window.getComputedStyle(targetElement);
    if (direction === "vertical") {
      setInitialMarginTop(parseFloat(computedStyle[styleToUse]));
    } else if (direction === "horizontal") {
      setInitialWidth(parseFloat(computedStyle[styleToUse]));
    }
    targetRef.current = targetElement;
    document.body.style.cursor = "cursor-move";
    if (onDragStart) onDragStart();
  };

  const handleMouseUp = () => {
    if (dragging && onDragEnd) {
      onDragEnd();
    }
    setDragging(false);
    document.body.style.cursor = "auto";
  };

  const handleMouseMove = (e) => {
    if (dragging && targetRef.current) {
      if (direction === "vertical") {
        const dragDistance = e.clientY - startY;
        const newMarginTop = initialMarginTop + dragDistance;

        targetRef.current.style[styleToUse] = `${newMarginTop}${unit}`;

        onChange(targetRef.current.style[styleToUse]);

        //  document.body.classList.add("cursor-move");
      } else if (direction === "horizontal") {
        const dragDistance = e.clientX - startX;
        const newWidth = initialWidth + dragDistance;
        targetRef.current.style[styleToUse] = `${newWidth}${unit}`;

        onChange(targetRef.current.style[styleToUse]);
        // document.body.classList.remove("cursor-move");
      }
    }
  };

  const button = (
    <motion.button
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay: 0.7, duration: 0.3 },
      }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      className={`drag-control group ${className} ${direction === "vertical" ? "w-8 h-2" : "w-2 h-8"
        }`}
      onMouseDown={handleMouseDown}
      aria-label="Drag to adjust"
    />
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} placement="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}

export default DragAdjust;
