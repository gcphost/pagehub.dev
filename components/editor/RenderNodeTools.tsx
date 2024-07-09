import { AnimatePresence } from "framer-motion";
import { getNode } from "./Toolbar/Tools/lib";

export const RenderNodeTools = () => {
  const node = getNode();
  const tools = node?.data?.props?.tools?.(node.data.props) || [];

  if (!tools.length) return null;

  return (
    <div className="relative w-full h-full pointer-events-none">
      <AnimatePresence>
        {tools.map((tool, index) => ({ ...tool, key: index }))}
      </AnimatePresence>
    </div>
  );
};
