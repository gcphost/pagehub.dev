import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Check if element is clipped outside the viewport container
 * Returns true immediately without state management
 */
const checkIfOffScreen = (ref, position) => {
  if (!ref.current) return false;

  const viewport = document.getElementById('viewport');
  if (!viewport) return false;

  const rect = ref.current.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();

  if (position === "left" || position === "right") {
    // For left/right, check if clipped horizontally OR vertically (top)
    const clippedHorizontally = position === "left"
      ? rect.left < viewportRect.left
      : rect.right > viewportRect.right;
    const clippedAtTop = rect.top < viewportRect.top;
    return clippedHorizontally || clippedAtTop;
  } else if (position === "top") {
    // Check if clipped on the top side of viewport
    return rect.top < viewportRect.top;
  } else if (position === "bottom") {
    // Check if clipped on the bottom side of viewport
    return rect.bottom > viewportRect.bottom;
  }

  return false;
};

/**
 * RenderNodeControlInline - Simplified version of RenderNodeControl
 * that uses CSS positioning instead of calculating positions.
 * 
 * This is used when controls are rendered inline within the element
 * instead of being portaled.
 */
export const RenderNodeControlInline = ({
  position: initialPosition, // "top" | "bottom" | "left" | "right"
  align: initialAlign, // "start" | "middle" | "end"
  placement: initialPlacement = "start", // for vertical offset
  hPlacement = "start", // for horizontal offset  
  isPadding = false,
  children = null,
  className = "",
  animate = {},
  style = {},
  alt = {
    position: "",
    placement: "",
    align: "",
  },
  ...props
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState(initialPosition);
  const [align, setAlign] = useState(initialAlign);
  const [placement, setPlacement] = useState(initialPlacement);

  // Check if off-screen (like RenderNodeControl does it - inline, no state)
  const isOffScreen = checkIfOffScreen(ref, position);

  useEffect(() => {
    if (!ref.current) return;

    let scrollTimeout;

    const checkViewport = () => {
      // Guard against null ref (can happen if timeout fires after unmount)
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportElement = document.getElementById("viewport");
      if (!viewportElement) return;

      const viewportRect = viewportElement.getBoundingClientRect();
      const outOfViewport = rect.bottom > viewportRect.bottom || rect.top < viewportRect.top;

      // If alt prop is provided, use it
      if (outOfViewport && alt.position) {
        setPosition(alt.position);
        if (alt.placement) setPlacement(alt.placement);
        if (alt.align) setAlign(alt.align);
      } else {
        setPosition(initialPosition);
        setAlign(initialAlign);
        setPlacement(initialPlacement);
      }
    };

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout - only update position after scroll stops for 500ms
      scrollTimeout = setTimeout(() => {
        checkViewport();
      }, 200);
    };

    // Check immediately on mount
    checkViewport();

    // Listen for scroll events with debounce
    const viewportElement = document.getElementById("viewport");
    if (viewportElement) {
      viewportElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (viewportElement) {
        viewportElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [initialPosition, initialAlign, initialPlacement, alt]);

  // ============================================
  // SIMPLE BOUNDING BOX POSITIONING
  // ============================================
  // - Outside: 2px outside the border
  // - Inside: 2px inside the border
  // - Use Tailwind classes for positioning

  const classes = ['absolute', 'pointer-events-none', 'z-[1000]'];

  // Edge positioning
  if (position === "top") {
    if (isPadding) {
      classes.push('top-0.5', 'left-0', 'right-0'); // Inside top, 2px from edge
    } else {
      if (isOffScreen) {
        classes.push('top-full', 'left-0', 'right-0', 'mt-0'); // Clipped: flip to bottom
      } else {
        classes.push('bottom-full', 'left-0', 'right-0', 'mb-0'); // Outside top, sits above
      }
    }
  } else if (position === "bottom") {
    if (isPadding) {
      classes.push('bottom-0.5', 'left-0', 'right-0'); // Inside bottom
    } else {
      if (isOffScreen) {
        classes.push('bottom-full', 'left-0', 'right-0', 'mb-0'); // Clipped: flip to top
      } else {
        classes.push('top-full', 'left-0', 'right-0', 'mt-0'); // Outside bottom, sits below
      }
    }
  } else if (position === "left") {
    if (isPadding) {
      classes.push('left-0.5', 'top-0', 'bottom-0'); // Inside left
    } else {
      if (isOffScreen) {
        classes.push('left-0.5', 'top-0'); // Clipped: move inside, anchor to top only
      } else {
        classes.push('right-full', 'top-0', 'bottom-0', 'mr-0'); // Outside left
      }
    }
  } else if (position === "right") {
    if (isPadding) {
      classes.push('right-0.5', 'top-0', 'bottom-0'); // Inside right
    } else {
      if (isOffScreen) {
        classes.push('right-0.5', 'top-0'); // Clipped: move inside, anchor to top only
      } else {
        classes.push('left-full', 'top-0', 'bottom-0', 'ml-0'); // Outside right
      }
    }
  }

  // Alignment using flex
  if (["top", "bottom"].includes(position)) {
    classes.push('flex', 'items-end'); // Items align to bottom (extend downward)
    if (align === "start") {
      classes.push('justify-start');
      if (!isPadding) classes.push(''); // Only add padding for outside controls
    } else if (align === "middle") {
      classes.push('justify-center');
    } else if (align === "end") {
      classes.push('justify-end');
      if (!isPadding) classes.push(''); // Only add padding for outside controls
    }
  } else if (["left", "right"].includes(position)) {
    classes.push('flex', 'flex-col');
    if (align === "start") {
      classes.push('justify-start');
      if (!isPadding) classes.push(''); // Only add padding for outside controls
    } else if (align === "middle") {
      // If middle-aligned but would clip, align to start instead
      if (isOffScreen) {
        classes.push('justify-start');
      } else {
        classes.push('justify-center');
      }
    } else if (align === "end") {
      classes.push('justify-end');
      if (!isPadding) classes.push(''); // Only add padding for outside controls
    }
  }

  return (
    <motion.div
      ref={ref}
      {...animate}
      className={`${classes.join(' ')} ${className}`}
      data-node-control="true"
      style={{
        // Reset/lock styles to prevent inheritance from parent
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textAlign: 'left',
        textTransform: 'none',
        textDecoration: 'none',
        color: 'inherit',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default RenderNodeControlInline;


