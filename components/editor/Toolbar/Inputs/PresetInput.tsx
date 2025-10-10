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
  inline = true,
  inputWidth = "",
  labelWidth = "",
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
      valueLabels={presets.map((_) => _.title)}
      min={0}
      max={presets.length - 1}
      inline={inline}
      inputWidth={inputWidth}
      labelWidth={labelWidth}
      onChange={(c) => {
        const preset = presets.find((_) => _.var === c || _.title === c);

        // Save the preset identifier so we know which one is selected
        changeProp({
          propKey,
          value: preset?.var || c,
          setProp,
          propType,
          view: propType === "root" ? "root" : undefined,
          query,
          actions,
          nodeId: id,
        });

        // Apply all the preset properties
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
      <option value=""></option>
      {presets?.map((_, k) => (
        <option key={k} value={_.var}>
          {_.title}
        </option>
      ))}
    </ToolbarItem>
  );
};
