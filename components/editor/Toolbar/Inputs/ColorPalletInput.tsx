import { useEditor, useNode } from "@craftjs/core";
import { ToolbarSection } from "../ToolbarSection";
import { ColorInput } from "./ColorInput";

export const ColorPalletInput = () => {
  const { nodeProps } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  const { actions, query } = useEditor();

  let value = nodeProps.pallet || [];

  if (!Array.isArray(value)) value = [];

  return (
    <ToolbarSection title="Color Pallet" full={2}>
      {value?.map((_, k) => (
        <div key={k}>
          <ColorInput
            propKey={k}
            index="pallet"
            propItemKey=""
            propType="component"
            onChange={(old, data) => {
              //  old = value[k];
              if (data.r) {
                data = `rgba(${data.r},${data.g},${data.b},${data.a})`;
              }

              const nodes = query.getNodes();

              Object.keys(nodes).forEach((_) => {
                const node = nodes[_];
                const props = node.data.props;

                Object.keys(props.root).forEach((p) => {
                  const prop = props.root[p];

                  const escapedRegexString = old?.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  );

                  if (prop.search(new RegExp(escapedRegexString, "i")) > -1) {
                    actions.setProp(
                      _,
                      (prop) => (prop.root[p] = prop.root[p].replace(old, data))
                    );
                  }
                });
              });
            }}
          />
        </div>
      ))}
    </ToolbarSection>
  );
};
