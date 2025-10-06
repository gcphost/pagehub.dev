import { Editor, Element, Frame } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdClose, MdSearch } from "react-icons/md";
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

const categories = [
  { id: "all", name: "All" },
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
          categoryName: categories.find(c => c.id === categoryId)?.name || categoryId,
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const dialogRef = useRef(null);

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
      return searchTemplates(searchQuery);
    }

    // If "all" is selected, show all templates
    if (selectedCategory === "all") {
      const allTemplates = [];
      categories.forEach((category) => {
        if (category.id !== "all") { // Skip the "all" category itself
          const categoryTemplates = convertTemplates(category.id);
          allTemplates.push(...categoryTemplates);
        }
      });
      return allTemplates;
    }

    // Otherwise, show templates from the selected category
    return convertTemplates(selectedCategory);
  }, [selectedCategory, isSearchMode, searchQuery]);

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
              <h2 className="text-2xl font-bold text-gray-900">
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
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                    />
                    <MdSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Right content - Templates */}
              <div className="flex-1 overflow-y-auto p-6">
                <div key={isSearchMode ? `search-${searchQuery}` : selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <motion.button
                      key={`${isSearchMode ? 'search' : selectedCategory}-${template.id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectSection(template.element);
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
                        <div className="absolute inset-0" style={{ transform: "scale(0.25)", transformOrigin: "top left", width: "400%", height: "400%" }}>
                          <Editor resolver={getComponentRegistry()} enabled={false}>
                            <Frame>
                              {buildElementFromStructure(template.structure, `preview-${template.id}`, true)}
                            </Frame>
                          </Editor>
                        </div>
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

