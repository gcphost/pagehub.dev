import { useEditor } from "@craftjs/core";
import { AddElement } from "components/editor/Viewport/Toolbox/lib";
import { Container } from "components/selectors/Container";
import { ToolbarItem } from "../ToolbarItem";
import { useGetTypeProp, useTypeProps } from "../Tools/lib";

export const ContainerTypeInput = () => {
  const { nodeProps } = useTypeProps();

  const flexDirection = useGetTypeProp(
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
                element: (
                  <Container
                    mobile={{
                      display: "flex",
                      justifyContent: "justify-center",
                      flexDirection: "flex-col",
                      width: "w-full",
                      gap: "gap-8",
                      height: "h-auto",
                      py: "py-6",
                      px: "px-3",
                    }}
                    desktop={{}}
                    custom={{ displayName: "Column" }}
                  />
                ),
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
