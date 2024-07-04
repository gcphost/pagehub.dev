import { useEditor } from "@craftjs/core";
import { AddElement, Tools } from "components/editor/Viewport/Toolbox/lib";
import { ToolbarItem } from "../ToolbarItem";
import { getTypeProp, typeProps } from "../Tools/lib";

export const ContainerTypeInput = () => {
  const { nodeProps } = typeProps();

  const flexDirection = getTypeProp(
    {
      propKey: "flexDirection",
    },
    nodeProps
  );

  const { actions, query } = useEditor();

  return (
    <>
      <ToolbarItem
        propKey="flexDirection"
        type="select"
        labelHide={true}
        label="Container Type"
        cols={true}
      >
        <option value="">None</option>

        <option value="flex-col">Column</option>
        <option value="flex-row">Row</option>

        <option value="flex-col-reverse">Reverse Column</option>
        <option value="flex-row-reverse">Reverse Row</option>
      </ToolbarItem>

      {["flex-row", "flex-row-reverse"].includes(flexDirection) && (
        <div>
          <button
            className="h-fill w-full btn btn-text"
            onClick={() => {
              AddElement({
                element: Tools.rowContainer,
                actions,
                query,
              });
            }}
          >
            Add Column
          </button>
        </div>
      )}
    </>
  );
};
