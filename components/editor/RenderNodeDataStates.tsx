import { useEditor, useNode } from "@craftjs/core";
import { useEffect } from "react";

export const RenderNodeDataStates = () => {
  const { isHover, name, dom, id } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { isActive, isAncestorOfSelected } = useEditor((_, query) => {
    const selectedId = query.getEvent("selected").first();
    const isActive = query.getEvent("selected").contains(id);

    let isAncestorOfSelected = false;
    if (selectedId && selectedId !== id) {
      // Check if this node is an ancestor of the selected node
      try {
        const selectedNode = query.node(selectedId).get();
        let currentParentId = selectedNode?.data?.parent;

        while (currentParentId) {
          if (currentParentId === id) {
            isAncestorOfSelected = true;
            break;
          }
          const parentNode = query.node(currentParentId).get();
          currentParentId = parentNode?.data?.parent;
        }
      } catch (e) {
        // Node not found or error traversing
      }
    }

    return { isActive, isAncestorOfSelected };
  });

  useEffect(() => {
    if (!dom) return;

    dom.setAttribute("data-enabled", "true");

    if (dom && name !== "Background") {
      if (isActive) {
        dom.setAttribute("data-selected", "true");
      } else {
        dom.removeAttribute("data-selected");
      }

      if (isAncestorOfSelected) {
        dom.setAttribute("data-ancestor", "true");
      } else {
        dom.removeAttribute("data-ancestor");
      }

      if (isHover) dom.setAttribute("data-hover", "true");
      else dom.removeAttribute("data-hover");
    }
  }, [isActive, isHover, isAncestorOfSelected, enabled, dom, name]);

  return null;
};
