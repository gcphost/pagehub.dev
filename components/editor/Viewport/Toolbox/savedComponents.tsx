import { Element, ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { TbComponents, TbTrash } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ComponentsAtom } from "utils/lib";
import { buildClonedTree } from "../lib";
import { SelectedNodeAtom } from "./lib";

const generate = require("boring-name-generator");

// Track which loaders are currently processing to prevent duplicates
const processingLoaders = new Set();

// This component gets rendered when you drag and drop
// It immediately replaces itself with the actual saved component tree
export const SavedComponentLoader = ({ componentData }) => {
  const { id } = useNode((node) => ({ id: node.id }));
  const { actions, query } = useEditor();
  const processedRef = useRef(false);

  useEffect(() => {
    // Only process once per instance
    if (processedRef.current) return;
    if (!componentData) return;

    // Check if this loader is already processing globally
    if (processingLoaders.has(id)) return;

    // Check if this loader node exists
    const loaderNode = query.node(id).get();
    if (!loaderNode) return;

    // Mark as processed immediately to prevent re-runs
    processedRef.current = true;
    processingLoaders.add(id);

    try {
      // Parse the serialized nodes
      const serializedNodes = JSON.parse(componentData.nodes);

      // Convert serialized nodes back to node format
      const nodeEntries = Object.entries(serializedNodes).map(([nodeId, serializedNode]: [string, any]) => {
        return [nodeId, query.parseSerializedNode(serializedNode).toNode()];
      });

      const nodes = Object.fromEntries(nodeEntries);

      const tree = {
        rootNodeId: componentData.rootNodeId,
        nodes: nodes,
      };

      // Check if an instance of this component already exists in the canvas
      // by looking for nodes with matching savedComponentName
      const savedComponentName = componentData.name;
      const allNodes = query.getSerializedNodes();

      const existingInstanceEntry = Object.entries(allNodes).find(([nodeId, node]: [string, any]) => {
        // Make sure we have a valid saved component name match and it's not the root
        return node.props?.savedComponentName === savedComponentName &&
          savedComponentName &&
          node.type?.resolvedName !== 'ROOT';
      });

      let clonedTree;
      if (existingInstanceEntry) {
        // Verify the node actually exists (not just in serialized state)
        const [existingId] = existingInstanceEntry;
        const existingNode = query.node(existingId).get();

        if (existingNode) {
          // Node exists, create a linked clone to it
          const existingTree = query.node(existingId).toNodeTree();

          clonedTree = buildClonedTree({
            tree: existingTree,
            query,
            setProp: actions.setProp,
            createLinks: true
          });
        } else {
          // Node was deleted, treat as first instance
          clonedTree = buildClonedTree({
            tree,
            query,
            setProp: actions.setProp,
            createLinks: false
          });
        }
      } else {
        // First instance - mark it with the saved component name but don't create links
        clonedTree = buildClonedTree({
          tree,
          query,
          setProp: actions.setProp,
          createLinks: false
        });
      }

      // Get the parent and position of this loader node
      const parentId = loaderNode.data.parent;
      if (!parentId) return;

      const parent = query.node(parentId).get();
      if (!parent) return;

      const indexInParent = parent.data.nodes.indexOf(id);

      // Delete the loader node FIRST to prevent re-renders
      actions.delete(id);

      // Add the entire tree at once
      actions.addNodeTree(clonedTree, parentId, indexInParent);

      // Set savedComponentName and belongsTo AFTER the tree is added
      setTimeout(() => {
        if (!query.node(clonedTree.rootNodeId).get()) return;

        // Always set savedComponentName for tracking
        if (!clonedTree.originalRootId) {
          // First instance - mark with saved component name
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.savedComponentName = savedComponentName;
          });
        } else if (query.node(clonedTree.originalRootId).get()) {
          // Linked clone - set belongsTo
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.belongsTo = clonedTree.originalRootId;
            prop.relationType = 'full';
          });
        } else {
          // Original node not found, treating as first instance
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.savedComponentName = savedComponentName;
          });
        }
      }, 50);

      // Clean up the global processing set
      setTimeout(() => {
        processingLoaders.delete(id);
      }, 100);
    } catch (error) {
      console.error('Error loading saved component:', error);
      // Clean up on error
      processingLoaders.delete(id);
      if (query.node(id).get()) {
        actions.delete(id);
      }
    }

    // Cleanup function
    return () => {
      processingLoaders.delete(id);
    };
  }, [componentData, actions, query, id]);

  // Show a placeholder while loading
  return <div className="p-3 text-gray-400">Loading component...</div>;
};

// This needs to have craft config for CraftJS to recognize it
SavedComponentLoader.craft = {
  displayName: "Component Loader",
};

