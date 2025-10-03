import { ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import { getRect } from "components/editor/Viewport/useRect";
import { useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Wrap } from "../ToolbarStyle";
import { ColorPickerAtom } from "../Tools/ColorPickerDialog";
import { useDialog } from "../Tools/lib";

export const bgAndVal = ({ value, prefix }) => {
  let val = value ? value?.split(`${prefix}-`).filter((_) => _)[0] : null;
  let bg = val;

  if (
    val &&
    !val.includes("-") &&
    !val.includes("[") &&
    (val.includes("#") || val.includes("rgba"))
  )
    bg = `[${val}]`;

  if (bg?.includes("[")) val = bg.replace("[", "").replace("]", "");

  return [bg, val];
};

export const ColorInput = (__props: any) => {
  const {
    propKey,
    label = "",
    prefix = "",
    index = null,
    propItemKey = "",
    propType = "class",
    showPallet = true,
    onChange = () => { },
    labelHide = false,
  } = __props;

  const [dialog, setDialog] = useRecoilState(ColorPickerAtom);
  const view = useRecoilValue(ViewAtom);

  const { actions, query } = useEditor();

  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
  }));

  const value = getProp(__props, view, nodeProps) || "";

  // Get palette for resolving references
  const palette = (() => {
    try {
      const rootNode = query.node(ROOT_NODE).get();
      return rootNode?.data?.props?.pallet || [];
    } catch {
      return [];
    }
  })();

  // Resolve palette references for display
  const resolveValueForDisplay = (val: string) => {
    if (val && val.includes("palette:")) {
      const match = val.match(/palette:(.+)$/);
      if (match) {
        const paletteName = match[1];
        const paletteColor = palette.find((p) => p.name === paletteName);
        if (paletteColor) {
          // The palette color might be a full Tailwind class (e.g., "bg-blue-600")
          // or just a color value (e.g., "blue-600" or "#FF0000")
          // If it already has the prefix, return as-is, otherwise add it
          const colorValue = paletteColor.color;
          if (prefix && !colorValue.startsWith(prefix)) {
            return `${prefix}-${colorValue}`;
          }
          return colorValue;
        }
      }
    }
    return val;
  };

  const displayValue = resolveValueForDisplay(value);
  const [bg, cpVAl] = bgAndVal({ value: displayValue, prefix });

  const changed = (data) => {
    let val = data.value;

    if (val) {
      if (data.type === "palette") {
        // Store palette reference with prefix (e.g., "bg-palette:Brand")
        val = prefix ? `${prefix}-${data.value}` : data.value;
      } else if (data.type === "hex") {
        val = prefix ? `${prefix}-[${val}]` : `${val}`;
      } else if (data.type === "rgb") {
        val = `rgba(${val.r},${val.g},${val.b},${val.a})`;
        val = prefix ? `${prefix}-[${val}]` : val;
      } else {
        val = prefix ? `${prefix}-${val}` : val;
      }
    }

    changeProp({
      propKey,
      index,
      propItemKey,
      propType,
      value: val,
      setProp,
      query,
      actions,
      nodeId: id,
    });

    onChange(cpVAl, val);
  };

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <div ref={ref}>
      <Wrap
        props={{ label, labelHide }}
        index={index}
        lab={value}
        propType={propType}
        propKey={propKey}
        propItemKey={propItemKey}
      >
        <button
          className={`w-full h-12 rounded-md cursor-pointer border input-hover bg-${bg}`}
          onClick={(e) => {
            setDialog({
              enabled: !dialog.enabled,
              value: cpVAl,
              prefix,
              changed,
              showPallet,
              propKey,
              e: getRect(ref.current),
            });
          }}
        ></button>
      </Wrap>
    </div>
  );
};
