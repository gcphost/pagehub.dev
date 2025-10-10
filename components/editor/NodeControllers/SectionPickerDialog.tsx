import { Editor, Element, Frame, useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdClose, MdSearch } from "react-icons/md";
import { TbLayoutGridAdd } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { ComponentsAtom } from "utils/lib";
import templateData from "../../../data/section-templates.json";

// Lazy load components to avoid circular dependencies
const getComponentRegistry = () => {
  const { Container } = require("components/selectors/Container");
  const { Text } = require("components/selectors/Text");
  const { Button } = require("components/selectors/Button");
  const { Image } = require("components/selectors/Image");

  return {
    Container,
    Text,
    Button,
    Image,
    // Add more components as needed
  };
};

// Convert JSON structure to React Element
const buildElementFromStructure = (structure: any, key?: string, isPreview: boolean = false): any => {
  const componentRegistry = getComponentRegistry();
  const Component = componentRegistry[structure.type];
  if (!Component) {
    console.error(`Unknown component type: ${structure.type}`);
    return null;
  }

  const previewPrefix = isPreview ? 'preview-' : '';
  const uniqueKey = `${previewPrefix}${key || 'root'}`;

  const children = structure.children?.map((child: any, index: number) =>
    buildElementFromStructure(child, `${uniqueKey}-${index}`, isPreview)
  );

  return (
    <Element key={uniqueKey} canvas is={Component} {...structure.props}>
      {children}
    </Element>
  );
};

const baseCategories = [
  { id: "all", name: "All" },
  { id: "my-sections", name: "My Sections" },
  ...templateData.categories
];

// Convert JSON templates to usable format
const convertTemplates = (categoryId: string) => {
  const templates = templateData.templates[categoryId] || [];
  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    element: buildElementFromStructure(template.structure, template.id, false),
    structure: template.structure, // Keep original structure for preview
  }));
};

// Search across all templates
const searchTemplates = (searchQuery: string) => {
  if (!searchQuery.trim()) return [];

  const allTemplates = [];
  Object.entries(templateData.templates).forEach(([categoryId, templates]) => {
    templates.forEach((template) => {
      if (template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        allTemplates.push({
          id: template.id,
          name: template.name,
          categoryId,
          categoryName: baseCategories.find(c => c.id === categoryId)?.name || categoryId,
          element: buildElementFromStructure(template.structure, template.id, false),
          structure: template.structure,
        });
      }
    });
  });
  return allTemplates;
};

interface SectionPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (element: any) => void;
}

export const SectionPickerDialog = ({
  isOpen,
  onClose,
  onSelectSection,
}: SectionPickerDialogProps) => {
  const { query, actions } = useEditor();
  const components = useRecoilValue(ComponentsAtom);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const dialogRef = useRef(null);

  // Filter to only get sections
  const customSections = useMemo(() => {
    return components.filter(c => c.isSection).map(component => ({
      id: component.rootNodeId,
      name: component.name,
      element: null, // Will be created from the master node when selected
      isCustom: true,
      rootNodeId: component.rootNodeId,
    }));
  }, [components]);

  // Show/hide category based on whether there are custom sections
  const categories = useMemo(() => {
    if (customSections.length === 0) {
      // No custom sections, exclude "My Sections" category
      return baseCategories.filter(c => c.id !== "my-sections");
    }
    return baseCategories;
  }, [customSections]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const templates = useMemo(() => {
    if (isSearchMode && searchQuery.trim()) {
      // Include custom sections in search
      const builtInTemplates = searchTemplates(searchQuery);
      const matchingCustom = customSections.filter(section =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return [...matchingCustom, ...builtInTemplates];
    }

    // If "my-sections" is selected, show only custom sections
    if (selectedCategory === "my-sections") {
      return customSections;
    }

    // If "all" is selected, show custom sections first, then all templates
    if (selectedCategory === "all") {
      const allTemplates = [];
      categories.forEach((category) => {
        if (category.id !== "all" && category.id !== "my-sections") {
          const categoryTemplates = convertTemplates(category.id);
          allTemplates.push(...categoryTemplates);
        }
      });
      return [...customSections, ...allTemplates]; // Custom sections first
    }

    // Otherwise, show templates from the selected category
    return convertTemplates(selectedCategory);
  }, [selectedCategory, isSearchMode, searchQuery, customSections, categories]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchMode(query.trim().length > 0);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsSearchMode(false);
    setSearchQuery("");
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl w-[90vw] max-w-6xl h-[80vh] flex flex-col overflow-hidden"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TbLayoutGridAdd className="w-7 h-7" />
                Add Section
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left sidebar - Categories */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${selectedCategory === category.id && !isSearchMode
                          ? "bg-primary-500 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar - Bottom of sidebar */}
                <div className="p-4 border-t border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent bg-white text-sm"
                    />
                    <MdSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Right content - Templates */}
              <div className="flex-1 overflow-y-auto p-6">
                <div key={isSearchMode ? `search-${searchQuery}` : selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template, templateIndex) => (
                    <motion.button
                      key={`${isSearchMode ? 'search' : selectedCategory}-${template.isCustom ? 'custom' : 'builtin'}-${template.id}-${templateIndex}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (template.isCustom) {
                          // For custom sections, get the serialized node and reconstruct
                          try {
                            const masterNode = query.node(template.rootNodeId).get();
                            if (masterNode) {
                              // Get the component registry
                              const componentRegistry = getComponentRegistry();

                              // Recursively build React elements for children
                              const uniquePrefix = `section-${Date.now()}`;
                              const buildElement = (nodeId, index = 0) => {
                                const node = query.node(nodeId).get();
                                if (!node) return null;

                                const serializedNode = query.node(nodeId).toSerializedNode();
                                const typeName = typeof serializedNode.type === 'string'
                                  ? serializedNode.type
                                  : serializedNode.type?.resolvedName;
                                const Component = componentRegistry[typeName] || componentRegistry.Container;

                                const children = node.data.nodes.map((childId, childIndex) => buildElement(childId, childIndex)).filter(Boolean);

                                return (
                                  <Element
                                    key={`${uniquePrefix}-${index}`}
                                    canvas={serializedNode.props.canvas}
                                    is={Component}
                                    {...serializedNode.props}
                                  >
                                    {children}
                                  </Element>
                                );
                              };

                              const freshElement = buildElement(template.rootNodeId);
                              onSelectSection(freshElement);
                            }
                          } catch (e) {
                            console.error('Error creating custom section:', e);
                          }
                        } else {
                          onSelectSection(template.element);
                        }
                        onClose();
                      }}
                      className="group relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-500 transition-all shadow-sm hover:shadow-md"
                      style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        WebkitFontSmoothing: "antialiased",
                      }}
                    >
                      {/* Preview */}
                      <div className="aspect-video bg-white relative overflow-hidden">
                        {template.isCustom ? (
                          // Preview for custom sections - render the actual content
                          <>
                            <div className="absolute inset-0" style={{ transform: "scale(0.25)", transformOrigin: "top left", width: "400%", height: "400%" }}>
                              <Editor resolver={getComponentRegistry()} enabled={false}>
                                <Frame>
                                  {(() => {
                                    try {
                                      const masterNode = query.node(template.rootNodeId).get();
                                      if (masterNode) {
                                        const serializedNode = query.node(template.rootNodeId).toSerializedNode();
                                        const componentRegistry = getComponentRegistry();
                                        const typeName = typeof serializedNode.type === 'string'
                                          ? serializedNode.type
                                          : serializedNode.type?.resolvedName;
                                        const Component = componentRegistry[typeName] || componentRegistry.Container;

                                        const buildPreviewElement = (nodeId, depth = 0) => {
                                          const node = query.node(nodeId).get();
                                          if (!node) return null;

                                          const serialized = query.node(nodeId).toSerializedNode();
                                          const typeN = typeof serialized.type === 'string'
                                            ? serialized.type
                                            : serialized.type?.resolvedName;
                                          const Comp = componentRegistry[typeN] || componentRegistry.Container;

                                          const children = node.data.nodes.map((childId, idx) =>
                                            buildPreviewElement(childId, depth + 1)
                                          ).filter(Boolean);

                                          return (
                                            <Element
                                              key={`preview-${nodeId}-${depth}`}
                                              canvas={serialized.props.canvas}
                                              is={Comp}
                                              {...serialized.props}
                                            >
                                              {children}
                                            </Element>
                                          );
                                        };

                                        return buildPreviewElement(template.rootNodeId);
                                      }
                                    } catch (e) {
                                      console.error('Error rendering custom section preview:', e);
                                      return null;
                                    }
                                    return null;
                                  })()}
                                </Frame>
                              </Editor>
                            </div>
                            {/* Custom Section Badge */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary-500 text-white rounded-md shadow-sm z-10">
                              <TbLayoutGridAdd className="w-3 h-3" />
                              <span className="text-xs font-medium">Custom</span>
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0" style={{ transform: "scale(0.25)", transformOrigin: "top left", width: "400%", height: "400%" }}>
                            <Editor resolver={getComponentRegistry()} enabled={false}>
                              <Frame>
                                {buildElementFromStructure(template.structure, `preview-${template.id}`, true)}
                              </Frame>
                            </Editor>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors pointer-events-none" />
                      </div>
                      {/* Template Name */}
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-center">
                          {template.name}
                        </h4>
                        {isSearchMode && template.categoryName && (
                          <p className="text-xs text-gray-500 text-center mt-1">
                            {template.categoryName}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {templates.length === 0 && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">
                      {isSearchMode ? `No templates found for "${searchQuery}"` : "No templates available for this category yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

