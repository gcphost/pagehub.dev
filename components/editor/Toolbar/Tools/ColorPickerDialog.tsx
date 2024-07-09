import { ROOT_NODE, useEditor } from "@craftjs/core";
import { SketchPicker } from "@hello-pangea/color-picker";

import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { BsEyedropper } from "react-icons/bs";
import { TbCaretRight, TbDeviceFloppy, TbX } from "react-icons/tb";
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
    className={`relative w-5 h-5 rounded cursor-pointer border-2 ${
      selected ? "border-violet-500" : "border-gray-600"
    }`}
    style={{ backgroundColor: value, ...style }}
    onClick={(e) => onClick(e, value)}
    onMouseOver={(e) => onMouseOver(e, value)}
    onFocus={(e) => onMouseOver(e, value)}
    tabIndex={0}
    role="button"
    onMouseLeave={(e) => onMouseOut(e, value)}
    key="colorpicker"
  >
    {children}
  </motion.button>
);

const hexToRGBA = (hex, alpha) =>
  `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(
    hex.slice(3, 5),
    16
  )},${parseInt(hex.slice(5, 7), 16)},${alpha})`;

export const ColorPickerDialog = () => {
  const pallet = getColorPallet();

  const [colorPicker, setColorPicker] = useRecoilState(ColorPickerAtom);
  const [colorPallet, setColorPallet] = useRecoilState(ColorPalletAtom);

  //
  // to-do count and only add X till
  const preset = colorPallet.length
    ? [...colorPallet, ...presetColors]
    : presetColors;

  const { open, close, isSupported } = useEyeDropper();
  const [color, setColor] = useState("#fff");
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  const { actions, query } = useEditor();

  useEffect(() => {
    const node = query.node(ROOT_NODE).get();
    if (!node) return;
    const nodePrsets = node.data.props.pallet || [];

    setColorPallet(nodePrsets);
  }, [colorPicker.enabled]);

  const saveToPallet = () => {
    const data = colorPicker.value;
    let val = data;

    if (data.r) {
      val = `rgba(${data.r},${data.g},${data.b},${data.a})`;
    }

    actions.setProp(ROOT_NODE, (props) => {
      props.pallet = [val, ...props.pallet.filter((_) => _ !== val)];

      setColorPallet(props.pallet);
    });

    setColorPicker({ enabled: false });
  };

  const pickColor = () => {
    open()
      .then((color) => {
        const value = hexToRGBA(color.sRGBHex, 1);
        setColor(value);
        changed({ type: "hex", value });

        // closed();
      })
      .catch((e) => {
        if (!e.canceled) setError(e);
      });
  };

  const changed = (value) => {
    if (colorPicker.changed) {
      setColorPicker({ ...colorPicker, value: value.value });
      colorPicker.changed(value);
    }
  };

  const closed = () => {
    setColorPicker({ enabled: false });
  };

  return (
    <Dialog
      dialogAtom={ColorPickerAtom}
      dialogName="colorPicker"
      value={colorPicker.value}
      width="auto"
    >
      <div className="bg-white rounded-lg flex flex-row">
        <div>
          <div
            className="flex flex-col gap-0 w-full max-w-[320px]"
            onMouseOver={() => setShow(false)}
            onFocus={() => setShow(false)}
            tabIndex={0}
            role="button"
          >
            {
              <div className="w-full flex flex-row px-3 gap-3 items-center justify-between">
                <div>
                  <button
                    className="cursor-pointer hover:text-gray-500"
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

                <div className="flex flex-row  gap-1.5 items-center">
                  <Tooltip content="Save to pallet">
                    <button
                      className="hover:text-gray-500 cursor-pointer text-xl"
                      onClick={() => saveToPallet()}
                    >
                      <TbDeviceFloppy />
                    </button>
                  </Tooltip>

                  {isSupported() && (
                    <>
                      <Tooltip content="Color Picker" arrow={false}>
                        <button
                          onClick={pickColor}
                          className={
                            "w-8 h-8 rounded-md cursor-pointer flex items-center justify-center"
                          }
                        >
                          <BsEyedropper />
                        </button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            }

            <div
              className={`m-3 rounded-md overflow-hidden w-[${
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
          </div>
        </div>

        <motion.div
          animate={show ? { width: "unset" } : { width: 0 }}
          initial={{ width: 0 }}
          transition={{ type: "tween" }}
          onMouseLeave={() => setShow(false)}
        >
          {colorPicker.showPallet && (
            <div className=" w-full border-l-2  gap-1.5  h-full items-center p-3 flex flex-row">
              {pallet.map((_, k) => (
                <div
                  className="w-4  flex flex-col gap-1 justify-self-start"
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

        {!show && colorPicker.showPallet && (
          <div
            className="border w-3 flex bg-gray items-center bg-gradient-to-tr from-white/50 to-gray-200 cursor-pointer"
            onMouseOver={() => {
              setShow(true);
            }}
            onFocus={() => setShow(true)}
            tabIndex={0}
            role="button"
          >
            {show ? null : <TbCaretRight />}
          </div>
        )}
      </div>
    </Dialog>
  );
};
