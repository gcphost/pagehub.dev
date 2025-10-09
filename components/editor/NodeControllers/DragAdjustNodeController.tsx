import { useEditor, useNode } from "@craftjs/core";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useRecoilValue } from "recoil";
import { useIsInlineRender } from "../InlineRenderContext";
import RenderNodeControl from "../RenderNodeControl";
import RenderNodeControlInline from "../RenderNodeControlInline";
import { ViewAtom } from "../Viewport";
import DragAdjust from "../Viewport/Toolbox/DragAdjust";
import { useElementColor } from "./lib";

// Tailwind spacing values mapping
const TAILWIND_SPACING_MAP = {
  0: "0", 1: "px", 2: "0.5", 4: "1", 6: "1.5", 8: "2", 10: "2.5",
  12: "3", 14: "3.5", 16: "4", 20: "5", 24: "6", 28: "7", 32: "8",
  36: "9", 40: "10", 44: "11", 48: "12", 56: "14", 64: "16", 80: "20",
  96: "24", 112: "28", 128: "32", 144: "36", 160: "40", 176: "44",
  192: "48", 208: "52", 224: "56", 240: "60", 256: "64", 288: "72",
  320: "80", 384: "96",
};

// Map full property names to Tailwind abbreviations
const PROP_VAR_MAP = {
  "height": "h",
  "width": "w",
  "margin": "m",
  "padding": "p",
};

// Convert pixel value to Tailwind class
const pixelsToTailwindClass = (pixels: number, propVar: string): string => {
  const isNegative = pixels < 0;
  const absoluteValue = Math.abs(pixels);

  // Map propVar to Tailwind abbreviation if needed
  const tailwindProp = PROP_VAR_MAP[propVar] || propVar;

  // Find exact match or use arbitrary value
  const tailwindValue = TAILWIND_SPACING_MAP[absoluteValue];

  if (tailwindValue) {
    const prefix = isNegative ? "-" : "";
    return `${prefix}${tailwindProp}-${tailwindValue}`;
  }

  // Fallback to arbitrary value
  return `${tailwindProp}-[${pixels}px]`;
};

