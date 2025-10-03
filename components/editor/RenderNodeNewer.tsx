import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { GapDragControl } from "./NodeControllers/GapDragControl";
import { ProximityHover } from "./NodeControllers/ProximityHover";
import { RenderNodeDataStates } from "./RenderNodeDataStates";
import { RenderNodeInViewPort } from "./RenderNodeInViewPort";
import { RenderNodePortal } from "./RenderNodePortal";
import { RenderNodeTools } from "./RenderNodeTools";

export const RenderNodeNewer = ({ render }) => {
  const [show, setShow] = useState(false);

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const nodeItems = [
    <RenderNodeInViewPort key="renderViewPort">
      <RenderNodePortal>
        <RenderNodeTools />
      </RenderNodePortal>
    </RenderNodeInViewPort>,

    <RenderNodeDataStates key="renderDataStates" />,
    <ProximityHover key="proximityHover" />,
    <GapDragControl key="gapDragControl" />,
  ];

  useEffect(() => {
    const checkContainer = () => {
      const container = document.querySelector('[data-container="true"]');
      if (container) {
        setShow(true);
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkContainer()) return;

    // If not found, use MutationObserver to wait for it
    const observer = new MutationObserver(() => {
      if (checkContainer()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  if (!enabled) return render;

  return (
    <>
      {render}

      {show &&
        ReactDOM.createPortal(
          nodeItems.map((tool: any, index) => ({ ...tool, key: index })),
          document.querySelector('[data-container="true"]')
        )}
    </>
  );
};