export const RenderSavedComponent = ({ componentData }) => {
  const { actions, query } = useEditor();
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const setComponents = useSetRecoilState(ComponentsAtom);
  const selectedNode = useRecoilValue(SelectedNodeAtom);

  // Get component name from first node
  const nodes = JSON.parse(componentData.nodes);
  const firstNode = nodes[Object.keys(nodes)[0]];
  const componentName = firstNode?.props?.custom?.displayName ||
    firstNode?.displayName ||
    generate().dashed;

  // Create the draggable element
  const tool = (
    <Element
      canvas
      is={SavedComponentLoader}
      componentData={componentData}
      custom={{ displayName: componentName }}
    />
  );

  // Double-click handler
  const handleDoubleClick = useCallback(() => {
    try {
      // Parse the serialized nodes
      const serializedNodes = JSON.parse(componentData.nodes);

      // Convert serialized nodes back to node format
      const nodeEntries = Object.entries(serializedNodes).map(([nodeId, serializedNode]: [string, any]) => {
        return [nodeId, query.parseSerializedNode(serializedNode).toNode()];
      });

      const nodes = Object.fromEntries(nodeEntries);

      const tree = {
        rootNodeId: componentData.rootNodeId,
        nodes: nodes,
      };

      // Check if an instance of this component already exists in the canvas
      const savedComponentName = componentData.name;
      const allNodes = query.getSerializedNodes();
      const existingInstanceEntry = Object.entries(allNodes).find(([nodeId, node]: [string, any]) =>
        node.props?.savedComponentName === savedComponentName
      );

      let clonedTree;
      if (existingInstanceEntry) {
        // Verify the node actually exists (not just in serialized state)
        const [existingId] = existingInstanceEntry;
        const existingNode = query.node(existingId).get();

        if (existingNode) {
          // Node exists, create a linked clone to it
          const existingTree = query.node(existingId).toNodeTree();

          clonedTree = buildClonedTree({
            tree: existingTree,
            query,
            setProp: actions.setProp,
            createLinks: true
          });
        } else {
          // Node was deleted, treat as first instance
          clonedTree = buildClonedTree({
            tree,
            query,
            setProp: actions.setProp,
            createLinks: false
          });
        }
      } else {
        // First instance - mark it with the saved component name but don't create links
        clonedTree = buildClonedTree({
          tree,
          query,
          setProp: actions.setProp,
          createLinks: false
        });
      }

      // Add to selected node or root
      const targetId = selectedNode?.id || Object.keys(query.getSerializedNodes())[0];
      const targetNode = query.node(targetId).get();
      const targetIndex = targetNode.data.nodes.length;

      // Add the entire tree at once
      actions.addNodeTree(clonedTree, targetId, targetIndex);

      // Set savedComponentName and belongsTo AFTER the tree is added
      setTimeout(() => {
        if (!query.node(clonedTree.rootNodeId).get()) return;

        if (!clonedTree.originalRootId) {
          // First instance - mark with saved component name
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.savedComponentName = savedComponentName;
          });
        } else if (query.node(clonedTree.originalRootId).get()) {
          // Linked clone - set belongsTo
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.belongsTo = clonedTree.originalRootId;
            prop.relationType = 'full';
          });
        } else {
          // Original not found, treat as first instance
          actions.setProp(clonedTree.rootNodeId, (prop) => {
            prop.savedComponentName = savedComponentName;
          });
        }
      }, 50);
    } catch (error) {
      console.error('Error adding saved component:', error);
    }
  }, [actions, query, componentData, selectedNode]);

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Remove from Background node
    const rootNode = query.node(ROOT_NODE).get();
    const backgroundId = rootNode?.data?.nodes?.[0];

    if (backgroundId) {
      actions.setProp(backgroundId, (prop) => {
        prop.savedComponents = (prop.savedComponents || []).filter(
          c => c.rootNodeId !== componentData.rootNodeId
        );
      });

      // Update the local state
      setComponents(prev => prev.filter(c => c.rootNodeId !== componentData.rootNodeId));
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      ref={(ref: any) => ref && create(ref, tool)}
      onDoubleClick={handleDoubleClick}
      className="cursor-move pointer-events-auto w-full"
    >
      <div className="flex flex-col items-center justify-center border p-3 rounded-md w-full hover:bg-gray-100 min-h-[80px] gap-2 pointer-events-none transition-colors relative">
        <TbComponents className="text-2xl" />
        <span className="text-xs text-center">{componentName}</span>
        <button
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-1 pointer-events-auto z-10"
          aria-label="Delete component"
        >
          <TbTrash className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
};

export const SavedComponentsToolbox = (components) => ({
  title: "My Components",
  content: components.map((component, index) => (
    <RenderSavedComponent key={index} componentData={component} />
  )),
});

