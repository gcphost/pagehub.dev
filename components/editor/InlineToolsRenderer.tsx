import { useEditor, useNode } from "@craftjs/core";
import React, { useMemo } from "react";
import { InlineRenderContext } from "./InlineRenderContext";

/**
 * InlineToolsRenderer - Shared component that renders node tools inline
 * instead of using portals. This eliminates position calculation lag.
 * 
 * Usage in selectors:
 * 1. With craft config (requires selection):
 *    <InlineToolsRenderer craftComponent={Container} props={props} />
 * 
 * 2. Always visible with custom children:
 *    <InlineToolsRenderer alwaysVisible>
 *      <AddSectionNodeController position="bottom" align="middle" />
 *    </InlineToolsRenderer>
 */
export const InlineToolsRenderer = ({
  craftComponent,
  props: selectorProps,
  alwaysVisible = false,
  children
}: {
  craftComponent?: any;
  props?: any;
  alwaysVisible?: boolean;
  children?: React.ReactNode;
}) => {
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

  // Don't render if not in edit mode or on server
  if (!enabled || !isClient) {
    return null;
  }

  // Determine what to show based on selection state
  const showTools = isActive && tools.length > 0;
  const showChildren = alwaysVisible || isActive;

  // Don't render if nothing to show
  if (!showTools && !showChildren) {
    return null;
  }

  return (
    <InlineRenderContext.Provider value={true}>
      <div
        className="absolute inset-0 pointer-events-none"
        contentEditable={false}
        suppressContentEditableWarning={true}
        data-node-control="true"
        onMouseDown={(e) => {
          // Blur any focused contentEditable element when interacting with toolbar
          // This prevents spurious input events from DOM changes
          if (document.activeElement &&
            (document.activeElement as HTMLElement).contentEditable === 'true') {
            (document.activeElement as HTMLElement).blur();
          }
        }}
      >
        {/* Always visible children (if any) */}
        {showChildren && children}

        {/* Selection-required tools */}
        {showTools && tools.map((tool, index) => (
          <React.Fragment key={`inline-tool-${index}`}>
            {tool}
          </React.Fragment>
        ))}
      </div>
    </InlineRenderContext.Provider>
  );
};

