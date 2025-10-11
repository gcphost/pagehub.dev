import { useEditor } from '@craftjs/core';
import { Tooltip } from 'components/layout/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { TbBoxModel2, TbCheck, TbChevronDown, TbDownload, TbLayoutGridAdd, TbPencil, TbPlus, TbTrash, TbUpload, TbX } from 'react-icons/tb';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ComponentsAtom, IsolateAtom, OpenComponentEditorAtom } from 'utils/lib';

interface ComponentSelectorProps {
  className?: string;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { query, actions } = useEditor();
  const [components, setComponents] = useRecoilState(ComponentsAtom);
  const isolate = useRecoilValue(IsolateAtom);
  const setOpenComponentEditor = useSetRecoilState(OpenComponentEditorAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Filter components based on search term
  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle component click - open in editor
  const handleComponentClick = (component: any) => {
    setOpenComponentEditor({
      componentId: component.rootNodeId,
      componentName: component.name,
    });
    setIsOpen(false);
  };

  // Handle create new component
  const handleCreateComponent = () => {
    // Trigger opening a new blank component editor
    setOpenComponentEditor({
      componentId: null,
      componentName: 'New Component',
    });
    setIsOpen(false);
  };

  // Handle start rename
  const handleStartRename = (component: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(component.rootNodeId);
    setEditingName(component.name);
  };

  // Handle save rename
  const handleSaveRename = (component: any) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }

    try {
      // Find the component container and update its display name
      const contentNode = query.node(component.rootNodeId).get();
      if (contentNode) {
        const componentContainerId = contentNode.data.parent;
        const componentContainer = query.node(componentContainerId).get();

        if (componentContainer?.data?.props?.type === 'component') {
          // Update the container's display name
          actions.setProp(componentContainerId, (prop) => {
            if (!prop.custom) prop.custom = {};
            prop.custom.displayName = editingName.trim();
          });

          // Update the components list
          setComponents(components.map(c =>
            c.rootNodeId === component.rootNodeId
              ? { ...c, name: editingName.trim() }
              : c
          ));

          console.log('✅ Renamed component to:', editingName.trim());
        }
      }
    } catch (e) {
      console.error('Error renaming component:', e);
    }

