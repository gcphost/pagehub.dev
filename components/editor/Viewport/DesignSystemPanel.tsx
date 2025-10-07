import { ROOT_NODE, useEditor } from "@craftjs/core";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TbChevronDown, TbChevronRight, TbGripVertical, TbPalette, TbPlus, TbRuler, TbTrash, TbX } from "react-icons/tb";
import { useRecoilState } from "recoil";
import colors from "tailwindcss/lib/public/colors";
import { DEFAULT_PALETTE, DEFAULT_STYLE_GUIDE } from "utils/defaults";
import { getStyleSheets } from "utils/lib";
import { fonts } from "utils/tailwind";
import { ColorPickerAtom } from "../Toolbar/Tools/ColorPickerDialog";
import { FontFamilyDialogAtom } from "../Toolbar/Tools/FontFamilyDialog";

interface DesignSystemPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemPanel = ({ isOpen, onClose }: DesignSystemPanelProps) => {
  const { actions, query } = useEditor();
  const [activeTab, setActiveTab] = useState<"colors" | "styles">("colors");
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [fontDialog, setFontDialog] = useRecoilState(FontFamilyDialogAtom);
  const [colorDialog, setColorDialog] = useRecoilState(ColorPickerAtom);
  const headingFontButtonRef = useRef<HTMLButtonElement>(null);
  const bodyFontButtonRef = useRef<HTMLButtonElement>(null);
  const colorButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const inputBorderColorButtonRef = useRef<HTMLButtonElement>(null);
  const inputBgColorButtonRef = useRef<HTMLButtonElement>(null);
  const inputTextColorButtonRef = useRef<HTMLButtonElement>(null);
  const inputPlaceholderColorButtonRef = useRef<HTMLButtonElement>(null);
  const inputFocusRingColorButtonRef = useRef<HTMLButtonElement>(null);
  const linkColorButtonRef = useRef<HTMLButtonElement>(null);
  const linkHoverColorButtonRef = useRef<HTMLButtonElement>(null);

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    spacing: true,
    typography: false,
    effects: false,
    forms: false,
    links: false,
  });

  // Color Palette State
  const [pallets, setPallets] = useState(DEFAULT_PALETTE);

  // Style Guide State
  const [borderRadius, setBorderRadius] = useState(DEFAULT_STYLE_GUIDE.borderRadius);
  const [buttonPadding, setButtonPadding] = useState(DEFAULT_STYLE_GUIDE.buttonPadding);
  const [containerSpacing, setContainerSpacing] = useState(DEFAULT_STYLE_GUIDE.containerSpacing);
  const [sectionGap, setSectionGap] = useState(DEFAULT_STYLE_GUIDE.sectionGap);
  const [containerGap, setContainerGap] = useState(DEFAULT_STYLE_GUIDE.containerGap);
  const [contentWidth, setContentWidth] = useState(DEFAULT_STYLE_GUIDE.contentWidth);
  const [headingFont, setHeadingFont] = useState(DEFAULT_STYLE_GUIDE.headingFont);
  const [headingFontFamily, setHeadingFontFamily] = useState(DEFAULT_STYLE_GUIDE.headingFontFamily);
  const [bodyFont, setBodyFont] = useState(DEFAULT_STYLE_GUIDE.bodyFont);
  const [bodyFontFamily, setBodyFontFamily] = useState(DEFAULT_STYLE_GUIDE.bodyFontFamily);
  const [shadowStyle, setShadowStyle] = useState(DEFAULT_STYLE_GUIDE.shadowStyle);

  // Form Input State
  const [inputBorderWidth, setInputBorderWidth] = useState(DEFAULT_STYLE_GUIDE.inputBorderWidth);
  const [inputBorderColor, setInputBorderColor] = useState(DEFAULT_STYLE_GUIDE.inputBorderColor);
  const [inputBorderRadius, setInputBorderRadius] = useState(DEFAULT_STYLE_GUIDE.inputBorderRadius);
  const [inputPadding, setInputPadding] = useState(DEFAULT_STYLE_GUIDE.inputPadding);
  const [inputBgColor, setInputBgColor] = useState(DEFAULT_STYLE_GUIDE.inputBgColor);
  const [inputTextColor, setInputTextColor] = useState(DEFAULT_STYLE_GUIDE.inputTextColor);
  const [inputPlaceholderColor, setInputPlaceholderColor] = useState(DEFAULT_STYLE_GUIDE.inputPlaceholderColor);
  const [inputFocusRing, setInputFocusRing] = useState(DEFAULT_STYLE_GUIDE.inputFocusRing);
  const [inputFocusRingColor, setInputFocusRingColor] = useState(DEFAULT_STYLE_GUIDE.inputFocusRingColor);

  // Link State
  const [linkColor, setLinkColor] = useState(DEFAULT_STYLE_GUIDE.linkColor);
  const [linkHoverColor, setLinkHoverColor] = useState(DEFAULT_STYLE_GUIDE.linkHoverColor);
  const [linkUnderline, setLinkUnderline] = useState(DEFAULT_STYLE_GUIDE.linkUnderline);
  const [linkUnderlineOffset, setLinkUnderlineOffset] = useState(DEFAULT_STYLE_GUIDE.linkUnderlineOffset);

  // Track if we're currently saving
  const isSaving = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedData = useRef<any>(null);

  // Subscribe to ROOT_NODE changes (for undo/redo and other updates)
  const rootNodeData = useEditor((state) => {
    const rootNode = state.nodes[ROOT_NODE];
    return rootNode?.data?.props || {};
  });

  // Load Google Fonts for preview
  useEffect(() => {
    // Load all font families with Google Fonts CSS2 API for better performance
    const families = fonts
      .map((font) => {
        const family = font[0].replace(/ +/g, "+");
        return `family=${family}:wght@400`;
      })
      .join("&");

    const sheetrefs = getStyleSheets();
    let href = `https://fonts.googleapis.com/css2?${families}`;
    href += "&display=swap";

    if (!sheetrefs.includes(href)) {
      const head = document.getElementsByTagName("HEAD")[0];

      // Use preload pattern for faster font loading
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "style";
      preloadLink.href = href;

      // Convert to stylesheet after loading
      preloadLink.onload = function () {
        (this as HTMLLinkElement).onload = null;
        (this as HTMLLinkElement).rel = "stylesheet";
      };

      head.appendChild(preloadLink);
    }
  }, []);

  // Load current values from ROOT_NODE when panel opens
  useEffect(() => {
    if (isOpen) {
      try {
        // Load palette
        if (rootNodeData.pallet && Array.isArray(rootNodeData.pallet)) {
          setPallets(rootNodeData.pallet);
        } else {
          setPallets(DEFAULT_PALETTE);
        }

        // Load style guide
        const styleGuide = rootNodeData.styleGuide || {};
        setBorderRadius(styleGuide.borderRadius || DEFAULT_STYLE_GUIDE.borderRadius);
        setButtonPadding(styleGuide.buttonPadding || DEFAULT_STYLE_GUIDE.buttonPadding);
        setContainerSpacing(styleGuide.containerSpacing || DEFAULT_STYLE_GUIDE.containerSpacing);
        setSectionGap(styleGuide.sectionGap || DEFAULT_STYLE_GUIDE.sectionGap);
        setContainerGap(styleGuide.containerGap || DEFAULT_STYLE_GUIDE.containerGap);
        setContentWidth(styleGuide.contentWidth || DEFAULT_STYLE_GUIDE.contentWidth);
        setHeadingFont(styleGuide.headingFont || DEFAULT_STYLE_GUIDE.headingFont);
        setHeadingFontFamily(styleGuide.headingFontFamily || DEFAULT_STYLE_GUIDE.headingFontFamily);
        setBodyFont(styleGuide.bodyFont || DEFAULT_STYLE_GUIDE.bodyFont);
        setBodyFontFamily(styleGuide.bodyFontFamily || DEFAULT_STYLE_GUIDE.bodyFontFamily);
        setShadowStyle(styleGuide.shadowStyle || DEFAULT_STYLE_GUIDE.shadowStyle);
        setInputBorderWidth(styleGuide.inputBorderWidth || DEFAULT_STYLE_GUIDE.inputBorderWidth);
        setInputBorderColor(styleGuide.inputBorderColor || DEFAULT_STYLE_GUIDE.inputBorderColor);
        setInputBorderRadius(styleGuide.inputBorderRadius || DEFAULT_STYLE_GUIDE.inputBorderRadius);
        setInputPadding(styleGuide.inputPadding || DEFAULT_STYLE_GUIDE.inputPadding);
        setInputBgColor(styleGuide.inputBgColor || DEFAULT_STYLE_GUIDE.inputBgColor);
        setInputTextColor(styleGuide.inputTextColor || DEFAULT_STYLE_GUIDE.inputTextColor);
        setInputPlaceholderColor(styleGuide.inputPlaceholderColor || DEFAULT_STYLE_GUIDE.inputPlaceholderColor);
        setInputFocusRing(styleGuide.inputFocusRing || DEFAULT_STYLE_GUIDE.inputFocusRing);
        setInputFocusRingColor(styleGuide.inputFocusRingColor || DEFAULT_STYLE_GUIDE.inputFocusRingColor);
        setLinkColor(styleGuide.linkColor || DEFAULT_STYLE_GUIDE.linkColor);
        setLinkHoverColor(styleGuide.linkHoverColor || DEFAULT_STYLE_GUIDE.linkHoverColor);
        setLinkUnderline(styleGuide.linkUnderline || DEFAULT_STYLE_GUIDE.linkUnderline);
        setLinkUnderlineOffset(styleGuide.linkUnderlineOffset || DEFAULT_STYLE_GUIDE.linkUnderlineOffset);

        // Store what we loaded
        lastSavedData.current = {
          pallet: rootNodeData.pallet,
          styleGuide: rootNodeData.styleGuide,
        };
      } catch (e) {
        console.error("Error loading design system:", e);
      }
    }
  }, [isOpen]);

  // Only update from external changes (undo/redo) - not from our own saves
  useEffect(() => {
    if (isOpen && !isSaving.current && lastSavedData.current) {
      // Check if the data actually changed from what we last saved
      const dataChanged =
        JSON.stringify(rootNodeData.pallet) !== JSON.stringify(lastSavedData.current.pallet) ||
        JSON.stringify(rootNodeData.styleGuide) !== JSON.stringify(lastSavedData.current.styleGuide);

      if (dataChanged) {
        try {
          // Load palette
          if (rootNodeData.pallet && Array.isArray(rootNodeData.pallet)) {
            setPallets(rootNodeData.pallet);
          } else {
            setPallets(DEFAULT_PALETTE);
          }

          // Load style guide
          const styleGuide = rootNodeData.styleGuide || {};
          setBorderRadius(styleGuide.borderRadius || DEFAULT_STYLE_GUIDE.borderRadius);
          setButtonPadding(styleGuide.buttonPadding || DEFAULT_STYLE_GUIDE.buttonPadding);
          setContainerSpacing(styleGuide.containerSpacing || DEFAULT_STYLE_GUIDE.containerSpacing);
          setSectionGap(styleGuide.sectionGap || DEFAULT_STYLE_GUIDE.sectionGap);
          setContainerGap(styleGuide.containerGap || DEFAULT_STYLE_GUIDE.containerGap);
          setContentWidth(styleGuide.contentWidth || DEFAULT_STYLE_GUIDE.contentWidth);
          setHeadingFont(styleGuide.headingFont || DEFAULT_STYLE_GUIDE.headingFont);
          setHeadingFontFamily(styleGuide.headingFontFamily || DEFAULT_STYLE_GUIDE.headingFontFamily);
          setBodyFont(styleGuide.bodyFont || DEFAULT_STYLE_GUIDE.bodyFont);
          setBodyFontFamily(styleGuide.bodyFontFamily || DEFAULT_STYLE_GUIDE.bodyFontFamily);
          setShadowStyle(styleGuide.shadowStyle || DEFAULT_STYLE_GUIDE.shadowStyle);
          setInputBorderWidth(styleGuide.inputBorderWidth || DEFAULT_STYLE_GUIDE.inputBorderWidth);
          setInputBorderColor(styleGuide.inputBorderColor || DEFAULT_STYLE_GUIDE.inputBorderColor);
          setInputBorderRadius(styleGuide.inputBorderRadius || DEFAULT_STYLE_GUIDE.inputBorderRadius);
          setInputPadding(styleGuide.inputPadding || DEFAULT_STYLE_GUIDE.inputPadding);
          setInputBgColor(styleGuide.inputBgColor || DEFAULT_STYLE_GUIDE.inputBgColor);
          setInputTextColor(styleGuide.inputTextColor || DEFAULT_STYLE_GUIDE.inputTextColor);
          setInputPlaceholderColor(styleGuide.inputPlaceholderColor || DEFAULT_STYLE_GUIDE.inputPlaceholderColor);
          setInputFocusRing(styleGuide.inputFocusRing || DEFAULT_STYLE_GUIDE.inputFocusRing);
          setInputFocusRingColor(styleGuide.inputFocusRingColor || DEFAULT_STYLE_GUIDE.inputFocusRingColor);
          setLinkColor(styleGuide.linkColor || DEFAULT_STYLE_GUIDE.linkColor);
          setLinkHoverColor(styleGuide.linkHoverColor || DEFAULT_STYLE_GUIDE.linkHoverColor);
          setLinkUnderline(styleGuide.linkUnderline || DEFAULT_STYLE_GUIDE.linkUnderline);
          setLinkUnderlineOffset(styleGuide.linkUnderlineOffset || DEFAULT_STYLE_GUIDE.linkUnderlineOffset);

          // Update last saved data
          lastSavedData.current = {
            pallet: rootNodeData.pallet,
            styleGuide: rootNodeData.styleGuide,
          };
        } catch (e) {
          console.error("Error loading design system:", e);
        }
      }
    }
  }, [rootNodeData]);

  // Debounced auto-save when values change
  useEffect(() => {
    if (isOpen && lastSavedData.current) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout to save after 300ms of no changes
      saveTimeoutRef.current = setTimeout(() => {
        isSaving.current = true;

        try {
          const newData = {
            pallet: pallets,
            styleGuide: {
              borderRadius,
              buttonPadding,
              containerSpacing,
              sectionGap,
              containerGap,
              contentWidth,
              headingFont,
              headingFontFamily,
              bodyFont,
              bodyFontFamily,
              shadowStyle,
              inputBorderWidth,
              inputBorderColor,
              inputBorderRadius,
              inputPadding,
              inputBgColor,
              inputTextColor,
              inputPlaceholderColor,
              inputFocusRing,
              inputFocusRingColor,
              linkColor,
              linkHoverColor,
              linkUnderline,
              linkUnderlineOffset,
            },
          };

          actions.setProp(ROOT_NODE, (props) => {
            props.pallet = newData.pallet;
            props.styleGuide = newData.styleGuide;
          });

          // Update last saved data
          lastSavedData.current = newData;
        } catch (e) {
          console.error("Error saving design system:", e);
        }

        // Reset saving flag after a short delay
        setTimeout(() => {
          isSaving.current = false;
        }, 100);
      }, 300);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isOpen, pallets, borderRadius, buttonPadding, containerSpacing, sectionGap, containerGap, contentWidth, headingFont, headingFontFamily, bodyFont, bodyFontFamily, shadowStyle, inputBorderWidth, inputBorderColor, inputBorderRadius, inputPadding, inputBgColor, inputTextColor, inputPlaceholderColor, inputFocusRing, inputFocusRingColor, linkColor, linkHoverColor, linkUnderline, linkUnderlineOffset]);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Helper to convert Tailwind color to hex for preview
  const getColorPreview = (colorValue: any): string => {
    // Handle null/undefined
    if (!colorValue) {
      return '#3b82f6';
    }

    // Convert to string if it's not already
    const colorStr = typeof colorValue === 'string' ? colorValue : String(colorValue);

    // If it's already a hex or rgba, return it
    if (colorStr.startsWith('#') || colorStr.startsWith('rgba')) {
      return colorStr;
    }

    // Handle palette references like "palette:Primary"
    if (colorStr.startsWith('palette:')) {
      const paletteName = colorStr.replace('palette:', '').trim();
      const paletteColor = pallets.find(p => p.name === paletteName);
      if (paletteColor) {
        // Recursively resolve the palette color
        return getColorPreview(paletteColor.color);
      }
    }

    // Handle special color names
    const colorMap: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'transparent': 'transparent',
    };

    if (colorMap[colorStr]) {
      return colorMap[colorStr];
    }

    // Try to parse Tailwind color like "blue-500"
    const parts = colorStr.split('-');
    if (parts.length === 2) {
      const [colorName, shade] = parts;
      if (colors[colorName] && colors[colorName][shade]) {
        return colors[colorName][shade];
      }
    }

    // Fallback to a default color
    return '#3b82f6';
  };

  const updateColor = (index: number, color: any) => {
    const newPallets = [...pallets];

    // Convert color to string format
    let colorValue: string;
    if (typeof color === 'string') {
      colorValue = color;
    } else if (color && typeof color === 'object') {
      // Handle {type, value} format from color picker
      if (color.value) {
        if (typeof color.value === 'string') {
          // If it's a palette reference like "palette:Primary", resolve it to the actual color
          if (color.value.startsWith('palette:')) {
            const paletteName = color.value.replace('palette:', '').trim();
            const paletteColor = pallets.find(p => p.name === paletteName);
            colorValue = paletteColor ? paletteColor.color : color.value;
          } else {
            colorValue = color.value;
          }
        } else if (color.value.r !== undefined) {
          // RGBA object
          colorValue = `rgba(${color.value.r},${color.value.g},${color.value.b},${color.value.a})`;
        } else {
          colorValue = String(color.value);
        }
      } else if (color.r !== undefined) {
        // Direct RGBA object
        colorValue = `rgba(${color.r},${color.g},${color.b},${color.a})`;
      } else {
        colorValue = String(color);
      }
    } else {
      colorValue = String(color);
    }

    newPallets[index] = { ...newPallets[index], color: colorValue };
    setPallets(newPallets);
  };

  const openColorPicker = (index: number) => {
    const buttonRef = colorButtonRefs.current[index];
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: pallets[index].color,
        prefix: "",
        changed: (value: any) => {
          updateColor(index, value);
        },
        e: rect,
      });
    }
  };

  const updateColorName = (index: number, name: string) => {
    const newPallets = [...pallets];
    newPallets[index] = { ...newPallets[index], name };
    setPallets(newPallets);
  };

  const addColor = () => {
    setPallets([...pallets, { name: "New Color", color: "#3b82f6" }]);
  };

  const deleteColor = (index: number) => {
    const newPallets = pallets.filter((_, i) => i !== index);
    setPallets(newPallets);
  };

  // Font picker handlers
  const openHeadingFontPicker = () => {
    if (headingFontButtonRef.current) {
      const rect = headingFontButtonRef.current.getBoundingClientRect();
      // Convert string to array format for the dialog
      const currentFont = headingFontFamily ? headingFontFamily.split(", ") : [];
      setFontDialog({
        enabled: true,
        value: currentFont,
        changed: (value: any) => {
          // Store as comma-separated string
          setHeadingFontFamily(Array.isArray(value) ? value.join(", ") : value);
        },
        e: rect,
      });
    }
  };

  const openBodyFontPicker = () => {
    if (bodyFontButtonRef.current) {
      const rect = bodyFontButtonRef.current.getBoundingClientRect();
      // Convert string to array format for the dialog
      const currentFont = bodyFontFamily ? bodyFontFamily.split(", ") : [];
      setFontDialog({
        enabled: true,
        value: currentFont,
        changed: (value: any) => {
          // Store as comma-separated string
          setBodyFontFamily(Array.isArray(value) ? value.join(", ") : value);
        },
        e: rect,
      });
    }
  };

  const openInputBorderColorPicker = () => {
    if (inputBorderColorButtonRef.current) {
      const rect = inputBorderColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: inputBorderColor,
        prefix: "",
        changed: (value: any) => {
          // Just save the color value without prefix
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setInputBorderColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openInputBgColorPicker = () => {
    if (inputBgColorButtonRef.current) {
      const rect = inputBgColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: inputBgColor,
        prefix: "",
        changed: (value: any) => {
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setInputBgColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openInputTextColorPicker = () => {
    if (inputTextColorButtonRef.current) {
      const rect = inputTextColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: inputTextColor,
        prefix: "",
        changed: (value: any) => {
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setInputTextColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openInputPlaceholderColorPicker = () => {
    if (inputPlaceholderColorButtonRef.current) {
      const rect = inputPlaceholderColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: inputPlaceholderColor,
        prefix: "",
        changed: (value: any) => {
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setInputPlaceholderColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openInputFocusRingColorPicker = () => {
    if (inputFocusRingColorButtonRef.current) {
      const rect = inputFocusRingColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: inputFocusRingColor,
        prefix: "",
        changed: (value: any) => {
          // Just save the color value without prefix
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setInputFocusRingColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openLinkColorPicker = () => {
    if (linkColorButtonRef.current) {
      const rect = linkColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: linkColor,
        prefix: "",
        changed: (value: any) => {
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setLinkColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const openLinkHoverColorPicker = () => {
    if (linkHoverColorButtonRef.current) {
      const rect = linkHoverColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: linkHoverColor,
        prefix: "",
        changed: (value: any) => {
          let colorValue = value.value || value;
          if (typeof colorValue === 'string') {
            setLinkHoverColor(colorValue);
          }
        },
        e: rect,
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const CollapsibleSection = ({ title, section, children }: { title: string; section: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-200">{title}</span>
        {expandedSections[section] ? (
          <TbChevronDown className="text-gray-400" size={18} />
        ) : (
          <TbChevronRight className="text-gray-400" size={18} />
        )}
      </button>
      {expandedSections[section] && (
        <div className="p-3 space-y-3 bg-gray-800/50">
          {children}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
      className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-80 max-h-[80vh] flex flex-col z-[9999]"
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-gray-700 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <TbGripVertical className="text-gray-500" />
          <h2 className="text-lg font-bold text-white">Design System</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <TbX size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("colors")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "colors"
            ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800"
            : "text-gray-400 hover:text-gray-200"
            }`}
        >
          <TbPalette size={18} />
          Colors
        </button>
        <button
          onClick={() => setActiveTab("styles")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "styles"
            ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800"
            : "text-gray-400 hover:text-gray-200"
            }`}
        >
          <TbRuler size={18} />
          Styles
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar">
        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-2 p-4">
            {pallets.map((pallet, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <button
                  ref={(el) => { colorButtonRefs.current[index] = el; }}
                  onClick={() => openColorPicker(index)}
                  className="w-10 h-10 rounded cursor-pointer border-2 border-gray-700 flex-shrink-0 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: getColorPreview(pallet.color) }}
                  title="Click to change color"
                />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={pallet.name}
                    onChange={(e) => updateColorName(index, e.target.value)}
                    className="w-full text-sm font-medium text-white bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                    placeholder="Color name"
                  />
                  <div className="text-xs text-gray-400 px-1">
                    {typeof pallet.color === 'string' ? pallet.color : JSON.stringify(pallet.color)}
                  </div>
                </div>
                <button
                  onClick={() => deleteColor(index)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity p-1"
                  title="Delete color"
                >
                  <TbTrash size={16} />
                </button>
              </div>
            ))}

            {/* Add Color Button */}
            <button
              onClick={addColor}
              className="w-full mt-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-white text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <TbPlus size={16} />
              Add Color
            </button>
          </div>
        )}

        {/* Styles Tab */}
        {activeTab === "styles" && (
          <div>
            <CollapsibleSection title="Spacing & Layout" section="spacing">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Button Padding
                </label>
                <select
                  value={buttonPadding}
                  onChange={(e) => setButtonPadding(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="px-3 py-1">Small</option>
                  <option value="px-4 py-2">Medium</option>
                  <option value="px-6 py-3">Large</option>
                  <option value="px-8 py-4">XL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Container Padding
                </label>
                <select
                  value={containerSpacing}
                  onChange={(e) => setContainerSpacing(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="p-4">Small</option>
                  <option value="p-6">Medium</option>
                  <option value="p-8">Large</option>
                  <option value="p-12">XL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Section Gap
                </label>
                <select
                  value={sectionGap}
                  onChange={(e) => setSectionGap(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gap-8">Small</option>
                  <option value="gap-12">Medium</option>
                  <option value="gap-16">Large</option>
                  <option value="gap-24">XL</option>
                  <option value="gap-32">2XL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Container Gap
                </label>
                <select
                  value={containerGap}
                  onChange={(e) => setContainerGap(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gap-2">XS</option>
                  <option value="gap-4">Small</option>
                  <option value="gap-6">Medium</option>
                  <option value="gap-8">Large</option>
                  <option value="gap-12">XL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Content Width
                </label>
                <select
                  value={contentWidth}
                  onChange={(e) => setContentWidth(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="max-w-3xl">Small (3XL)</option>
                  <option value="max-w-4xl">Medium (4XL)</option>
                  <option value="max-w-5xl">Large (5XL)</option>
                  <option value="max-w-6xl">XL (6XL)</option>
                  <option value="max-w-7xl">2XL (7XL)</option>
                  <option value="max-w-full">Full Width</option>
                </select>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Typography" section="typography">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Heading Font Weight
                </label>
                <select
                  value={headingFont}
                  onChange={(e) => setHeadingFont(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semibold</option>
                  <option value="font-bold">Bold</option>
                  <option value="font-extrabold">Extra Bold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Heading Font Family
                </label>
                <button
                  ref={headingFontButtonRef}
                  onClick={openHeadingFontPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: headingFontFamily }}
                >
                  {headingFontFamily || "Select font..."}
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Body Font Weight
                </label>
                <select
                  value={bodyFont}
                  onChange={(e) => setBodyFont(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-thin">Thin</option>
                  <option value="font-extralight">Extra Light</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semibold</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Body Font Family
                </label>
                <button
                  ref={bodyFontButtonRef}
                  onClick={openBodyFontPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: bodyFontFamily }}
                >
                  {bodyFontFamily || "Select font..."}
                </button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Effects & Borders" section="effects">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Border Radius
                </label>
                <select
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rounded-none">None</option>
                  <option value="rounded-sm">Small</option>
                  <option value="rounded">Default</option>
                  <option value="rounded-md">Medium</option>
                  <option value="rounded-lg">Large</option>
                  <option value="rounded-xl">XL</option>
                  <option value="rounded-2xl">2XL</option>
                  <option value="rounded-full">Full</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Shadow Style
                </label>
                <select
                  value={shadowStyle}
                  onChange={(e) => setShadowStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="shadow-none">None</option>
                  <option value="shadow-sm">Small</option>
                  <option value="shadow">Default</option>
                  <option value="shadow-md">Medium</option>
                  <option value="shadow-lg">Large</option>
                  <option value="shadow-xl">XL</option>
                  <option value="shadow-2xl">2XL</option>
                </select>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Form Inputs" section="forms">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Input Padding
                </label>
                <select
                  value={inputPadding}
                  onChange={(e) => setInputPadding(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="px-2 py-1">Small</option>
                  <option value="px-3 py-2">Medium</option>
                  <option value="px-4 py-2">Large</option>
                  <option value="px-4 py-3">XL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Border Width
                </label>
                <select
                  value={inputBorderWidth}
                  onChange={(e) => setInputBorderWidth(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="border-0">None</option>
                  <option value="border">1px</option>
                  <option value="border-2">2px</option>
                  <option value="border-4">4px</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Border Color
                </label>
                <button
                  ref={inputBorderColorButtonRef}
                  onClick={openInputBorderColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(inputBorderColor) }}
                  />
                  <span className="flex-1 truncate">{inputBorderColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Border Radius
                </label>
                <select
                  value={inputBorderRadius}
                  onChange={(e) => setInputBorderRadius(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rounded-none">None</option>
                  <option value="rounded-sm">Small</option>
                  <option value="rounded">Default</option>
                  <option value="rounded-md">Medium</option>
                  <option value="rounded-lg">Large</option>
                  <option value="rounded-xl">XL</option>
                  <option value="rounded-full">Full</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Background Color
                </label>
                <button
                  ref={inputBgColorButtonRef}
                  onClick={openInputBgColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(inputBgColor) }}
                  />
                  <span className="flex-1 truncate">{inputBgColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Text Color
                </label>
                <button
                  ref={inputTextColorButtonRef}
                  onClick={openInputTextColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(inputTextColor) }}
                  />
                  <span className="flex-1 truncate">{inputTextColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Placeholder Color
                </label>
                <button
                  ref={inputPlaceholderColorButtonRef}
                  onClick={openInputPlaceholderColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(inputPlaceholderColor) }}
                  />
                  <span className="flex-1 truncate">{inputPlaceholderColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Focus Ring Size
                </label>
                <select
                  value={inputFocusRing}
                  onChange={(e) => setInputFocusRing(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ring-0">None</option>
                  <option value="ring-1">1px</option>
                  <option value="ring-2">2px</option>
                  <option value="ring-4">4px</option>
                  <option value="ring">3px (Default)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Focus Ring Color
                </label>
                <button
                  ref={inputFocusRingColorButtonRef}
                  onClick={openInputFocusRingColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(inputFocusRingColor) }}
                  />
                  <span className="flex-1 truncate">{inputFocusRingColor}</span>
                </button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Links" section="links">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Link Color
                </label>
                <button
                  ref={linkColorButtonRef}
                  onClick={openLinkColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(linkColor) }}
                  />
                  <span className="flex-1 truncate">{linkColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Link Hover Color
                </label>
                <button
                  ref={linkHoverColorButtonRef}
                  onClick={openLinkHoverColorPicker}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm text-left hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border border-gray-600"
                    style={{ backgroundColor: getColorPreview(linkHoverColor) }}
                  />
                  <span className="flex-1 truncate">{linkHoverColor}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Link Underline
                </label>
                <select
                  value={linkUnderline}
                  onChange={(e) => setLinkUnderline(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="no-underline">None</option>
                  <option value="underline">Always</option>
                  <option value="hover:underline">On Hover</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Underline Offset
                </label>
                <select
                  value={linkUnderlineOffset}
                  onChange={(e) => setLinkUnderlineOffset(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="underline-offset-auto">Auto</option>
                  <option value="underline-offset-1">1px</option>
                  <option value="underline-offset-2">2px</option>
                  <option value="underline-offset-4">4px</option>
                  <option value="underline-offset-8">8px</option>
                </select>
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Changes apply instantly ⚡
        </p>
      </div>
    </motion.div>
  );
};
