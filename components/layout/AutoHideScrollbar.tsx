import React, { useEffect, useRef, useState } from "react";

interface AutoHideScrollbarProps {
  children: React.ReactNode;
  className?: string;
  hideDelay?: number; // milliseconds before hiding scrollbar
  showDelay?: number; // milliseconds before showing scrollbar on hover
  id?: string; // for jump functionality
}

export const AutoHideScrollbar: React.FC<AutoHideScrollbarProps> = ({
  children,
  className = "",
  hideDelay = 2000, // 2 seconds default
  showDelay = 100, // 100ms default
  id,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = () => {
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to hide scrollbar
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, hideDelay);
  };

  const handleMouseEnter = () => {
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Show scrollbar immediately on hover
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Hide scrollbar after delay when leaving
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, showDelay);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const shouldShowScrollbar = isScrolling || isHovered;

  return (
    <div
      id={id}
      className={`overflow-visible  transition-all duration-300 ease-in-out ${shouldShowScrollbar
        ? "scrollbar"
        : "scrollbar-hide"
        } ${className}`}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
