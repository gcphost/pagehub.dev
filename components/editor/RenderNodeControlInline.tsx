import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Hook to detect if element is clipped outside the viewport container
 */
const useOffScreenDetection = (ref, position) => {
  const [isOffScreen, setIsOffScreen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const checkPosition = () => {
      const viewport = document.getElementById('viewport');
      if (!viewport) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();

      if (position === "left") {
        // Check if clipped on the left side of viewport
        setIsOffScreen(rect.left < viewportRect.left);
      } else if (position === "right") {
        // Check if clipped on the right side of viewport
        setIsOffScreen(rect.right > viewportRect.right);
      }
    };

    // Check initially and on scroll/resize
    checkPosition();
    const viewport = document.getElementById('viewport');
    if (viewport) {
      viewport.addEventListener('scroll', checkPosition);
    }
    window.addEventListener('resize', checkPosition);

    return () => {
      if (viewport) {
        viewport.removeEventListener('scroll', checkPosition);
      }
      window.removeEventListener('resize', checkPosition);
    };
  }, [ref, position]);

  return isOffScreen;
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
  const isOffScreen = useOffScreenDetection(ref, position);
  const [align, setAlign] = useState(initialAlign);
  const [placement, setPlacement] = useState(initialPlacement);

  useEffect(() => {
    if (!ref.current || !alt.position) return;

    const checkViewport = () => {
      // Guard against null ref (can happen if timeout fires after unmount)
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportElement = document.getElementById("viewport");
      if (!viewportElement) return;

      const viewportRect = viewportElement.getBoundingClientRect();
      const outOfViewport = rect.bottom > viewportRect.bottom || rect.top < viewportRect.top;

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

    // Check initially and after a brief delay (for rendering)
    checkViewport();
    const timeout = setTimeout(checkViewport, 100);

    return () => clearTimeout(timeout);
  }, [initialPosition, initialAlign, initialPlacement, alt]);

  // ============================================
  // SPACING CONSTANTS - adjust these to tweak positioning
  // ============================================
  // 
  // POSITIONING SYSTEM EXPLAINED:
  // - position: which edge to attach to (top/bottom/left/right)
  // - align: where along that edge (start/middle/end)
  //   * For top/bottom: start=left, middle=center, end=right
  //   * For left/right: start=top, middle=center, end=bottom
  // - placement: offset direction (not currently used in inline version)
  // - isPadding: whether control is inside (padding) or outside (margin/label)
  //
  const SPACING = {
    // Distance from element border
    INSIDE_PADDING: '6px',        // For padding controls (inside border)
    OUTSIDE_MARGIN: '-44px',      // For labels/tools (outside border) - negative = outside
    HORIZONTAL_INSET: '4px',      // Left/right positioning from edge
  };

  // Build position styles based on props
  const positionStyles: any = {
    position: 'absolute',
    zIndex: 1000,
  };

  // ============================================
  // MAIN POSITION: Top/Bottom/Left/Right edge
  // ============================================
  if (position === "top") {
    if (isPadding) {
      // Padding controls: position inside, align to top
      positionStyles.top = SPACING.INSIDE_PADDING;
    } else {
      // Labels/tools: position outside, align BOTTOM of control to top of element
      positionStyles.bottom = '100%';
      positionStyles.top = 'auto';
      positionStyles.marginBottom = '4px'; // Small gap between control and element
    }
  } else if (position === "bottom") {
    if (isPadding) {
      // Padding controls: position inside, align to bottom
      positionStyles.bottom = SPACING.INSIDE_PADDING;
    } else {
      // Labels/tools: position outside, align TOP of control to bottom of element
      positionStyles.top = '100%';
      positionStyles.bottom = 'auto';
      positionStyles.marginTop = '4px'; // Small gap between control and element
    }
  } else if (position === "left") {
    if (isPadding) {
      if (isOffScreen) {
        positionStyles.left = '46px';
      } else {
        positionStyles.left = SPACING.INSIDE_PADDING;
      }
    } else {
      if (isOffScreen) {
        // If clipped, position inside the gray padding area
        positionStyles.left = '2px';
        positionStyles.right = 'auto';
      } else {
        // Normal position outside to the left
        positionStyles.right = '100%';
        positionStyles.left = 'auto';
        positionStyles.marginRight = '4px';
      }
    }
  } else if (position === "right") {
    if (isPadding) {
      positionStyles.right = SPACING.INSIDE_PADDING;
    } else {
      if (isOffScreen) {
        // If clipped, position inside the gray padding area
        positionStyles.right = '2px';
        positionStyles.left = 'auto';
      } else {
        // Normal position outside to the right
        positionStyles.left = '100%';
        positionStyles.right = 'auto';
        positionStyles.marginLeft = '4px';
      }
    }
  }

  // ============================================
  // ALIGNMENT: Positioning along the perpendicular axis
  // ============================================
  if (["top", "bottom"].includes(position)) {
    // Horizontal alignment for elements on top/bottom edge
    if (align === "start") {
      // LEFT side
      positionStyles.left = SPACING.HORIZONTAL_INSET;
      positionStyles.right = 'auto';
    } else if (align === "middle") {
      // CENTER
      positionStyles.left = '50%';
      positionStyles.transform = 'translateX(-50%)';
    } else if (align === "end") {
      // RIGHT side
      positionStyles.right = SPACING.HORIZONTAL_INSET;
      positionStyles.left = 'auto';
    }
  } else if (["left", "right"].includes(position)) {
    // Vertical alignment for elements on left/right edge
    if (align === "start") {
      // TOP
      positionStyles.top = SPACING.HORIZONTAL_INSET;
    } else if (align === "middle") {
      // CENTER
      positionStyles.top = '50%';
      positionStyles.transform = 'translateY(-50%)';
    } else if (align === "end") {
      // BOTTOM
      positionStyles.bottom = SPACING.HORIZONTAL_INSET;
    }
  }

  return (
    <motion.div
      ref={ref}
      {...animate}
      className={`${className} pointer-events-auto`}
      data-node-control="true"
      style={{
        ...positionStyles,
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

