import { useEditor } from "@craftjs/core";
import ReactDOM from "react-dom";
import { RenderNodeDataStates } from "./RenderNodeDataStates";
import { RenderNodeInViewPort } from "./RenderNodeInViewPort";
import { RenderNodePortal } from "./RenderNodePortal";
import { RenderNodeTools } from "./RenderNodeTools";

export const RenderNodeNewer = ({ render }) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const nodeItems = [
    <RenderNodeInViewPort>
      <RenderNodePortal>
        <RenderNodeTools />
      </RenderNodePortal>
    </RenderNodeInViewPort>,

    <RenderNodeDataStates />,
  ];

  if (!enabled) return render;

  if (typeof window === "undefined") {
    return render;
  }

  return (
    <>
      {render}

      {ReactDOM.createPortal(
        nodeItems.map((tool, index) => ({ ...tool, key: index })),
        document.querySelector('[data-container="true"]')
      )}
    </>
  );
};
