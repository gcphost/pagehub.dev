import { useEditor, useNode } from "@craftjs/core";
import React, { useMemo } from "react";
import { InlineRenderContext } from "./InlineRenderContext";

/**
 * InlineToolsRenderer - Shared component that renders node tools inline
 * instead of using portals. This eliminates position calculation lag.
 * 
 * Usage in selectors:
 * const toolsRenderer = <InlineToolsRenderer craftComponent={Container} props={props} />
 * Then include {toolsRenderer} as a child of your element
 */
export const InlineToolsRenderer = ({ craftComponent, props: selectorProps }) => {
  const { id } = useNode();
  const { enabled, isActive } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    isActive: query.getEvent("selected").contains(id),
  }));

  // Don't render on server (SSR)
  const isClient = typeof window !== 'undefined';

  // Get tools from craft config (same pattern as RenderNodeTools)
  // Memoize to avoid recalculating on every render
  // MUST be called before any early returns to follow rules of hooks
  const tools = useMemo(
    () => craftComponent?.craft?.props?.tools?.(selectorProps) || [],
    [craftComponent, selectorProps]
  );

  // Don't render if not in edit mode, not selected, or on server
  if (!enabled || !isClient || !isActive) {
    return null;
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <InlineRenderContext.Provider value={true}>
      <div
        className="absolute inset-0 pointer-events-none"
        contentEditable={false}
        suppressContentEditableWarning={true}
        onMouseDown={(e) => {
          // Blur any focused contentEditable element when interacting with toolbar
          // This prevents spurious input events from DOM changes
          if (document.activeElement &&
            (document.activeElement as HTMLElement).contentEditable === 'true') {
            (document.activeElement as HTMLElement).blur();
          }
        }}
        style={{
          zIndex: 9999,
          overflow: 'visible', // Allow controls to position outside the element
          // Reset styles to prevent inheritance
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 'normal',
          lineHeight: 'normal',
          letterSpacing: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
          color: '#000',
        }}
      >
        {tools.map((tool, index) => (
          <React.Fragment key={`inline-tool-${index}`}>
            {tool}
          </React.Fragment>
        ))}
      </div>
    </InlineRenderContext.Provider>
  );
};

