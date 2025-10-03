import { useEditor } from "@craftjs/core";
import { AnimatePresence } from "framer-motion";
import { useGetNode } from "./Toolbar/Tools/lib";

export const RenderNodeTools = () => {
  const node = useGetNode();
  const { query } = useEditor();

  // Try to get tools from craft config if not in props
  let tools = node?.data?.props?.tools?.(node.data.props) || [];

  // Fallback: get tools from the component's craft config directly
  if (!tools.length && node?.data?.type) {
    const craftConfig = query.getOptions().resolver[node.data.name || node.data.displayName];

    if (!craftConfig && node.data.type?.craft) {
      const craftTools = node.data.type.craft.props?.tools;
      if (typeof craftTools === 'function') {
        tools = craftTools(node.data.props);
      }
    }
  }

  if (!tools.length) return null;

  return (
    <div className="relative w-full h-full pointer-events-none">
      <AnimatePresence>
        {tools.map((tool, index) => ({ ...tool, key: index }))}
      </AnimatePresence>
    </div>
  );
};
