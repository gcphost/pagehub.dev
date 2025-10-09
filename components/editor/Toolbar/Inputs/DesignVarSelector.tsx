import { useEditor, useNode } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import { changeProp } from "components/editor/Viewport/lib";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TbSearch, TbVariable } from "react-icons/tb";
import { DEFAULT_PALETTE, DEFAULT_STYLE_GUIDE } from "utils/defaults";

interface DesignVar {
  name: string;
  varName: string; // --ph-primary
  value: string; // The actual value
  category: "palette" | "typography" | "spacing" | "colors" | "other";
  label: string; // Display name
}

interface DesignVarSelectorProps {
  propKey: string;
  propType: string;
  viewValue: string;
  prefix?: string; // Like "text", "bg", "border", "font"
}

export const DesignVarSelector: React.FC<DesignVarSelectorProps> = ({
  propKey,
  propType,
  viewValue,
  prefix = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    actions: { setProp },
    id,
  } = useNode((node) => ({
    id: node.id,
  }));

  const { query, actions } = useEditor();

  // Get design system vars - start with defaults, then merge runtime overrides
  const designVarsResult = useEditor((state) => {
    const rootNode = state.nodes[ROOT_NODE];
    const runtimePalette = rootNode?.data?.props?.pallet || [];
    const runtimeStyleGuide = rootNode?.data?.props?.styleGuide || {};

    const vars: DesignVar[] = [];

    // Use runtime palette if available, otherwise use defaults
    const palette = runtimePalette.length > 0 ? runtimePalette : DEFAULT_PALETTE;

    // Palette colors
    palette.forEach((item: any) => {
      if (item?.name && item?.color) {
        const varName = item.name
          .replace(/([A-Z])/g, "-$1")
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/^-/, "");

        vars.push({
          name: item.name,
          varName: `--ph-${varName}`,
          value: item.color,
          category: "palette",
          label: `${item.name} (Palette)`,
        });
      }
    });

    // Merge default style guide with runtime overrides
    const styleGuide = { ...DEFAULT_STYLE_GUIDE, ...runtimeStyleGuide };

    // Style guide vars with categories and labels
    const styleVarMap: Record<string, { category: string; label: string }> = {
      headingFontFamily: { category: "typography", label: "Heading Font Family" },
      bodyFontFamily: { category: "typography", label: "Body Font Family" },
      headingFont: { category: "typography", label: "Heading Font Weight" },
      bodyFont: { category: "typography", label: "Body Font Weight" },
      containerPadding: { category: "spacing", label: "Container Padding" },
      buttonPadding: { category: "spacing", label: "Button Padding" },
      sectionGap: { category: "spacing", label: "Section Gap" },
      containerGap: { category: "spacing", label: "Container Gap" },
      contentWidth: { category: "spacing", label: "Content Width" },
      borderRadius: { category: "other", label: "Border Radius" },
      shadowStyle: { category: "other", label: "Shadow Style" },
      inputBorderColor: { category: "colors", label: "Input Border Color" },
      inputBorderWidth: { category: "other", label: "Input Border Width" },
      inputBorderRadius: { category: "other", label: "Input Border Radius" },
      inputPadding: { category: "spacing", label: "Input Padding" },
      inputBgColor: { category: "colors", label: "Input Background" },
      inputTextColor: { category: "colors", label: "Input Text" },
      inputPlaceholderColor: { category: "colors", label: "Input Placeholder" },
      inputFocusRing: { category: "other", label: "Input Focus Ring" },
      inputFocusRingColor: { category: "colors", label: "Input Focus Ring Color" },
      linkColor: { category: "colors", label: "Link Color" },
      linkHoverColor: { category: "colors", label: "Link Hover Color" },
      linkUnderline: { category: "other", label: "Link Underline" },
      linkUnderlineOffset: { category: "other", label: "Link Underline Offset" },
    };

    Object.entries(styleGuide).forEach(([key, value]) => {
      if (value && styleVarMap[key]) {
        const varName = key
          .replace(/([A-Z])/g, "-$1")
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/^-/, "");

        vars.push({
          name: key,
          varName: `--ph-${varName}`,
          value: String(value),
          category: styleVarMap[key].category as any,
          label: styleVarMap[key].label,
        });
      }
    });

    return vars;
  });

  // Ensure designVars is always an array
  // useEditor can return an object with numeric keys, so we need to handle that
  let designVars: DesignVar[] = [];
  if (Array.isArray(designVarsResult)) {
    designVars = designVarsResult;
  } else if (designVarsResult && typeof designVarsResult === 'object') {
    // Convert object with numeric keys to array
    designVars = Object.keys(designVarsResult)
      .filter(key => !isNaN(Number(key))) // Only numeric keys
      .map(key => designVarsResult[key])
      .filter(item => item && typeof item === 'object' && 'varName' in item); // Valid DesignVar objects
  }

  // Filter vars by search term
  const filteredVars = designVars.filter((v) =>
    v.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.varName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedVars = filteredVars.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {} as Record<string, DesignVar[]>);

  // Handle selecting a variable
  const handleSelect = (designVar: DesignVar) => {
    let view = viewValue;
    if (propType === "component" || propType === "root") {
      view = "component";
    }

    // Build the Tailwind arbitrary value
    // e.g., "text-[var(--ph-primary)]" or "bg-[var(--ph-heading-font-family)]"
    const value = prefix
      ? `${prefix}-[var(${designVar.varName})]`
      : `[var(${designVar.varName})]`;

    console.log('Setting design var:', {
      propKey,
      value,
      designVar: designVar.varName,
    });

    changeProp({
      propKey,
      value,
      setProp,
      propType,
      view,
      query,
      actions,
      nodeId: id,
    });

    setIsOpen(false);
    setSearchTerm("");
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const categoryLabels = {
    palette: "Palette Colors",
    typography: "Typography",
    spacing: "Spacing",
    colors: "Theme Colors",
    other: "Other",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-600 transition-colors text-gray-400 hover:text-white"
        title="Bind to design system variable"
      >
        <TbVariable className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-[9999] max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="p-3 border-b border-gray-700">
              <div className="relative">
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search design variables..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Variable list */}
            <div className="overflow-y-auto flex-1 p-2">
              {Object.keys(groupedVars).length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No variables found
                </div>
              ) : (
                Object.entries(groupedVars).map(([category, vars]) => (
                  <div key={category} className="mb-3 last:mb-0">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {categoryLabels[category as keyof typeof categoryLabels] || category}
                    </div>
                    <div className="space-y-1">
                      {(vars as DesignVar[]).map((v) => (
                        <button
                          key={v.varName}
                          onClick={() => handleSelect(v)}
                          className="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white font-medium truncate">{v.label}</span>
                            <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                              {v.varName}
                            </span>
                          </div>
                          {v.category === "palette" && (
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className="w-4 h-4 rounded border border-gray-600"
                                style={{ backgroundColor: v.value }}
                              />
                              <span className="text-xs text-gray-500">{v.value}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

