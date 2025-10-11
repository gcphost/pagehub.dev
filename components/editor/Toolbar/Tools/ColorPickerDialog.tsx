import { ROOT_NODE, useEditor } from "@craftjs/core";
import { SketchPicker } from "@hello-pangea/color-picker";

import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { BsEyedropper } from "react-icons/bs";
import {
  TbCaretRight,
  TbColorPicker,
  TbDeviceFloppy,
  TbPalette,
  TbX,
} from "react-icons/tb";
import { atom, useRecoilState } from "recoil";
import useEyeDropper from "use-eye-dropper";
import { getColorPallet } from "utils/tailwind";
import { Dialog } from "./Dialog";

const presetColors = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
  "#FFFFFF",
  "transparent",
];

export const ColorPalletAtom = atom({
  key: "colorPallet",
  default: [],
});

export const ColorPickerAtom = atom({
  key: "colorPicker",
  default: {
    enabled: false,
    value: "",
    prefix: "",
    changed: null,
    showPallet: false,
    e: null,
    propKey: null,
  } as any,
});

export const uloVariants = {
  open: {
    opacity: 1,
    display: "flex",
    width: "unset",
    transition: {
      staggerDirection: 1,
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    width: "1300px",
    display: "none",
    opacity: 1,
    transition: {
      staggerDirection: 1,
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  transition: { type: "tween", duration: 3.4 },

  initial: { display: "none", opacity: 0, width: 0 },
};

const Item = ({
  animate = true,
  tooltip,
  title,
  value,
  changed,
  type = "class",
  children = null,
  style = {},
  selected = false,
  onClick = (e, value) => {
    e.stopPropagation();
    changed({ type, value });
  },
  onMouseOut = (e, value) => {},
  onMouseOver = (e, value) => {},
}) => (
  <motion.button
    whileHover={
      animate
        ? {
            scale: 2,
            transition: { duration: 0.2 },
            zIndex: 999,
          }
        : {}
    }
    initial={{ zIndex: 1 }}
    title={title}
    className={`relative size-5 cursor-pointer rounded border-2 ${
      selected ? "border-accent" : "border-border"
    }`}
    style={{ backgroundColor: value, ...style }}
    onClick={(e) => onClick(e, value)}
    onMouseOver={(e) => onMouseOver(e, value)}
    onFocus={(e) => onMouseOver(e, value)}
    tabIndex={0}
    onMouseLeave={(e) => onMouseOut(e, value)}
    key="colorpicker"
  >
    {children}
  </motion.button>
);

const hexToRGBA = (hex, alpha) =>
  `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(
    hex.slice(3, 5),
    16,
  )},${parseInt(hex.slice(5, 7), 16)},${alpha})`;

export const ColorPickerDialog = () => {
  const pallet = getColorPallet();

  const [colorPicker, setColorPicker] = useRecoilState(ColorPickerAtom);
  const [colorPallet, setColorPallet] = useRecoilState(ColorPalletAtom);
  const [namedPalette, setNamedPalette] = useState<
    Array<{ name: string; color: string }>
  >([]);
  const [showFullPicker, setShowFullPicker] = useState(false);

  // Just use preset colors, not palette colors
  const preset = presetColors;

  const { open, isSupported } = useEyeDropper();
  const [show, setShow] = useState(false);

  const { actions, query } = useEditor();

  // Auto-show full picker if no palette colors exist OR if showPallet is false
  const hasPaletteColors = namedPalette.length > 0;
  const shouldShowPalette =
    colorPicker.showPallet !== false && hasPaletteColors;

  useEffect(() => {
    const node = query.node(ROOT_NODE).get();
    if (!node) return;
    const nodePrsets = node.data.props.pallet || [];

    // Store the full named palette
    if (Array.isArray(nodePrsets) && nodePrsets.length > 0) {
      const palette = nodePrsets.filter(
        (p) => p && typeof p === "object" && p.name && p.color,
      );
      setNamedPalette(palette);

      // Also extract just colors for backward compatibility
      const colors = palette.map((p) => p.color);
      setColorPallet(colors);
    } else {
      setNamedPalette([]);
      setColorPallet([]);
    }
  }, [colorPicker.enabled, query, setColorPallet]);

  const saveToPallet = () => {
    const data = colorPicker.value;
    let val = data;

    if (!data) {
      return; // No value to save
    }

    if (typeof data === "object" && data.r !== undefined) {
      val = `rgba(${data.r},${data.g},${data.b},${data.a})`;
    } else if (typeof data === "string") {
      val = data;
    } else {
      return; // Invalid data format
    }

    actions.setProp(ROOT_NODE, (props) => {
      const currentPallet = props.pallet || [];

      // Always use NamedColor format - add new color
      const existingIndex = currentPallet.findIndex((p) => p.color === val);
      if (existingIndex === -1) {
        props.pallet = [
          { name: `Color ${currentPallet.length + 1}`, color: val },
          ...currentPallet,
        ];
      }

      // Update color pallet for preview
      const colors = props.pallet.map((p) => p.color);
      setColorPallet(colors);
    });

    setColorPicker({ enabled: false });
  };

  const pickColor = () => {
    open()
      .then((color) => {
        const value = hexToRGBA(color.sRGBHex, 1);
        changed({ type: "hex", value });

        // closed();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const changed = (value) => {
    if (colorPicker.changed) {
      setColorPicker({ ...colorPicker, value: value.value });
      colorPicker.changed(value);
    }
  };

  return (
    <Dialog
      dialogAtom={ColorPickerAtom}
      dialogName="colorPicker"
      value={colorPicker.value}
      width="auto"
      zIndex={99999}
    >
      <div className="flex flex-row rounded-lg bg-background">
        <div
          className="flex w-full max-w-[320px] flex-col gap-0"
          onMouseOver={() => setShow(false)}
          onFocus={() => setShow(false)}
          tabIndex={0}
        >
          {
            <div className="flex w-full flex-row items-center justify-between gap-3 border-b border-border bg-accent px-3 py-2 text-accent-foreground">
              <div className="flex flex-row items-center gap-2">
                <button
                  className="flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    setColorPicker({
                      ...colorPicker,
                      changed: null,
                      enabled: false,
                    });
                  }}
                >
                  <TbX />
                </button>
              </div>

              <div className="flex flex-row items-center gap-1.5">
                {/* Show picker toggle when palette colors exist and showPallet is true */}
                {shouldShowPalette && (
                  <Tooltip
                    content={
                      showFullPicker ? "Show Page Colors" : "Show Color Picker"
                    }
                  >
                    <button
                      className="flex cursor-pointer items-center justify-center rounded-md p-1 text-base text-accent-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setShowFullPicker(!showFullPicker)}
                    >
                      {showFullPicker ? <TbPalette /> : <TbColorPicker />}
                    </button>
                  </Tooltip>
                )}

                {/* Only show save and dropper when full picker is visible */}
                {(!shouldShowPalette || showFullPicker) && (
                  <>
                    {/* Hide save to pallet button when editing from the palette modal */}
                    {!colorPicker.propKey?.startsWith("pallet-") && (
                      <Tooltip content="Save to pallet">
                        <button
                          className="flex cursor-pointer items-center justify-center rounded-md p-1 text-base text-accent-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => saveToPallet()}
                        >
                          <TbDeviceFloppy />
                        </button>
                      </Tooltip>
                    )}

                    {isSupported() && (
                      <Tooltip content="Color Picker" arrow={false}>
                        <button
                          onClick={pickColor}
                          className="flex cursor-pointer items-center justify-center rounded-md p-1 text-accent-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <BsEyedropper />
                        </button>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
            </div>
          }

          {/* Named Palette Colors */}
          {shouldShowPalette && !showFullPicker && (
            <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto border px-3 py-1.5 pb-32">
              {namedPalette.map((paletteColor, index) => {
                // Check if current value is this palette color
                // Value could be "text-palette:Primary" or "bg-palette:Primary" etc
                const valueStr =
                  typeof colorPicker.value === "string"
                    ? colorPicker.value
                    : "";
                const isPaletteRef = valueStr.includes("palette:");

                // More robust palette matching - extract palette name from value
                let isSelected = false;
                if (isPaletteRef) {
                  // Extract the palette name from strings like "text-palette:Alternate Text"
                  const match = valueStr.match(/palette:(.+)$/);
                  if (match) {
                    const extractedName = match[1].trim();
                    const paletteName = paletteColor.name.trim();
                    isSelected = extractedName === paletteName;
                  }
                } else {
                  // Direct color value comparison
                  isSelected =
                    colorPicker.value === paletteColor.color ||
                    (typeof colorPicker.value === "object" &&
                      colorPicker.value?.r &&
                      paletteColor.color ===
                        `rgba(${colorPicker.value.r},${colorPicker.value.g},${colorPicker.value.b},${colorPicker.value.a})`);
                }

                const isTailwindClass =
                  !paletteColor.color.includes("rgba") &&
                  !paletteColor.color.startsWith("#");

                // For Tailwind classes, ensure they have bg- prefix for display
                const displayColor =
                  isTailwindClass && !paletteColor.color.startsWith("bg-")
                    ? `bg-${paletteColor.color}`
                    : paletteColor.color;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      // Store the palette reference, not the color value
                      changed({
                        type: "palette",
                        value: `palette:${paletteColor.name}`,
                      });
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted ${
                      isSelected
                        ? "bg-accent text-accent-foreground ring-2 ring-primary"
                        : ""
                    }`}
                  >
                    <div
                      className={`h-8 w-full rounded border-2 border-border ${isTailwindClass ? displayColor : ""}`}
                      style={{
                        backgroundColor: !isTailwindClass
                          ? paletteColor.color
                          : undefined,
                      }}
                    />
                    <span className="w-full truncate text-center text-xs font-medium text-foreground">
                      {paletteColor.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Show color picker if no palette OR if toggle is enabled OR if showPallet is false */}
          {(!shouldShowPalette || showFullPicker) && (
            <>
              <div
                className={`w-[ m-3 overflow-hidden rounded-md${
                  colorPicker?.e?.width - 40
                }px] min-w-[280px]`}
              >
                <SketchPicker
                  width="100%"
                  presetColors={preset}
                  styles={{
                    picker: {},
                    saturation: {
                      width: "100%",
                      height: "100px",
                      paddingBottom: "",
                      position: "relative",
                      overflow: "hidden",
                    },
                  }}
                  color={colorPicker.value || undefined}
                  onChangeComplete={(_color) => {
                    // if (!_color?.rgb) return;
                    changed({ type: "rgb", value: _color?.rgb });
                  }}
                  onChange={debounce((_color) => {
                    // if (!_color?.rgb) return;
                    setColorPicker({ ...colorPicker, value: _color?.rgb });
                  }, 20)}
                />
              </div>
            </>
          )}
        </div>

        <motion.div
          animate={show ? { width: "unset" } : { width: 0 }}
          initial={{ width: 0 }}
          transition={{ type: "tween" }}
          onMouseLeave={() => setShow(false)}
        >
          {colorPicker.showPallet && showFullPicker && (
            <div className="flex size-full flex-row items-center gap-1.5 border-l border-border bg-background p-3">
              {pallet.map((_, k) => (
                <div
                  className="flex w-4 flex-col gap-1 justify-self-start"
                  key={`main-${k}`}
                >
                  {_.color.map((color, kk) => {
                    const cplass = `${_.key}-${color.key}`;
                    return (
                      <Item
                        tooltip={cplass}
                        title={color.color}
                        value={cplass}
                        changed={changed}
                        type="class"
                        key={`${kk}`}
                        selected={colorPicker.value === cplass}
                        style={{ backgroundColor: color.color }}
                        onClick={(e, value) => {
                          e.stopPropagation();
                          changed({ type: "class", value });
                          //  closed();
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {!show && colorPicker.showPallet && showFullPicker && (
          <button
            className="flex w-3 cursor-pointer items-center bg-accent text-accent-foreground"
            onMouseOver={() => {
              setShow(true);
            }}
            onFocus={() => setShow(true)}
            tabIndex={0}
          >
            {show ? null : <TbCaretRight />}
          </button>
        )}
      </div>
    </Dialog>
  );
};
