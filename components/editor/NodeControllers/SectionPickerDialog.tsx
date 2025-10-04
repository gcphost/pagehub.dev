import { Element } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import templateData from "../../../data/section-templates.json";

// Lazy load components to avoid circular dependencies
const getComponentRegistry = () => {
  const { Container } = require("components/selectors/Container");
  const { Text } = require("components/selectors/Text");
  const { Button } = require("components/selectors/Button");

  return {
    Container,
    Text,
    Button,
    // Add more components as needed
  };
};

// Convert JSON structure to React Element
const buildElementFromStructure = (structure: any, key?: string): any => {
  const componentRegistry = getComponentRegistry();
  const Component = componentRegistry[structure.type];
  if (!Component) {
    console.error(`Unknown component type: ${structure.type}`);
    return null;
  }

  const children = structure.children?.map((child: any, index: number) =>
    buildElementFromStructure(child, `${key || 'root'}-${index}`)
  );

  return (
    <Element key={key} canvas is={Component} {...structure.props}>
      {children}
    </Element>
  );
};

const categories = templateData.categories;

// Convert JSON templates to usable format
const convertTemplates = (categoryId: string) => {
  const templates = templateData.templates[categoryId] || [];
  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    element: buildElementFromStructure(template.structure, template.id),
  }));
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
  const [selectedCategory, setSelectedCategory] = useState("hero");
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

  const templates = convertTemplates(selectedCategory);

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
              <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${selectedCategory === category.id
                          ? "bg-primary-500 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right content - Templates */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <motion.button
                      key={template.id}
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
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center">
                        <div className="text-center p-4">
                          <div className="text-4xl mb-2">📄</div>
                          <div className="text-sm text-gray-500 font-medium">
                            {template.name}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors" />
                      </div>
                      {/* Template Name */}
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-center">
                          {template.name}
                        </h4>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {templates.length === 0 && (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">
                      No templates available for this category yet.
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