export const DragAdjustNodeController = (props: {
  position;
  align;
  direction;
  propVar;
  styleToUse;
  alt?: any;
  gridSnap?: number;
  tooltip?: string;
  isPadding?: boolean;
}) => {
  const { position, align, direction, propVar, styleToUse, alt, gridSnap, tooltip, isPadding } =
    props as any;

  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const dom = document.querySelector(`[node-id="${id}"]`);

  const {
    actions: { setProp },
  } = useNode();

  const view = useRecoilValue(ViewAtom);
  const isInlineRender = useIsInlineRender();

  // Store parent width for grid calculations
  const parentWidthRef = React.useRef<number | null>(null);

  // Get the current computed color from the DOM (same as border-current uses)
  const elementColor = useElementColor(dom as HTMLElement, isActive);

  // Choose which control component to use
  const ControlComponent = isInlineRender ? RenderNodeControlInline : RenderNodeControl;
  const controlClassName = isInlineRender
    ? "whitespace-nowrap items-center select-none"
    : "whitespace-nowrap items-center select-none fixed pointer-events-auto";

  //        alt={alt}
  // could use it but drl need it ond rag adjusters..

  // For inline rendering, skip AnimatePresence - it causes issues without portals
  if (isInlineRender && isActive) {
    return (
      <ControlComponent
        key={`${id}-drag-${position}`}
        position={position}
        align={align}
        placement="middle"
        hPlacement="start"
        isPadding={isPadding}
        className={controlClassName}
        style={elementColor ? { color: elementColor } : {}}
      >
        <DragAdjust
          className="text-base flex items-center"
          targetElement={dom}
          direction={direction}
          styleToUse={styleToUse}
          tooltip={tooltip}
          isPadding={isPadding}
          snapToTailwind={!gridSnap} // Disable snapping for width adjuster with grid snap
          onDragStart={() => {
            // Store parent width at drag start for consistent calculations
            if (gridSnap && dom) {
              const parent = (dom as HTMLElement)?.parentElement;
              if (parent) {
                parentWidthRef.current = parent.offsetWidth;
              }
            }
          }}
          onDragEnd={() => {
            // Clear stored parent width
            parentWidthRef.current = null;
          }}
          onChange={(value) => {
            setProp((prop) => {
              prop[view] = prop[view] || {};

              if (gridSnap) {
                // Convert pixel value to grid fraction (for width adjuster)
                // Use stored parent width for consistent calculations
                const parentWidth = parentWidthRef.current;
                if (parentWidth) {
                  const currentWidth = parseFloat(value);
                  const percentage = (currentWidth / parentWidth) * 100;

                  // Round to nearest grid fraction
                  const gridFraction = Math.max(1, Math.min(gridSnap, Math.round((percentage / 100) * gridSnap)));

                  prop[view][propVar] = `w-${gridFraction}/12`;
                }
              } else {
                // Convert snapped pixel value to Tailwind class
                const numericValue = parseFloat(value);
                const unit = value.replace(/[0-9.-]/g, '');

                if (unit === 'px') {
                  // Convert to Tailwind spacing class
                  const tailwindClass = pixelsToTailwindClass(numericValue, propVar);
                  prop[view][propVar] = tailwindClass;
                } else {
                  // Map propVar to Tailwind abbreviation for non-px units too
                  const tailwindProp = PROP_VAR_MAP[propVar] || propVar;
                  prop[view][propVar] = `${tailwindProp}-[${numericValue}${unit}]`;
                }
              }
            }, 50);
          }}
        />
      </ControlComponent>
    );
  }

  // Portal mode - use AnimatePresence
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <ControlComponent
          key={`${id}-drag-${position}`}
          position={position}
          align={align}
          alt={alt}
          placement="middle"
          hPlacement="start"
          isPadding={isPadding}
          className={controlClassName}
          style={elementColor ? { color: elementColor } : {}}
        >
          <DragAdjust
            className="text-base flex items-center"
            targetElement={dom}
            direction={direction}
            styleToUse={styleToUse}
            tooltip={tooltip}
            isPadding={isPadding}
            snapToTailwind={!gridSnap} // Disable snapping for width adjuster with grid snap
            onDragStart={() => {
              // Store parent width at drag start for consistent calculations
              if (gridSnap && dom) {
                const parent = (dom as HTMLElement)?.parentElement;
                if (parent) {
                  parentWidthRef.current = parent.offsetWidth;
                }
              }
            }}
            onDragEnd={() => {
              // Clear stored parent width
              parentWidthRef.current = null;
            }}
            onChange={(value) => {
              setProp((prop) => {
                prop[view] = prop[view] || {};

                if (gridSnap) {
                  // Convert pixel value to grid fraction (for width adjuster)
                  // Use stored parent width for consistent calculations
                  const parentWidth = parentWidthRef.current;
                  if (parentWidth) {
                    const currentWidth = parseFloat(value);
                    const percentage = (currentWidth / parentWidth) * 100;

                    // Round to nearest grid fraction
                    const gridFraction = Math.max(1, Math.min(gridSnap, Math.round((percentage / 100) * gridSnap)));

                    prop[view][propVar] = `w-${gridFraction}/12`;
                  }
                } else {
                  // Convert snapped pixel value to Tailwind class
                  const numericValue = parseFloat(value);
                  const unit = value.replace(/[0-9.-]/g, '');

                  if (unit === 'px') {
                    // Convert to Tailwind spacing class
                    const tailwindClass = pixelsToTailwindClass(numericValue, propVar);
                    prop[view][propVar] = tailwindClass;
                  } else {
                    // Map propVar to Tailwind abbreviation for non-px units too
                    const tailwindProp = PROP_VAR_MAP[propVar] || propVar;
                    prop[view][propVar] = `${tailwindProp}-[${numericValue}${unit}]`;
                  }
                }
              }, 50);
            }}
          />
        </ControlComponent>
      )}
    </AnimatePresence>
  );
};
