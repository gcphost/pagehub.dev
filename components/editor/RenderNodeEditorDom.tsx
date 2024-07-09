import ReactDOM from "react-dom";
import { RenderNodeDataStates } from "./RenderNodeDataStates";
import { RenderNodeInViewPort } from "./RenderNodeInViewPort";
import { RenderNodePortal } from "./RenderNodePortal";
import { RenderNodeTools } from "./RenderNodeTools";

export const RenderNodeEditorDom = ({ render }) => {
  const nodeItems = [
    <RenderNodeInViewPort>
      <RenderNodePortal>
        <RenderNodeTools />
      </RenderNodePortal>
    </RenderNodeInViewPort>,

    <RenderNodeDataStates />,
  ];

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
