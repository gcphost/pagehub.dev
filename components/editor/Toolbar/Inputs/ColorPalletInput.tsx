import { ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { useEffect, useState } from "react";
import { TbPalette } from "react-icons/tb";
import { ToolbarSection } from "../ToolbarSection";
import { ColorPalletModal } from "./ColorPalletModal";

export const ColorPalletInput = () => {
  const { nodeProps } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  const { query } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [palletCount, setPalletCount] = useState(0);

  useEffect(() => {
    const node = query.node(ROOT_NODE).get();
    if (!node) return;

    const pallet = node.data.props.pallet || [];
    setPalletCount(Array.isArray(pallet) ? pallet.length : 0);
  }, [query, nodeProps.pallet]);

  return (
    <>
      <ToolbarSection title="Color Palette" full={2}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-primary-500 rounded-lg transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <TbPalette className="text-2xl text-gray-600 group-hover:text-primary-500" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Colors</div>
              <div className="text-sm text-gray-500">
                {palletCount} {palletCount === 1 ? "color" : "colors"} defined
              </div>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-primary-500">→</div>
        </button>
      </ToolbarSection>

      <ColorPalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
