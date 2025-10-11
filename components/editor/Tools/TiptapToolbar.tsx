import { ROOT_NODE, useEditor as useCraftEditor } from '@craftjs/core';
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
import { TbChevronDown, TbEraser, TbWand } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { getMediaContent } from 'utils/lib';
import { isPaletteReference, paletteToCSSVar } from 'utils/palette';
import { fonts } from 'utils/tailwind';
import { DeleteNodeButton } from '../NodeControllers/Tools/DeleteNodeButton';
import { MediaManagerModal } from '../Toolbar/Inputs/MediaManagerModal';
import { ColorPickerAtom, ColorPickerDialog } from '../Toolbar/Tools/ColorPickerDialog';
import { PageSelector } from '../Viewport/PageSelector';
import { TextSettingsDropdown } from './TextSettingsDropdown';

interface TiptapToolbarProps {
  editor: Editor | null;
  className?: string;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  className = ""
}) => {

  const [fontSearchTerm, setFontSearchTerm] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  // Color picker state
  const [colorDialog, setColorDialog] = useRecoilState(ColorPickerAtom);
  const backgroundColorButtonRef = useRef<HTMLButtonElement>(null);
  const foregroundColorButtonRef = useRef<HTMLButtonElement>(null);


  // Get Craft.js query for media operations
  const { query } = useCraftEditor();

  // State for Google Fonts
  const [allFontFamilies, setAllFontFamilies] = useState<string[]>([]);
  const [loadingFonts, setLoadingFonts] = useState(true);



  // Filter fonts based on search term
  const filteredFonts = allFontFamilies.filter(font =>
    font.toLowerCase().includes(fontSearchTerm.toLowerCase())
  ).slice(0, 50); // Limit to 50 results for performance

  // Load all Google Fonts on mount
  useEffect(() => {
    const loadAllFonts = async () => {
      try {
        // Dynamically import to avoid circular dependencies
        const { fetchGoogleFonts, getPopularFonts, getFunkyFonts } = await import('utils/googleFonts');

        setLoadingFonts(true);
        const googleFonts = await fetchGoogleFonts();

        // Organize: Popular first, then Funky, then all others
        const popular = getPopularFonts();
        const funky = getFunkyFonts();
        const others = googleFonts
          .filter(f => !popular.includes(f.family) && !funky.includes(f.family))
          .map(f => f.family)
          .sort();

        setAllFontFamilies([...popular, ...funky, ...others]);
      } catch (error) {
        console.error("Error loading Google Fonts:", error);
        // Fallback to legacy fonts
        setAllFontFamilies(fonts.map(f => f[0]));
      } finally {
        setLoadingFonts(false);
      }
    };

    loadAllFonts();
  }, []);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  const generateAIContent = async () => {
    if (!editor) return;

    setIsGeneratingContent(true);

    try {
      // Get the current text content from the editor
      const currentText = editor.getText();

      if (!currentText.trim()) {
        console.log('No text content to improve');
        return;
      }

      const response = await fetch("/api/improve-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: currentText,
          customPrompt: query.node(ROOT_NODE).get()?.data?.props?.ai?.prompt,
          styleTags: query.node(ROOT_NODE).get()?.data?.props?.ai?.styleTags
        }),
      });

      const result = await response.json();

      if (result.success && result.result) {
        // Replace the entire content with the improved text
        editor.commands.setContent(result.result);
      } else if (result.error) {
        console.error('Failed to generate content:', result.error.message);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGeneratingContent(false);
    }
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
        {/* AI Content Generator */}
        <Tooltip content="AI Content Generator" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
          <button
            onClick={handleButtonClick(generateAIContent)}
            disabled={isGeneratingContent}
            className={`tool-button ${isGeneratingContent ? 'opacity-50 cursor-not-allowed' : 'hover:text-accent-foreground'}`}
          >
            {isGeneratingContent ? (
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <TbWand className="w-4 h-4" />
            )}
          </button>
        </Tooltip>








        <div className="border-l border-border flex gap-1 pl-2" >
          {/* Alignment and Lists Dropdown */}
          <div className=" group">
            <Tooltip content="Alignment & Lists" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
              <button
                className="tool-button"
              >
                <MdFormatAlignLeft className="w-4 h-4" />
              </button>
            </Tooltip>
            <div className="absolute w-fit left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 p-2 pb-0 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('left').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted text-foreground' : ''}`}
                  title="Align Left"
                >
                  <MdFormatAlignLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('center').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted text-foreground' : ''}`}
                  title="Align Center"
                >
                  <MdFormatAlignCenter className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().setTextAlign('right').run();
                  })}
                  className={`tool-button ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted text-foreground' : ''}`}
                  title="Align Right"
                >
                  <MdFormatAlignRight className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBulletList().run();
                  })}
                  className={`tool-button ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : ''}`}
                  title="Bullet List"
                >
                  <MdFormatListBulleted className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleOrderedList().run();
                  })}
                  className={`tool-button ${editor.isActive('orderedList') ? 'bg-muted text-foreground' : ''}`}
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
            <div className="absolute w-fit left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 p-2 pb-0 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-1 mb-2">
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleBold().run();
                  })}
                  className={`tool-button ${editor.isActive('bold') ? 'bg-muted text-foreground' : ''}`}
                  title="Bold"
                >
                  <MdFormatBold className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleItalic().run();
                  })}
                  className={`tool-button ${editor.isActive('italic') ? 'bg-muted text-foreground' : ''}`}
                  title="Italic"
                >
                  <MdFormatItalic className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleUnderline().run();
                  })}
                  className={`tool-button ${editor.isActive('underline') ? 'bg-muted text-foreground' : ''}`}
                  title="Underline"
                >
                  <MdFormatUnderlined className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleStrike().run();
                  })}
                  className={`tool-button ${editor.isActive('strike') ? 'bg-muted text-foreground' : ''}`}
                  title="Strikethrough"
                >
                  <MdFormatStrikethrough className="w-4 h-4 mx-auto" />
                </button>

                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSuperscript().run();
                  })}
                  className={`tool-button ${editor.isActive('superscript') ? 'bg-muted text-foreground' : ''}`}
                  title="Superscript"
                >
                  <MdSuperscript className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleButtonClick(() => {
                    editor.chain().focus().toggleSubscript().run();
                  })}
                  className={`tool-button ${editor.isActive('subscript') ? 'bg-muted text-foreground' : ''}`}
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
            <div className="absolute right-0 left-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 p-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex gap-8 h-64">
                {/* Font Family Section */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search fonts..."
                      value={fontSearchTerm}
                      onChange={(e) => setFontSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto border border-border rounded-lg bg-background">
                    <div className="grid grid-cols-1 gap-0">
                      {loadingFonts ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                          Loading fonts...
                        </div>
                      ) : filteredFonts.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                          No results.
                        </div>
                      ) : (
                        filteredFonts.map((font) => (
                          <button
                            key={font}
                            onClick={handleButtonClick(async () => {
                              // Dynamically load the font before applying
                              const { loadGoogleFont } = await import('utils/googleFonts');
                              loadGoogleFont(font, ["400", "700"]);

                              editor.chain().focus().setFontFamily(font).run();
                              setFontSearchTerm('');
                            })}
                            onMouseEnter={async () => {
                              // Preload font on hover for instant preview
                              const { loadGoogleFont } = await import('utils/googleFonts');
                              loadGoogleFont(font, ["400"]);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-muted hover:text-accent-foreground text-muted-foreground border-b border-border last:border-b-0 transition-colors"
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))
                      )}
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
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
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
                    <div className="text-xs text-muted-foreground mb-2">Font Size</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('12px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-150"
                        title="Small"
                      >
                        S
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('16px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-150"
                        title="Medium"
                      >
                        M
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('20px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-150"
                        title="Large"
                      >
                        L
                      </button>
                      <button
                        onClick={handleButtonClick(() => {
                          editor.chain().focus().setFontSize('24px').run();
                        })}
                        className="px-2 py-1 text-xs rounded hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-150"
                        title="Extra Large"
                      >
                        XL
                      </button>
                    </div>
                  </div>

                  <div className="p-1.5 mb-3 space-y-3">
                    {/* Background Color */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Background Color</div>
                      <button
                        ref={backgroundColorButtonRef}
                        onClick={handleButtonClick(openBackgroundColorPicker)}
                        className="w-full h-8 rounded border-2 border-border hover:border-border transition-colors"
                        style={{ backgroundColor: editor.getAttributes('highlight').color || '#ffffff' }}
                      />
                    </div>

                    {/* Text Color */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Text Color</div>
                      <button
                        ref={foregroundColorButtonRef}
                        onClick={handleButtonClick(openForegroundColorPicker)}
                        className="w-full h-8 rounded border-2 border-border hover:border-border transition-colors"
                        style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-l border-border flex gap-1 pl-2" >
          {/* Insert Link Dropdown */}
          <div className="group">
            <Tooltip content="Insert Link" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
              <button
                className="tool-button"
              >
                <MdLink className="w-4 h-4" />
              </button>
            </Tooltip>
            <div className="absolute left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 p-4 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <LinkSelector editor={editor} />
            </div>
          </div>

          {/* Insert Image - Opens Media Modal */}
          <Tooltip content="Insert Image" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              onClick={handleButtonClick(() => setShowMediaModal(true))}
              className="tool-button"
            >
              <MdImage className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        <div className="border-l border-border flex gap-1 pl-2" >
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

        {/* More Options Dropdown */}
        <div className="group border-l border-border pl-2">
          <Tooltip content="More Options" placement="top" tooltipClassName="!text-xs !px-2 !py-1">
            <button
              className="tool-button"
            >
              <TbChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
          </Tooltip>
          <div className="absolute w-fit left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 p-3 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="space-y-2">
              {/* Horizontal Rule */}
              <button
                onClick={handleButtonClick(() => {
                  editor.chain().focus().setHorizontalRule().run();
                })}
                className="w-full px-3 py-2 text-sm rounded hover:bg-muted hover:text-foreground text-muted-foreground transition-colors duration-150 flex items-center gap-2"
                title="Horizontal Rule"
              >
                <MdFormatLineSpacing className="w-4 h-4" />
                <span>Horizontal Rule</span>
              </button>

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* Text Settings Dropdown */}
              <TextSettingsDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker Dialog */}
      <ColorPickerDialog />

      {/* Media Manager Modal */}
      <MediaManagerModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelect={(mediaId) => {
          console.log('📸 Selected media ID:', mediaId);
          const imageUrl = getMediaContent(query, mediaId);
          console.log('🖼️ Generated image URL:', imageUrl);

          if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
            console.log('✅ Image inserted into Tiptap');
          } else {
            console.error('❌ Failed to generate image URL for mediaId:', mediaId);
          }

          setShowMediaModal(false);
        }}
        selectionMode={true}
      />



    </div >
  );
};

// Link Selector Component for Tiptap
const LinkSelector: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [linkType, setLinkType] = useState<"external" | "page">("external");
  const [url, setUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState<{ from: number; to: number } | null>(null);

  // Save selection when dropdown opens (on mouse enter)
  useEffect(() => {
    const { from, to } = editor.state.selection;
    if (from !== to) {
      setSavedSelection({ from, to });
      console.log('💾 Saved selection:', { from, to });
    }
  }, [editor]);

  const handlePagePick = (page: { id: string; displayName: string; isHomePage: boolean }) => {
    console.log('🔗 Page picked:', page);
    const pageRef = `ref:${page.id}`;
    console.log('🔗 Setting link href to:', pageRef);

    // Use saved selection or current selection
    const selection = savedSelection || editor.state.selection;
    const { from, to } = selection;
    const hasSelection = from !== to;

    console.log('🔗 Has selection:', hasSelection, 'from:', from, 'to:', to);

    if (hasSelection) {
      const selectedText = editor.state.doc.textBetween(from, to);
      console.log('🔗 Selected text:', selectedText);

      // Use toggleLink to apply the link properly
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .toggleLink({ href: pageRef })
        .run();

      console.log('✅ Link applied to selection');

      // Check if link was applied
      setTimeout(() => {
        console.log('🔗 Link active at cursor:', editor.isActive('link'));
        console.log('🔗 Current HTML:', editor.getHTML());
      }, 100);
    } else {
      // No selection - insert text and then make it a link
      const startPos = editor.state.selection.from;
      editor
        .chain()
        .focus()
        .insertContent(page.displayName + ' ')
        .setTextSelection({ from: startPos, to: startPos + page.displayName.length })
        .toggleLink({ href: pageRef })
        .run();
      console.log('✅ Link inserted with page name as text');
    }

    setSavedSelection(null);
  };

  const handleExternalLink = () => {
    if (url) {
      console.log('🔗 Setting external link to:', url);

      // Use saved selection or current selection
      const selection = savedSelection || editor.state.selection;
      const { from, to } = selection;
      const hasSelection = from !== to;

      if (hasSelection) {
        const selectedText = editor.state.doc.textBetween(from, to);
        console.log('🔗 Selected text:', selectedText);

        // Use toggleLink to apply the link properly
        editor
          .chain()
          .focus()
          .setTextSelection({ from, to })
          .toggleLink({ href: url })
          .run();

        console.log('✅ External link applied to selection');

        // Check if link was applied
        setTimeout(() => {
          console.log('🔗 Link active at cursor:', editor.isActive('link'));
          console.log('🔗 Current HTML:', editor.getHTML());
        }, 100);
      } else {
        // No selection - insert text and then make it a link
        const startPos = editor.state.selection.from;
        editor
          .chain()
          .focus()
          .insertContent(url + ' ')
          .setTextSelection({ from: startPos, to: startPos + url.length })
          .toggleLink({ href: url })
          .run();
        console.log('✅ External link inserted with URL as text');
      }

      setSavedSelection(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Link Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLinkType("external")}
          className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${linkType === "external"
            ? "bg-primary text-foreground"
            : "bg-muted text-muted-foreground"
            }`}
        >
          <MdLink className="inline mr-1" />
          External URL
        </button>
        <button
          type="button"
          onClick={() => setLinkType("page")}
          className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${linkType === "page"
            ? "bg-primary text-foreground"
            : "bg-muted text-muted-foreground"
            }`}
        >
          Internal Page
        </button>
      </div>

      {/* Conditional Content */}
      {linkType === "external" ? (
        <div className="space-y-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-muted-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleExternalLink();
            }}
            className="w-full px-3 py-2 bg-primary hover:bg-primary text-foreground text-sm rounded-lg transition-colors"
          >
            Insert Link
          </button>
        </div>
      ) : (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="text-xs text-muted-foreground mb-2">Select a page to link to:</div>
          <PageSelector
            onPagePick={handlePagePick}
            pickerMode={true}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
