import { Editor } from '@tiptap/react';
import { Tooltip } from 'components/layout/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import {
  MdFontDownload,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatIndentIncrease,
  MdFormatItalic,
  MdFormatLineSpacing,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdImage,
  MdLink,
  MdSubscript,
  MdSuperscript
} from 'react-icons/md';
import { TbChevronDown, TbEraser } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { getStyleSheets } from 'utils/lib';
import { isPaletteReference, paletteToCSSVar } from 'utils/palette';
import { fonts } from 'utils/tailwind';
import { DeleteNodeButton } from '../NodeControllers/Tools/DeleteNodeButton';
import { ColorPickerAtom, ColorPickerDialog } from '../Toolbar/Tools/ColorPickerDialog';
import { TextSettingsDropdown } from './TextSettingsDropdown';

interface TiptapToolbarProps {
  editor: Editor | null;
  className?: string;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  className = ""
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

  // Import Google Fonts from your existing system and deduplicate
  const fontFamilies = Array.from(new Set(fonts.map(font => font[0])));

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

            // Convert palette references to CSS variables
            if (isPaletteReference(colorValue)) {
              colorValue = paletteToCSSVar(colorValue);
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

            // Convert palette references to CSS variables
            if (isPaletteReference(colorValue)) {
              colorValue = paletteToCSSVar(colorValue);
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
    <div className="absolute w-fit z-[9999]">
      <div className="h-10 mt-2 flex items-center justify-center flex-row z-50 gap-0 pointer-events-auto tool-bg">


        {/* More Options Dropdown */}
        <div className="group">
          <Tooltip content="More Options" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              className="tool-button"
            >
              <TbChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
          </Tooltip>
          <div className="absolute w-fit left-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-3 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="space-y-2">
              {/* Horizontal Rule */}
              <button
                onClick={handleButtonClick(() => {
                  editor.chain().focus().setHorizontalRule().run();
                })}
                className="w-full px-3 py-2 text-sm rounded hover:bg-gray-700 hover:text-white text-gray-300 transition-colors duration-150 flex items-center gap-2"
                title="Horizontal Rule"
              >
                <MdFormatLineSpacing className="w-4 h-4" />
                <span>Horizontal Rule</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-600 my-2" />

              {/* Text Settings Dropdown */}
              <TextSettingsDropdown />
            </div>
          </div>
        </div>







        <div className="border-l border-gray-500 flex gap-1 pl-2" >
          {/* Alignment and Lists Dropdown */}
          <div className=" group">
            <Tooltip content="Alignment & Lists" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
              <button
                className="tool-button"
              >
                <MdFormatAlignLeft className="w-4 h-4" />
              </button>
            </Tooltip>
            <div className="absolute w-fit left-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-2 pb-0 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('left').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Left"
                >
                  <MdFormatAlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('center').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Center"
                >
                  <MdFormatAlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('right').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-700 text-white' : ''}`}
                  title="Align Right"
                >
                  <MdFormatAlignRight className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBulletList().run();
                  })}
                  className={`tool-button ${editor.isActive('bulletList') ? 'bg-gray-700 text-white' : ''}`}
                  title="Bullet List"
                >
                  <MdFormatListBulleted className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleOrderedList().run();
                  })}
                  className={`tool-button ${editor.isActive('orderedList') ? 'bg-gray-700 text-white' : ''}`}
                  title="Numbered List"
                >
                  <MdFormatListNumbered className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().liftListItem('listItem').run();
                  })}
                  className="tool-button"
                  title="Decrease Indent"
                >
                  <MdFormatIndentIncrease className="w-4 h-4 mx-auto rotate-180" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().sinkListItem('listItem').run();
                  })}
                  className="tool-button"
                  title="Increase Indent"
                >
                  <MdFormatIndentIncrease className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Formatting Dropdown */}
          <div className="group">
            <Tooltip content="Text Formatting" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
              <button
                className="tool-button"
              >
                <MdFormatBold className="w-4 h-4" />
              </button>
            </Tooltip>
            <div className="absolute w-fit left-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-2 pb-0 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBold().run();
                  })}
                  className={`tool-button ${editor.isActive('bold') ? 'bg-gray-700 text-white' : ''}`}
                  title="Bold"
                >
                  <MdFormatBold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleItalic().run();
                  })}
                  className={`tool-button ${editor.isActive('italic') ? 'bg-gray-700 text-white' : ''}`}
                  title="Italic"
                >
                  <MdFormatItalic className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleUnderline().run();
                  })}
                  className={`tool-button ${editor.isActive('underline') ? 'bg-gray-700 text-white' : ''}`}
                  title="Underline"
                >
                  <MdFormatUnderlined className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleStrike().run();
                  })}
                  className={`tool-button ${editor.isActive('strike') ? 'bg-gray-700 text-white' : ''}`}
                  title="Strikethrough"
                >
                  <MdFormatStrikethrough className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSuperscript().run();
                  })}
                  className={`tool-button ${editor.isActive('superscript') ? 'bg-gray-700 text-white' : ''}`}
                  title="Superscript"
                >
                  <MdSuperscript className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSubscript().run();
                  })}
                  className={`tool-button ${editor.isActive('subscript') ? 'bg-gray-700 text-white' : ''}`}
                  title="Subscript"
                >
                  <MdSubscript className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>


          {/* Font Options Dropdown */}
          <div className=" group">
            <Tooltip content="Font Options" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
              <button
                className="tool-button"
              >
                <MdFontDownload className="w-4 h-4" />
                <span className="text-xs">Font</span>
                <TbChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
              </button>
            </Tooltip>
            <div className="absolute right-0 left-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 p-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-8 h-64">
                {/* Font Family Section */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search fonts..."
                      value={fontSearchTerm}
                      onChange={(e) => setFontSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-500 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto border border-gray-600 rounded-lg bg-gray-800">
                    <div className="grid grid-cols-1 gap-0">
                      {filteredFonts.map((font) => (
                        <button
                          key={font}
                          onClick={handleButtonClick(() => {
                            editor.chain().focus().setFontFamily(font).run();
                            setFontSearchTerm('');
                          })}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-700 hover:text-white text-gray-300 border-b border-gray-700 last:border-b-0 transition-colors"
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
                  <div className="mb-3">
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'paragraph') {
                            editor.chain().focus().setParagraph().run();
                          } else {
                            const level = parseInt(value.replace('heading', '')) as 1 | 2 | 3 | 4 | 5 | 6;
                            editor.chain().focus().toggleHeading({ level }).run();
                          }
                        }}
                        value={
                          editor.isActive('paragraph') ? 'paragraph' :
                            editor.isActive('heading', { level: 1 }) ? 'heading1' :
                              editor.isActive('heading', { level: 2 }) ? 'heading2' :
                                editor.isActive('heading', { level: 3 }) ? 'heading3' :
                                  editor.isActive('heading', { level: 4 }) ? 'heading4' :
                                    'paragraph'
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-500 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="paragraph">Normal Text</option>
                        <option value="heading1">Heading 1</option>
                        <option value="heading2">Heading 2</option>
                        <option value="heading3">Heading 3</option>
                        <option value="heading4">Heading 4</option>
                      </select>
                    </div>
                  </div>

                  {/* Font Size Adjuster */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-2">Font Size</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('12px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-gray-700 hover:text-white text-gray-300 transition-colors duration-150"
                        title="Small"
                      >
                        S
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('16px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-gray-700 hover:text-white text-gray-300 transition-colors duration-150"
                        title="Medium"
                      >
                        M
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('20px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-gray-700 hover:text-white text-gray-300 transition-colors duration-150"
                        title="Large"
                      >
                        L
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('24px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-gray-700 hover:text-white text-gray-300 transition-colors duration-150"
                        title="Extra Large"
                      >
                        XL
                      </button>
                    </div>
                  </div>

                  <div className="p-1.5 mb-3 space-y-3">
                    {/* Background Color */}
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Background Color</div>
                      <button
                        ref={backgroundColorButtonRef}
                        onClick={handleButtonClick(openBackgroundColorPicker)}
                        className="w-full h-8 rounded border-2 border-gray-500 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: editor.getAttributes('highlight').color || '#ffffff' }}
                      />
                    </div>

                    {/* Text Color */}
                    <div>
                      <div className="text-xs text-gray-400 mb-2">Text Color</div>
                      <button
                        ref={foregroundColorButtonRef}
                        onClick={handleButtonClick(openForegroundColorPicker)}
                        className="w-full h-8 rounded border-2 border-gray-500 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-l border-gray-500 flex gap-1 pl-2" >
          {/* Image and Link */}
          <Tooltip content="Insert Image" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                const url = window.prompt('Enter image URL:');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              })}
              className="tool-button"
            >
              <MdImage className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Insert Link" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              })}
              className="tool-button"
            >
              <MdLink className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="border-l border-gray-500 flex gap-1 pl-2" >
          {/* Clear Formatting */}
          <Tooltip content="Clear Formatting" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => {
                editor.chain().focus().clearNodes().unsetAllMarks().run();
              })}
              className="tool-button"
            >
              <TbEraser className="w-4 h-4" />
            </button>
          </Tooltip>


          <DeleteNodeButton
            className="tool-button"
            iconSize={14}
          />
        </div>
      </div>

      {/* Color Picker Dialog */}
      <ColorPickerDialog />
    </div >
  );
};
