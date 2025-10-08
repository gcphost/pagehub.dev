import { ROOT_NODE, useEditor } from "@craftjs/core";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TbX } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { ComponentsAtom, IsolateAtom, OpenComponentEditorAtom, isolatePageAlt } from 'utils/lib';

interface ComponentEditorTab {
  id: string; // The component node ID
  name: string; // Component name
  isDirty?: boolean; // Has unsaved changes
}

interface ComponentEditorTabsProps {
  className?: string;
}

// Helper function to hide/show header and footer
const hideHeaderFooter = (query, actions, hide: boolean) => {
  const root = query.node(ROOT_NODE).get();

  root.data.nodes.forEach((nodeId) => {
    const node = query.node(nodeId).get();
    const nodeType = node?.data?.props?.type;

    if (nodeType === 'header' || nodeType === 'footer') {
      actions.setHidden(nodeId, hide);
      actions.setProp(nodeId, (prop) => (prop.hidden = hide));
    }
  });
};

export const ComponentEditorTabs: React.FC<ComponentEditorTabsProps> = ({ className = "" }) => {
  const { query, actions } = useEditor();
  const [isolate, setIsolate] = useRecoilState(IsolateAtom);
  const [tabs, setTabs] = useState<ComponentEditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [openComponentEditor, setOpenComponentEditor] = useRecoilState(OpenComponentEditorAtom);
  const [components, setComponents] = useRecoilState(ComponentsAtom);
  const processingRef = useRef<string | null>(null);

  // Open or switch to a component editor
  const handleOpenComponent = useCallback(async (componentId: string | null, componentName: string) => {
    // If componentId is null, create a new blank component
    if (componentId === null) {
      try {
        console.log('📦 Creating new component:', componentName);

        // Dynamically import Container and Element
        const { Container } = await import("../../selectors/Container");
        const { Element } = await import("@craftjs/core");
        const { Text } = await import("../../selectors/Text");

        // Create a new component container with a default Text element inside
        const componentWrapper = query.parseReactElement(
          <Element
            canvas
            is={Container}
            type="component"
            custom={{ displayName: componentName }}
            root={{
              background: "bg-transparent",
            }}
            mobile={{
              display: "flex",
              flexDirection: "flex-col",
              gap: "gap-4",
              p: "p-6",
            }}
          >
            <Text text="Start editing your component..." />
          </Element>
        ).toNodeTree();

        // Add to ROOT
        actions.addNodeTree(componentWrapper, ROOT_NODE);
        const componentContainerId = componentWrapper.rootNodeId;

        console.log('✅ Created new component container:', componentContainerId);

        // Get the first child (the Text node) which will be the actual component root
        const contentNodeId = componentWrapper.nodes[componentContainerId].data.nodes[0];

        // Wait a moment for the tree to be fully added, then serialize it
        await new Promise(resolve => setTimeout(resolve, 50));

        // Get the content node's tree and serialize it
        const contentTree = query.node(contentNodeId).toNodeTree();
        const serializedNodePairs = Object.keys(contentTree.nodes).map((nodeId) => [
          nodeId,
          query.node(nodeId).toSerializedNode(),
        ]);
        const serializedEntries = Object.fromEntries(serializedNodePairs);
        const serializedJSON = JSON.stringify(serializedEntries);

        // Update components list
        const newComponent = {
          rootNodeId: contentNodeId, // The Text node inside the container
          nodes: serializedJSON,
          name: componentName,
        };
        setComponents([...components, newComponent]);

        console.log('✅ Added new component to ComponentsAtom:', newComponent);

        // Add tab and open for editing
        const newTab: ComponentEditorTab = {
          id: componentContainerId,
          name: componentName,
          isDirty: false,
        };

        setTabs([...tabs, newTab]);
        setActiveTabId(componentContainerId);

        // Isolate the component container and hide header/footer
        setTimeout(() => {
          isolatePageAlt(isolate, query, componentContainerId, actions, setIsolate, true);
          hideHeaderFooter(query, actions, true);
          console.log('✅ New component opened for editing');
        }, 100);

        return;
      } catch (e) {
        console.error('Error creating new component:', e);
        return;
      }
    }

    // Check if tab already exists for this component
    const existingTab = tabs.find(tab => tab.id === componentId);

    if (existingTab) {
      // Tab exists, just switch to it
      setActiveTabId(existingTab.id);
      isolatePageAlt(isolate, query, existingTab.id, actions, setIsolate, true);
      hideHeaderFooter(query, actions, true);
    } else {
      // NEW APPROACH: Just isolate the component node directly!
      try {
        console.log('📦 Opening component for editing:', componentName, componentId);

        // The componentId is the content node - we need to find its parent (the component container)
        const contentNode = query.node(componentId).get();
        if (!contentNode) {
          console.error('❌ Content node not found:', componentId);
          return;
        }

        const componentContainerId = contentNode.data.parent;
        const componentContainer = query.node(componentContainerId).get();

        if (!componentContainer || componentContainer.data.props?.type !== 'component') {
          console.error('❌ Component container not found or invalid');
          return;
        }

        console.log('✅ Found component container:', componentContainer.data.displayName);

        // Add a tab for this component - use the container ID
        const newTab: ComponentEditorTab = {
          id: componentContainerId, // Use the component container ID
          name: componentName,
          isDirty: false,
        };

        setTabs([...tabs, newTab]);
        setActiveTabId(componentContainerId);

        // Isolate the component container and hide header/footer
        setTimeout(() => {
          isolatePageAlt(isolate, query, componentContainerId, actions, setIsolate, true);
          hideHeaderFooter(query, actions, true);
          console.log('✅ Component isolated for editing');
        }, 100);
      } catch (e) {
        console.error("Error opening component in editor:", e);
      }
    }
  }, [tabs, isolate, query, actions, setTabs, setActiveTabId, setIsolate, setComponents, components]);

  // Listen for component editor open requests
  useEffect(() => {
    if (openComponentEditor) {
      const { componentId, componentName } = openComponentEditor;
      const requestKey = `${componentId}-${componentName}-${Date.now()}`;

      // Check if we're already processing this or a similar request
      if (processingRef.current === requestKey) {
        return;
      }

      // Mark as processing
      processingRef.current = requestKey;

      // Clear the request immediately to prevent re-runs
      setOpenComponentEditor(null);

      // Then handle opening the component
      handleOpenComponent(componentId, componentName).finally(() => {
        // Clear processing flag after a delay
        setTimeout(() => {
          if (processingRef.current === requestKey) {
            processingRef.current = null;
          }
        }, 500);
      });
    }
  }, [openComponentEditor, setOpenComponentEditor, handleOpenComponent]);

  // Switch to a different tab
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    // Isolate the component for this tab and hide header/footer
    isolatePageAlt(isolate, query, tabId, actions, setIsolate, true);
    hideHeaderFooter(query, actions, true);
  };

  // Close a tab
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    // If closing the active tab, switch to another one
    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        // Switch to the previous tab, or the first one
        const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
        setActiveTabId(newActiveTab.id);
        isolatePageAlt(isolate, query, newActiveTab.id, actions, setIsolate, true);
        hideHeaderFooter(query, actions, true);
      } else {
        // No more tabs, show all pages and restore header/footer
        setActiveTabId(null);
        isolatePageAlt(true, query, null, actions, setIsolate, false);
        hideHeaderFooter(query, actions, false);
      }
    }

    // Note: We DON'T delete the component node - it stays in ROOT as a master
  };

  // Save current component
  const handleSave = () => {
    if (!activeTabId) return;

    const tab = tabs.find(t => t.id === activeTabId);
    if (!tab) return;

    try {
      console.log('💾 Component saved (editing master directly - no save needed!)');

      // Mark as saved
      setTabs(tabs.map(t =>
        t.id === activeTabId ? { ...t, isDirty: false } : t
      ));

      // Refresh the components list
      const rootNode = query.node(ROOT_NODE).get();
      const rootChildren = rootNode?.data?.nodes || [];

      const componentNodes = rootChildren
        .map(nodeId => {
          try {
            const node = query.node(nodeId).get();
            if (node?.data?.props?.type === 'component') {
              return {
                rootNodeId: nodeId,
                name: node?.data?.custom?.displayName || node?.data?.displayName || 'Unnamed Component',
              };
            }
          } catch (e) {
            return null;
          }
          return null;
        })
        .filter(Boolean);

      setComponents(componentNodes);
    } catch (e) {
      console.error("Error saving component:", e);
    }
  };

  return (
    <div className={`relative h-12 flex items-center gap-2 bg-gray-900 border-b border-gray-600 px-3 py-2 ${className}`}>
      {/* Tabs */}
      <div className="absolute bottom-0 flex-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer transition-colors
              ${activeTabId === tab.id
                ? 'bg-gray-700 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
              }
            `}
          >
            <span className="text-sm whitespace-nowrap">
              {tab.name}
            </span>
            <button
              onClick={(e) => handleCloseTab(tab.id, e)}
              className="p-0.5 rounded hover:bg-gray-600 transition-colors"
            >
              <TbX className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentEditorTabs;