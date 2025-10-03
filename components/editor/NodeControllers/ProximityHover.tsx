import { useEditor, useNode } from "@craftjs/core";
import { useEffect, useState } from "react";

const HOVER_MARGIN = 60; // pixels

export const ProximityHover = () => {
  const { id, dom, isContainer } = useNode((node) => ({
    dom: node.dom,
    isContainer: node.data.name === "Container" || node.data.displayName === "Container",
  }));

  const { isSelected } = useEditor((_, query) => ({
    isSelected: query.getEvent("selected").contains(id),
  }));

  const [isProximityHover, setIsProximityHover] = useState(false);

  useEffect(() => {
    if (!dom || !isContainer) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = dom.getBoundingClientRect();

        // Expand the rect by HOVER_MARGIN
        const expandedRect = {
          top: rect.top - HOVER_MARGIN,
          left: rect.left - HOVER_MARGIN,
          bottom: rect.bottom + HOVER_MARGIN,
          right: rect.right + HOVER_MARGIN,
        };

        // Check if mouse is within expanded bounds
        const isWithinBounds =
          e.clientX >= expandedRect.left &&
          e.clientX <= expandedRect.right &&
          e.clientY >= expandedRect.top &&
          e.clientY <= expandedRect.bottom;

        setIsProximityHover(isWithinBounds);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dom, isContainer]);

  // Apply hover attribute based on proximity (but not if selected)
  useEffect(() => {
    if (!dom || !isContainer || isSelected) return;

    if (isProximityHover) {
      dom.setAttribute("data-hover", "true");
    } else {
      // Only remove if we're not actually hovering (let normal hover take precedence)
      const actuallyHovering = dom.matches(":hover");
      if (!actuallyHovering) {
        dom.removeAttribute("data-hover");
      }
    }
  }, [isProximityHover, dom, isSelected, isContainer]);

  return null;
};

