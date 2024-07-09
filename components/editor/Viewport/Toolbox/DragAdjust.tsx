import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function DragAdjust({
  targetElement,
  direction = 'vertical',
  unit = 'px',
  showButton = true,
  className = '',
  styleToUse = 'marginTop',
  children = null,
  onChange = (value) => {},
}) {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [initialMarginTop, setInitialMarginTop] = useState(null);
  const [initialWidth, setInitialWidth] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    const computedStyle = window.getComputedStyle(targetElement);
    if (direction === 'vertical') {
      setInitialMarginTop(parseFloat(computedStyle[styleToUse]));
    } else if (direction === 'horizontal') {
      setInitialWidth(parseFloat(computedStyle.width));
    }
    targetRef.current = targetElement;
    document.body.style.cursor = 'cursor-move';
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e) => {
    if (dragging && targetRef.current) {
      if (direction === 'vertical') {
        const dragDistance = e.clientY - startY;
        const newMarginTop = initialMarginTop + dragDistance;

        targetRef.current.style[styleToUse] = `${newMarginTop}${unit}`;

        onChange(targetRef.current.style[styleToUse]);

        //  document.body.classList.add("cursor-move");
      } else if (direction === 'horizontal') {
        const dragDistance = e.clientX - startX;
        const newWidth = initialWidth + dragDistance;
        targetRef.current.style[styleToUse] = `${newWidth}${unit}`;

        onChange(targetRef.current.style[styleToUse]);
        // document.body.classList.remove("cursor-move");
      }
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 0.9,
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
      whileTap={{ scale: 1 }}
      className={`drag group flex flex-row gap-3 items-center p-1 rounded-sm border cursor-move ${className}`}
      onMouseDown={handleMouseDown}
    >
      {children}
    </motion.div>
  );
}

export default DragAdjust;
