import { ROOT_NODE, useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TbCheck, TbEdit, TbPlus, TbTrash, TbX } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { ColorPickerAtom } from "../Tools/ColorPickerDialog";
import { bgAndVal } from "./ColorInput";

interface ColorPalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NamedColor {
  name: string;
  color: string;
}

// Helper to get background style for color preview
const getColorStyle = (color: string) => {
  if (!color || typeof color !== "string") {
    return { backgroundColor: "#e5e7eb" }; // gray-200 fallback
  }

  // If it's a hex or rgba color, use it directly
  if (color.includes("rgba") || color.includes("rgb") || color.startsWith("#")) {
    return { backgroundColor: color };
  }

  // For Tailwind classes, we can't easily get the color, so use a pattern
  return {}; // Let Tailwind handle it via className
};

export const ColorPalletModal = ({ isOpen, onClose }: ColorPalletModalProps) => {
  const { actions, query } = useEditor();
  const [pallets, setPallets] = useState<NamedColor[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [colorPicker, setColorPicker] = useRecoilState(ColorPickerAtom);

  useEffect(() => {
    if (isOpen) {
      const node = query.node(ROOT_NODE).get();
      if (!node) return;

      const rawPallet = node.data.props.pallet || [];

      // Always use NamedColor format
      let converted: NamedColor[];
      if (Array.isArray(rawPallet) && rawPallet.length > 0) {
        // Validate and ensure strings
        converted = rawPallet
          .filter((item) => item && typeof item === "object" && item.name)
          .map((item) => ({
            name: String(item.name),
            color: String(item.color || "bg-gray-500"),
          }));
      } else {
        // Empty - add defaults
        converted = [
          { name: "Brand", color: "bg-blue-600" },
          { name: "Accent", color: "bg-orange-500" },
          { name: "Secondary", color: "bg-purple-600" },
        ];
      }

      // Ensure we have at least the defaults
      if (converted.length === 0) {
        converted = [
          { name: "Brand", color: "bg-blue-600" },
          { name: "Accent", color: "bg-orange-500" },
          { name: "Secondary", color: "bg-purple-600" },
        ];
      }

      setPallets(converted);
    }
  }, [isOpen, query]);

  const savePallets = (newPallets: NamedColor[]) => {
    actions.setProp(ROOT_NODE, (props) => {
      props.pallet = newPallets;
    });
    setPallets(newPallets);
  };

  const addPallet = () => {
    const newPallets = [
      ...pallets,
      { name: `Color ${pallets.length + 1}`, color: "bg-gray-500" },
    ];
    savePallets(newPallets);
  };

  const removePallet = (index: number) => {
    const newPallets = pallets.filter((_, i) => i !== index);
    savePallets(newPallets);
  };

  const updatePalletColor = (index: number, oldColor: string, newColor: string) => {
    // Ensure colors are always strings
    const oldColorStr = String(oldColor);
    const newColorStr = String(newColor);

    const newPallets = pallets.map((pallet, i) =>
      i === index ? { ...pallet, color: newColorStr } : pallet
    );
    savePallets(newPallets);

    // Update all nodes that use this color
    const nodes = query.getNodes();
    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];
      const props = node.data.props;

      Object.keys(props.root || {}).forEach((propKey) => {
        const prop: any = props.root[propKey];

        const escapedRegexString = oldColorStr?.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        if (typeof prop === "string" && prop.search(new RegExp(escapedRegexString, "i")) > -1) {
          actions.setProp(
            nodeId,
            (nodeProp) => (nodeProp.root[propKey] = nodeProp.root[propKey].replace(oldColorStr, newColorStr))
          );
        }
      });
    });
  };

  const startEditingName = (index: number) => {
    setEditingIndex(index);
    setEditingName(pallets[index].name);
  };

  const saveNameEdit = (index: number) => {
    if (editingName.trim()) {
      const newPallets = pallets.map((pallet, i) =>
        i === index ? { ...pallet, name: editingName.trim() } : pallet
      );
      savePallets(newPallets);
    }
    setEditingIndex(null);
    setEditingName("");
  };

  const cancelNameEdit = () => {
    setEditingIndex(null);
    setEditingName("");
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Color Palette</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <TbX />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {pallets.map((pallet, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Color Preview & Input */}
                  <div className="flex-shrink-0 w-32">
                    <button
                      className={`w-full h-12 rounded-md cursor-pointer border-2 border-gray-300 hover:border-primary-500 transition-colors ${typeof pallet.color === "string" && !pallet.color.includes("rgba") && !pallet.color.startsWith("#")
                        ? pallet.color
                        : ""
                        }`}
                      style={getColorStyle(pallet.color)}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const colorValue = typeof pallet.color === "string" ? pallet.color : "bg-gray-500";
                        const [bg, cpVal] = bgAndVal({ value: colorValue, prefix: "" });

                        setColorPicker({
                          enabled: !colorPicker.enabled,
                          value: cpVal,
                          prefix: "",
                          changed: (data) => {
                            let val = data.value;

                            if (data.type === "hex") {
                              val = String(val);
                            } else if (data.type === "rgb") {
                              val = `rgba(${val.r},${val.g},${val.b},${val.a})`;
                            } else if (data.type === "class") {
                              val = String(val);
                            } else {
                              // Fallback - ensure it's always a string
                              val = typeof val === "string" ? val : JSON.stringify(val);
                            }

                            updatePalletColor(index, String(pallet.color), String(val));
                          },
                          showPallet: true,
                          propKey: `pallet-${index}`,
                          e: {
                            top: rect.top,
                            left: rect.left,
                            bottom: rect.bottom,
                            right: rect.right,
                            width: rect.width,
                            height: rect.height,
                          },
                        });
                      }}
                    ></button>
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveNameEdit(index);
                            if (e.key === "Escape") cancelNameEdit();
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                        <button
                          onClick={() => saveNameEdit(index)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <TbCheck />
                        </button>
                        <button
                          onClick={cancelNameEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <TbX />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {String(pallet.name || "Unnamed")}
                        </span>
                        <button
                          onClick={() => startEditingName(index)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <TbEdit size={16} />
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1 font-mono">
                      {String(pallet.color || "")}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removePallet(index)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <TbTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={addPallet}
              className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
            >
              <TbPlus />
              Add Color
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

