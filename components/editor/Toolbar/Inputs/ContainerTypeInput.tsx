import { Element, useEditor } from "@craftjs/core";
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
    nodeProps,
  );

  const { actions, query } = useEditor();

  return (
    <>
      <ToolbarItem
        propKey="flexDirection"
        type="select"
        labelHide={true}
        label="Flex Direction"
        cols={true}
        inline
        inputWidth="w-1/2"
        labelWidth="w-1/4"
      >
        <option value="">None</option>

        <option value="flex-col">Column</option>
        <option value="flex-row">Row</option>

        <option value="flex-col-reverse">Reverse Column</option>
        <option value="flex-row-reverse">Reverse Row</option>
      </ToolbarItem>

      <button
        className="h-fill btn btn-text w-full"
        onClick={() => {
          AddElement({
            element: (
              <Element
                canvas
                is={Container}
                canDelete={true}
                mobile={{
                  display: "flex",
                  flexDirection: "flex-col",
                  width: "w-full",
                  gap: "gap-[var(--ph-section-gap)]",
                }}
                desktop={{}}
                custom={{ displayName: "Container" }}
              />
            ),
            actions,
            query,
          });
        }}
      >
        Add Container
      </button>
    </>
  );
};
