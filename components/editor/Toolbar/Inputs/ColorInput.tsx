import { ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import { getRect } from "components/editor/Viewport/useRect";
import { useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import colors from "tailwindcss/lib/public/colors";
import { usePalette } from "utils/PaletteContext";
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

  // Try to get palette from context first, fallback to ROOT_NODE
  const contextPalette = usePalette();
  const palette = useMemo(() => {
    // Use context palette if available
    if (contextPalette && contextPalette.length > 0) {
      return contextPalette;
    }

    // Fallback to ROOT_NODE
    try {
      const rootNode = query.node(ROOT_NODE).get();
      return rootNode?.data?.props?.pallet || [];
    } catch {
      return [];
    }
  }, [contextPalette, query]);

  // Resolve palette references for display
  // This handles backward compatibility for old "palette:" format
  const resolveValueForDisplay = (val: string) => {
    if (val && val.includes("palette:")) {
      // Convert old palette: format to new CSS variable format
      const match = val.match(/palette:(.+)$/);
      if (match) {
        const paletteName = match[1];
        const varName = paletteName
          .replace(/([A-Z])/g, "-$1")
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/^-/, "");

        // Extract prefix if present (e.g., "text-palette:Primary" → "text-")
        const currentPrefix = val.split('-palette:')[0];
        const usePrefix = currentPrefix && currentPrefix !== val ? currentPrefix : prefix;

        return usePrefix ? `${usePrefix}-[var(--ph-${varName})]` : `var(--ph-${varName})`;
      }
    }
    return val;
  };

  const displayValue = resolveValueForDisplay(value);
  const [bg, cpVAl] = bgAndVal({ value: displayValue, prefix });

  // Get the actual color value for inline style
  const getBackgroundStyle = () => {
    if (!bg) {
      return { backgroundColor: "#e5e7eb" };
    }

    // Handle CSS variables (e.g., "var(--ph-primary)")
    if (bg.includes("var(--ph-")) {
      const varMatch = bg.match(/var\(--ph-([^)]+)\)/);
      if (varMatch) {
        const varName = varMatch[1]; // e.g., "primary", "primary-text"

        // Convert kebab-case back to title case for palette lookup
        const paletteName = varName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Look up in palette
        const paletteColor = palette.find((p) => p.name === paletteName);
        if (paletteColor) {
          // Get the actual color value, stripping any Tailwind prefixes
          let colorValue = paletteColor.color;
          const prefixesToStrip = ["bg-", "text-", "border-", "ring-", "from-", "to-", "via-"];
          for (const stripPrefix of prefixesToStrip) {
            if (colorValue.startsWith(stripPrefix)) {
              colorValue = colorValue.substring(stripPrefix.length);
              break;
            }
          }

          // If it's a Tailwind color class, resolve it
          if (colorValue.includes("-")) {
            const [colorName, shade] = colorValue.split("-");
            const colorObj = colors[colorName];
            if (colorObj && typeof colorObj === "object" && colorObj[shade]) {
              return { backgroundColor: colorObj[shade] };
            }
          }

          // Otherwise use the value directly (could be hex/rgba)
          return { backgroundColor: colorValue };
        }
      }
    }

    // If it's a hex/rgba value (wrapped in brackets or not)
    if (bg.includes("#") || bg.includes("rgba") || bg.includes("rgb")) {
      const cleanColor = bg.replace("[", "").replace("]", "");
      return { backgroundColor: cleanColor };
    }

    // For Tailwind color classes, parse and look up the actual hex value
    // Handle formats like "blue-500", "gray-50", etc.
    const parts = bg.split("-");

    // Special cases
    if (bg === "white") return { backgroundColor: "#ffffff" };
    if (bg === "black") return { backgroundColor: "#000000" };
    if (bg === "transparent") return { backgroundColor: "transparent" };

    // Standard Tailwind colors (e.g., "blue-500")
    if (parts.length === 2) {
      const [colorName, shade] = parts;
      const colorObj = colors[colorName];
      if (colorObj && typeof colorObj === "object" && colorObj[shade]) {
        return { backgroundColor: colorObj[shade] };
      }
    }

    // Fallback to gray
    return { backgroundColor: "#e5e7eb" };
  };

  const finalStyle = getBackgroundStyle();

  const changed = (data) => {
    let val = data.value;

    if (val) {
      if (data.type === "palette") {
        // Convert palette reference to CSS variable format
        // e.g., "palette:Primary Text" → "text-[var(--ph-primary-text)]"
        const paletteName = data.value.replace('palette:', '');
        const varName = paletteName
          .replace(/([A-Z])/g, "-$1")
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/^-/, "");

        val = prefix ? `${prefix}-[var(--ph-${varName})]` : `var(--ph-${varName})`;
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

  // For the color picker, pass the original value if it's a palette reference
  // so the picker can highlight the selected palette color
  const pickerValue = value && value.includes("palette:") ? value : cpVAl;

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
          className="input-color"
          style={finalStyle}
          onClick={(e) => {
            setDialog({
              enabled: !dialog.enabled,
              value: pickerValue,
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
