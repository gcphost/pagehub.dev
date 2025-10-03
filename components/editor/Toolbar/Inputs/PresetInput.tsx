import { useEditor, useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { ToolbarItem } from "../ToolbarItem";

export const PresetInput = ({
  presets,
  type = "select",
  label = "Preset Style",
  propKey = "preset",
  propType = "root",
  labelHide = false,
  wrap = "",
}) => {
  const { actions, query } = useEditor();

  const {
    actions: { setProp },
    id,
  } = useNode((node) => ({ id: node.id }));

  return (
    <ToolbarItem
      propKey={propKey}
      propType={propType}
      type={type}
      label={label}
      wrap={wrap}
      labelHide={labelHide || type !== "slider"}
      valueLabels={presets.map((_) => _.var)}
      min={0}
      max={presets.length - 1}
      onChange={(c) => {
        const preset = presets.find((_) => _.var === c);

        ["root", "mobile", "desktop"].forEach((view) => {
          if (!preset || !preset.hasOwnProperty(view)) return;
          Object.keys(preset[view]).forEach((_var) =>
            changeProp({
              propKey: _var,
              value: preset[view][_var],
              setProp,
              view,
              query,
              actions,
              nodeId: id,
            })
          );
        });
      }}
    >
      <option value="">Size</option>
      {presets?.map((_, k) => (
        <option key={k} value={_.var}>
          {_.title}
        </option>
      ))}
    </ToolbarItem>
  );
};
