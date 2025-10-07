import { Editor } from '@tiptap/react';
import { Tooltip } from 'components/layout/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import {
  MdFontDownload,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatColorFill,
  MdFormatIndentIncrease,
  MdFormatItalic,
  MdFormatLineSpacing,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdImage,
  MdLink,
  MdMoreVert,
  MdSubscript,
  MdSuperscript
} from 'react-icons/md';
import { TbEraser } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { getStyleSheets } from 'utils/lib';
import { fonts } from 'utils/tailwind';
import { ColorPickerAtom, ColorPickerDialog } from '../Toolbar/Tools/ColorPickerDialog';
import { TextSettingsDropdown } from './TextSettingsDropdown';

interface TiptapToolbarProps {
  editor: Editor | null;
  className?: string;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  className = "mt-2  flex items-center justify-center flex-row z-50 gap-0  pointer-events-auto bg-primary-500 inside-shadow text-white rounded-md p-1.5"
}) => {
  const [showTextFormatting, setShowTextFormatting] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [showAlignmentLists, setShowAlignmentLists] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showHeadings, setShowHeadings] = useState(false);
  const [fontSearchTerm, setFontSearchTerm] = useState('');

  // Color picker state
  const [colorDialog, setColorDialog] = useRecoilState(ColorPickerAtom);
  const backgroundColorButtonRef = useRef<HTMLButtonElement>(null);
  const foregroundColorButtonRef = useRef<HTMLButtonElement>(null);

  // Import Google Fonts from your existing system
  const fontFamilies = fonts.map(font => font[0]);

  // Use Tailwind font sizes converted to CSS values
  const fontSizes = [
    { class: 'text-xs', value: '0.75rem', label: 'xs' },
    { class: 'text-sm', value: '0.875rem', label: 'sm' },
    { class: 'text-base', value: '1rem', label: 'base' },
    { class: 'text-lg', value: '1.125rem', label: 'lg' },
    { class: 'text-xl', value: '1.25rem', label: 'xl' },
    { class: 'text-2xl', value: '1.5rem', label: '2xl' },
    { class: 'text-3xl', value: '1.875rem', label: '3xl' },
    { class: 'text-4xl', value: '2.25rem', label: '4xl' },
    { class: 'text-5xl', value: '3rem', label: '5xl' },
  ];

  // Filter fonts based on search term
  const filteredFonts = fontFamilies.filter(font =>
    font.toLowerCase().includes(fontSearchTerm.toLowerCase())
  );

  // Load Google Fonts for the toolbar
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

  if (!editor) {
    return null;
  }

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  // Color picker functions
  const openBackgroundColorPicker = () => {
    if (backgroundColorButtonRef.current) {
      const rect = backgroundColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: editor?.getAttributes('highlight').color || '#ffff00',
        prefix: "bg",
        changed: (value: any) => {
          if (editor) {
            let colorValue: string;
            if (typeof value === 'string') {
              colorValue = value;
            } else if (value && typeof value === 'object' && value.value) {
              if (typeof value.value === 'string') {
                colorValue = value.value;
              } else if (value.value.r !== undefined) {
                colorValue = `rgba(${value.value.r},${value.value.g},${value.value.b},${value.value.a})`;
              } else {
                colorValue = String(value.value);
              }
            } else {
              colorValue = String(value);
            }
            editor.chain().focus().setHighlight({ color: colorValue }).run();
          }
        },
        showPallet: true,
        e: rect,
        propKey: 'backgroundColor',
      });
    }
  };

  const openForegroundColorPicker = () => {
    if (foregroundColorButtonRef.current) {
      const rect = foregroundColorButtonRef.current.getBoundingClientRect();
      setColorDialog({
        enabled: true,
        value: editor?.getAttributes('textStyle').color || '#000000',
        prefix: "text",
        changed: (value: any) => {
          if (editor) {
            let colorValue: string;
            if (typeof value === 'string') {
              colorValue = value;
            } else if (value && typeof value === 'object' && value.value) {
              if (typeof value.value === 'string') {
                colorValue = value.value;
              } else if (value.value.r !== undefined) {
                colorValue = `rgba(${value.value.r},${value.value.g},${value.value.b},${value.value.a})`;
              } else {
                colorValue = String(value.value);
              }
            } else {
              colorValue = String(value);
            }
            editor.chain().focus().setColor(colorValue).run();
          }
        },
        showPallet: true,
        e: rect,
        propKey: 'color',
      });
    }
  };

  return (
    <div className="absolute w-full max-w-[470px]  z-[9999] ">
      <div className={className}>

        {/* Text Settings Dropdown */}
        <TextSettingsDropdown />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Alignment and Lists Dropdown */}
        <div className="relative">
          <Tooltip content="Alignment & Lists" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                setShowAlignmentLists(!showAlignmentLists);
                setShowTextFormatting(false);
                setShowFontOptions(false);
                setShowHeadings(false);
                setShowMoreOptions(false);
              })}
              className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${showAlignmentLists ? 'bg-gray-700 text-white' : ''}`}
            >
              <MdFormatAlignLeft className="w-4 h-4" />
              <MdMoreVert className="w-3 h-3" />
            </button>
          </Tooltip>
          {showAlignmentLists && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg z-50 p-2 min-w-48">
              <div className="grid grid-cols-3 gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('left').run();
                    setShowAlignmentLists(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Left"
                >
                  <MdFormatAlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('center').run();
                    setShowAlignmentLists(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Center"
                >
                  <MdFormatAlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('right').run();
                    setShowAlignmentLists(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Right"
                >
                  <MdFormatAlignRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBulletList().run();
                    setShowAlignmentLists(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('bulletList') ? 'bg-gray-700 text-white' : ''}`}
                  title="Bullet List"
                >
                  <MdFormatListBulleted className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleOrderedList().run();
                    setShowAlignmentLists(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('orderedList') ? 'bg-gray-700 text-white' : ''}`}
                  title="Numbered List"
                >
                  <MdFormatListNumbered className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().liftListItem('listItem').run();
                    setShowAlignmentLists(false);
                  })}
                  className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
                  title="Decrease Indent"
                >
                  <MdFormatIndentIncrease className="w-4 h-4 mx-auto rotate-180" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().sinkListItem('listItem').run();
                    setShowAlignmentLists(false);
                  })}
                  className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
                  title="Increase Indent"
                >
                  <MdFormatIndentIncrease className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Text Formatting Dropdown */}
        <div className="relative">
          <Tooltip content="Text Formatting" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                setShowTextFormatting(!showTextFormatting);
                setShowAlignmentLists(false);
                setShowFontOptions(false);
                setShowHeadings(false);
                setShowMoreOptions(false);
              })}
              className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${showTextFormatting ? 'bg-gray-700 text-white' : ''}`}
            >
              <MdFormatBold className="w-4 h-4" />
              <MdMoreVert className="w-3 h-3" />
            </button>
          </Tooltip>
          {showTextFormatting && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg z-50 p-2 min-w-32">
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBold().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('bold') ? 'bg-gray-700 text-white' : ''}`}
                  title="Bold"
                >
                  <MdFormatBold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleItalic().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('italic') ? 'bg-gray-700 text-white' : ''}`}
                  title="Italic"
                >
                  <MdFormatItalic className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleUnderline().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('underline') ? 'bg-gray-700 text-white' : ''}`}
                  title="Underline"
                >
                  <MdFormatUnderlined className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleStrike().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('strike') ? 'bg-gray-700 text-white' : ''}`}
                  title="Strikethrough"
                >
                  <MdFormatStrikethrough className="w-4 h-4 mx-auto" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSuperscript().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('superscript') ? 'bg-gray-700 text-white' : ''}`}
                  title="Superscript"
                >
                  <MdSuperscript className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSubscript().run();
                    setShowTextFormatting(false);
                  })}
                  className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white ${editor.isActive('subscript') ? 'bg-gray-700 text-white' : ''}`}
                  title="Subscript"
                >
                  <MdSubscript className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Font Options Dropdown */}
        <div className="relative">
          <Tooltip content="Font Options" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                setShowFontOptions(!showFontOptions);
                setShowTextFormatting(false);
                setShowAlignmentLists(false);
                setShowHeadings(false);
                setShowMoreOptions(false);
                if (showFontOptions) {
                  setFontSearchTerm('');
                }
              })}
              className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${showFontOptions ? 'bg-gray-700 text-white' : ''}`}
            >
              <MdFontDownload className="w-4 h-4" />
              <span className="text-xs">Font</span>
              <MdMoreVert className="w-3 h-3" />
            </button>
          </Tooltip>

        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />



        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* More Options Dropdown */}
        <div className="relative">
          <Tooltip content="More Options" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                setShowMoreOptions(!showMoreOptions);
                setShowTextFormatting(false);
                setShowAlignmentLists(false);
                setShowFontOptions(false);
                setShowHeadings(false);
              })}
              className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${showMoreOptions ? 'bg-gray-700 text-white' : ''}`}
            >
              <MdMoreVert className="w-4 h-4" />
            </button>
          </Tooltip>
          {showMoreOptions && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg z-50 p-2 min-w-32">
              <button
                onClick={handleButtonClick(() => {
                  editor.chain().focus().setHorizontalRule().run();
                  setShowMoreOptions(false);
                })}
                className="w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1"
                title="Horizontal Rule"
              >
                <MdFormatLineSpacing className="w-4 h-4" />
                <span>Horizontal Rule</span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Image and Link */}
        <Tooltip content="Insert Image" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
          <button
            onClick={handleButtonClick(() => {
              const url = window.prompt('Enter image URL:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            })}
            className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            <MdImage className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Insert Link" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
          <button
            onClick={handleButtonClick(() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            })}
            className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            <MdLink className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Clear Formatting */}
        <Tooltip content="Clear Formatting" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
          <button
            onClick={handleButtonClick(() => {
              editor.chain().focus().clearNodes().unsetAllMarks().run();
            })}
            className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            <TbEraser className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {showFontOptions && (
        <div className="w-full bg-gray-100 border border-gray-300 rounded shadow-lg z-50 p-4">
          <div className="flex gap-8 h-64">




            {/* Font Family Section */}
            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={fontSearchTerm}
                  onChange={(e) => setFontSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                <div className="grid grid-cols-2 gap-0">
                  {filteredFonts.map((font) => (
                    <button
                      key={font}
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().setFontFamily(font).run();
                        setShowFontOptions(false);
                        setFontSearchTerm('');
                      })}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 hover:text-blue-700 border-b border-gray-100 last:border-b-0 transition-colors"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Size Section */}
            <div className="flex-shrink-0 w-32 flex flex-col">
              {/* Headings Dropdown */}
              <div className="relative">
                <Tooltip content="Headings" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
                  <button
                    onClick={handleButtonClick(() => {
                      setShowHeadings(!showHeadings);
                      setShowTextFormatting(false);
                      setShowAlignmentLists(false);
                      // setShowFontOptions(false);
                      setShowMoreOptions(false);
                    })}
                    className={`px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 ${showHeadings ? 'bg-gray-700 text-white' : ''}`}
                  >
                    <span className="text-xs">Normal</span>
                    <MdMoreVert className="w-3 h-3" />
                  </button>
                </Tooltip>
                {showHeadings && (
                  <div className="absolute top-0 left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg z-50 p-2 min-w-32">
                    <button
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().setParagraph().run();
                        setShowHeadings(false);
                      })}
                      className={`w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white text-left ${editor.isActive('paragraph') ? 'bg-gray-700 text-white' : ''}`}
                      title="Normal Text"
                    >
                      Normal
                    </button>
                    <button
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().toggleHeading({ level: 1 }).run();
                        setShowHeadings(false);
                      })}
                      className={`w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white text-left ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-700 text-white' : ''}`}
                      title="Heading 1"
                    >
                      Heading 1
                    </button>
                    <button
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().toggleHeading({ level: 2 }).run();
                        setShowHeadings(false);
                      })}
                      className={`w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white text-left ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-700 text-white' : ''}`}
                      title="Heading 2"
                    >
                      Heading 2
                    </button>
                    <button
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().toggleHeading({ level: 3 }).run();
                        setShowHeadings(false);
                      })}
                      className={`w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white text-left ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-700 text-white' : ''}`}
                      title="Heading 3"
                    >
                      Heading 3
                    </button>
                    <button
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().toggleHeading({ level: 4 }).run();
                        setShowHeadings(false);
                      })}
                      className={`w-full px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white text-left ${editor.isActive('heading', { level: 4 }) ? 'bg-gray-700 text-white' : ''}`}
                      title="Heading 4"
                    >
                      Heading 4
                    </button>
                  </div>
                )}
              </div>



              <div className="p-1.5 mb-3 flex justify-between">
                {/* Background Color */}
                <div className="relative">
                  <Tooltip content="Background Color" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
                    <button
                      ref={backgroundColorButtonRef}
                      onClick={handleButtonClick(openBackgroundColorPicker)}
                      className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      <MdFormatColorFill className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>

                {/* Foreground Color */}
                <div className="relative">
                  <Tooltip content="Text Color" placement="bottom" tooltipClassName="!text-xs !px-2 !py-1">
                    <button
                      ref={foregroundColorButtonRef}
                      onClick={handleButtonClick(openForegroundColorPicker)}
                      className="px-2 py-1 text-sm rounded hover:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      <MdFormatColorFill className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                <div className="grid grid-cols-1 gap-0">
                  {fontSizes.map((size) => (
                    <button
                      key={size.class}
                      onClick={handleButtonClick(() => {
                        editor.chain().focus().setFontSize(size.value).run();
                        setShowFontOptions(false);
                      })}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-blue-50 hover:text-blue-700 border-b border-gray-100 last:border-b-0 transition-colors ${size.class}`}
                      title={`${size.class} (${size.value})`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Dialog */}
      <ColorPickerDialog />
    </div>
  );
};