    setEditingId(null);
  };

  // Handle cancel rename
  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Handle delete component
  const handleDeleteComponent = (component: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm(`Delete component "${component.name}"?`)) {
      return;
    }

    try {
      // The component.rootNodeId is the actual content node
      // We need to find and delete its parent (the component container)
      const contentNode = query.node(component.rootNodeId).get();
      if (contentNode) {
        const componentContainerId = contentNode.data.parent;
        const componentContainer = query.node(componentContainerId).get();

        // Make sure it's actually a component container
        if (componentContainer?.data?.props?.type === 'component') {
          // Delete all instances (clones) of this component first
          const allNodes = query.getSerializedNodes();
          Object.entries(allNodes).forEach(([nodeId, node]: [string, any]) => {
            if (node.props?.belongsTo === component.rootNodeId) {
              // This is a clone instance - delete it
              actions.delete(nodeId);
            }
          });

          // Delete the component container (which contains the master)
          actions.delete(componentContainerId);

          // Update the components list
          setComponents(components.filter(c => c.rootNodeId !== component.rootNodeId));

          console.log('✅ Deleted component:', component.name);
        }
      }
    } catch (e) {
      console.error('Error deleting component:', e);
    }
  };

  // Toggle component/section type
  const handleToggleComponentType = (component: any, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const newIsSection = !component.isSection;

      // Find the component container and update its isSection property
      const contentNode = query.node(component.rootNodeId).get();
      if (contentNode) {
        const componentContainerId = contentNode.data.parent;
        const componentContainer = query.node(componentContainerId).get();

        if (componentContainer?.data?.props?.type === 'component') {
          // Update the container's isSection property
          actions.setProp(componentContainerId, (prop) => {
            prop.isSection = newIsSection;
          });
        }
      }

      // Toggle isSection in the components list
      setComponents(components.map(c =>
        c.rootNodeId === component.rootNodeId
          ? { ...c, isSection: newIsSection }
          : c
      ));

      console.log('✅ Toggled component type:', component.name, newIsSection ? 'Section' : 'Component');
    } catch (e) {
      console.error('Error toggling component type:', e);
    }
  };

  // Find the currently editing component based on isolate ID
  // The isolate ID is the component container, but rootNodeId is the content node
  // So we need to check if the content node's parent matches the isolate
  const currentComponent = isolate ? components.find(c => {
    const contentNode = query.node(c.rootNodeId).get();
    return contentNode?.data?.parent === isolate;
  }) : null;

  // Display the current component name if editing, otherwise "Components"
  const displayText = currentComponent
    ? currentComponent.name
    : components.length > 0
      ? 'Components'
      : 'No Components';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-background hover:bg-muted text-foreground rounded-lg w-full justify-between transition-colors border border-border"
        aria-label="Component selector"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {currentComponent?.isSection ? (
            <TbLayoutGridAdd className="flex-shrink-0" />
          ) : (
            <TbBoxModel2 className="flex-shrink-0" />
          )}
          <span className="truncate text-sm font-medium">{displayText}</span>
        </div>
        <TbChevronDown
          className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50 flex flex-col max-h-[500px]">
          {/* Search Header - Fixed */}
          <div className="p-3 border-b border-border">
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-muted text-foreground text-sm rounded-md border border-border focus:outline-none focus:border-ring placeholder-muted-foreground"
              autoFocus
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar">
            {/* Component List */}
            {filteredComponents.length > 0 ? (
              filteredComponents.map((component, index) => (
                <div
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors group"
                >
                  {editingId === component.rootNodeId ? (
                    // Rename mode
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(component);
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        className="flex-1 px-2 py-1 bg-background text-foreground text-sm rounded border border-ring focus:outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={() => handleSaveRename(component)}
                          className="p-1 rounded hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-colors"
                          aria-label="Save"
                        >
                          <TbCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Cancel"
                        >
                          <TbX className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    // Normal mode
                    <>
                      <Tooltip
                        content={component.isSection ? "Convert to Component" : "Convert to Section"}
                        placement="top"
                        arrow={false}
                      >
                        <button
                          onClick={(e) => handleToggleComponentType(component, e)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 flex items-center"
                          aria-label={component.isSection ? "Convert to Component" : "Convert to Section"}
                        >
                          {component.isSection ? (
                            <TbLayoutGridAdd className="w-4 h-4" />
                          ) : (
                            <TbBoxModel2 className="w-4 h-4" />
                          )}
                        </button>
                      </Tooltip>
                      <button
                        onClick={() => handleComponentClick(component)}
                        className="flex items-center gap-2 overflow-hidden flex-1 text-left"
                      >
                        <span className="text-sm text-foreground truncate">
                          {component.name}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => handleStartRename(component, e)}
                          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                          aria-label={`Rename ${component.name}`}
                        >
                          <TbPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteComponent(component, e)}
                          className="p-1 rounded hover:bg-destructive text-muted-foreground hover:text-destructive-foreground transition-colors"
                          aria-label={`Delete ${component.name}`}
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : searchTerm ? (
              <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                No components found
              </div>
            ) : (
              <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                No components yet
              </div>
            )}
          </div>

          {/* Footer - Fixed */}
          <div className="border-t border-border">
            <button
              onClick={handleCreateComponent}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-muted-foreground hover:text-muted transition-colors"
            >
              <TbPlus />
              <span className="text-sm font-medium">Create New Component</span>
            </button>

            {/* Import/Export Actions */}
            <div className="grid grid-cols-2 gap-0 border-t border-border">
              <button className="flex items-center justify-center gap-1 px-3 py-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs border-r border-border">
                <TbUpload className="w-3 h-3" />
                Import
              </button>
              <button className="flex items-center justify-center gap-1 px-3 py-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs">
                <TbDownload className="w-3 h-3" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentSelector;