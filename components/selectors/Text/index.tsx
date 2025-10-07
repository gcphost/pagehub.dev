import { useEditor, useNode } from "@craftjs/core";
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Link as TiptapLink } from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AutoTextSize } from "auto-text-size";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { InitialLoadCompleteAtom, PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaFont } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motionIt, resolvePageRef, selectAfterAdding } from "utils/lib";

import { getFontFromComp } from "utils/lib";
import { applyAnimation, ClassGenerator } from "utils/tailwind";

import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import TextSettingsTopNodeTool from "components/editor/NodeControllers/Tools/TextSettingsTopNodeTool";
import { TiptapProvider } from "components/editor/TiptapContext";
import { TiptapToolbar } from "components/editor/Tools/TiptapToolbar";
import { changeProp } from "components/editor/Viewport/lib";
import { usePalette } from "utils/PaletteContext";
import { replaceVariables } from "utils/variables";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";
import { TextSettings } from "./TextSettings";

export interface TextProps extends BaseSelectorProps {
  text?: string;
  tagName?: string;
  activeTab?: number;
}

const defaultProps: TextProps = {
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
  canDelete: true,
};

export const OnlyText = ({ children, ...props }) => {
  const {
    connectors: { connect },
  }: any = useNode();
  return (
    <div title="only-buttons" ref={connect} className="w-full mt-5" {...props}>
      {children}
    </div>
  );
};

OnlyText.craft = {
  rules: {
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Text"),
  },
};

export const Text = (props: Partial<TextProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  const router = useRouter();
  const tab = useSetRecoilState(TabAtom);
  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const initialLoadComplete = useRecoilValue(InitialLoadCompleteAtom);
  const palette = usePalette();

  const {
    connectors: { connect, drag },
    id,
    actions: { setProp },
  } = useNode();

  const [isEditing, setIsEditing] = React.useState(false);

  // Check if this node is selected
  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  // Clear editing mode when node is deselected
  useEffect(() => {
    if (!isActive && isEditing) {
      setIsEditing(false);
    }
  }, [isActive, isEditing]);

  useScrollToSelected(id, enabled);
  selectAfterAdding(actions.selectNode, tab, id, enabled, initialLoadComplete);

  props = setClonedProps(props, query);


  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load fonts when component mounts
  useEffect(() => {
    getFontFromComp(props);
  }, [props]);

  let { text, tagName } = props;

  // Replace variables in text (only show raw text when actively editing)
  const processedText = (!enabled || preview || !isEditing) ? replaceVariables(text, query) : text;

  // Tiptap editor instance - only create when in edit mode or when enabled
  const tiptapEditor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        heading: {}, // Enable headings with default config
        codeBlock: false,
        blockquote: {}, // Enable blockquotes with default config
        horizontalRule: {}, // Enable horizontal rules with default config
        bulletList: {}, // Enable bullet lists with default config
        orderedList: {}, // Enable ordered lists with default config
        listItem: {}, // Enable list items with default config
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color.configure({ types: [TextStyle.name] }),
      FontFamily.configure({ types: [TextStyle.name] }),
      FontSize.configure({ types: [TextStyle.name] }),
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
    ],
    content: processedText,
    editable: isEditing,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      changeProp({
        setProp,
        propKey: "text",
        propType: "component",
        value: editor.getHTML(),
      });
    },
    onFocus: () => {
      if (isActive && !isEditing) {
        setIsEditing(true);
      }
    },
    onBlur: () => {
      //  setIsEditing(false);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[1.5em]',
      },
    },
  }, [enabled, isEditing]); // Only recreate when enabled or editing state changes

  // Update content when prop changes
  useEffect(() => {
    if (tiptapEditor && tiptapEditor.getHTML() !== processedText) {
      tiptapEditor.commands.setContent(processedText, { errorOnInvalidContent: false });
    }
  }, [processedText, tiptapEditor]);


  // Update editable state
  useEffect(() => {
    if (tiptapEditor) {
      tiptapEditor.setEditable(isEditing);
    }
  }, [tiptapEditor, isEditing]);


  const prop: any = {
    ref: (r) => connect(drag(r)),
    className: ClassGenerator(props, view, enabled, [], [], preview, false, palette, query),
  };

  if (enabled) {
    if (!text) prop.children = <FaFont />;
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !text;
    prop["node-id"] = id;
    // Don't set contentEditable on outer wrapper - it goes on inner span
    prop["data-gramm"] = false;
    prop.suppressContentEditableWarning = true;
  } else if (props.url && typeof props.url === "string") {
    // Resolve page references to actual URLs
    const resolvedUrl = resolvePageRef(props.url, query, router?.asPath);

    tagName = NextLink as any;
    prop.href = resolvedUrl || "#";
    prop.target = props.urlTarget;
    prop.onClick = (e) => {
      if (enabled) e.preventDefault();
    };
  }

  if (tagName === "Textfit") {
    tagName = "div";
    const t = (
      <AutoTextSize
        style={{ margin: "0 auto" }}
        as={props.url ? NextLink : "div"}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    ) as any;
    prop.children = t;
  } else if (text && !enabled) {
    prop.dangerouslySetInnerHTML = { __html: processedText };
  }

  // Add inline tools renderer in edit mode (after hydration)
  if (enabled && isMounted) {
    if (prop.dangerouslySetInnerHTML) {
      // Can't use both dangerouslySetInnerHTML and children
      const innerHTML = prop.dangerouslySetInnerHTML;
      delete prop.dangerouslySetInnerHTML;
      prop.children = (
        <>
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive && !isEditing) {
                setIsEditing(true);
              }
            }}
            className={`w-full min-h-inherit transition-all duration-150 ease-in-out ${isEditing ? 'cursor-text' : 'cursor-pointer'} ${!isEditing ? 'hover:bg-blue-50 hover:bg-opacity-30' : ''}`}
          >
            {tiptapEditor ? (
              <EditorContent editor={tiptapEditor} />
            ) : (
              <div className="text-gray-400 italic">Loading editor...</div>
            )}
          </div>
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Text} props={props}>
            <TiptapProvider editor={tiptapEditor}>
              <TiptapToolbar editor={tiptapEditor} />
            </TiptapProvider>
          </InlineToolsRenderer>
        </>
      );
    } else {
      const originalChildren = prop.children;
      prop.children = (
        <>
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive && !isEditing) {
                setIsEditing(true);
              }
            }}
            className={`w-full min-h-inherit transition-all duration-150 ease-in-out ${isEditing ? 'cursor-text' : 'cursor-pointer'} ${!isEditing ? 'hover:bg-blue-50 hover:bg-opacity-30' : ''}`}
          >
            {tiptapEditor ? (
              <EditorContent editor={tiptapEditor} />
            ) : (
              <div className="text-gray-400 italic">Loading editor...</div>
            )}
          </div>
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Text} props={props}>
            <TiptapProvider editor={tiptapEditor}>
              <TiptapToolbar editor={tiptapEditor} />
            </TiptapProvider>
          </InlineToolsRenderer>
        </>
      );
    }
  }

  const final = applyAnimation({ ...prop, key: `${id}` }, props);

  return React.createElement(motionIt(props, tagName || "div"), final);
};

Text.craft = {
  displayName: "Text",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: TextSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        // Disabled: Name label in viewport
        // <NameNodeController
        //   key="textNameController"
        //   position="top"
        //   align="end"
        //   placement="start"
        //   alt={{
        //     position: "top",
        //     align="end",
        //     placement: "start",
        //   }}
        // />,
        // Disabled: Hover name display
        // <HoverNodeController
        //   key="textHoverController"
        //   position="top"
        //   align="start"
        //   placement="end"
        //   alt={{
        //     position: "bottom",
        //     align: "start",
        //     placement: "start",
        //   }}
        // />,

        <DeleteNodeController key="textDelete" />,
        <ToolNodeController position="bottom" align="start" key="textSettings">
          <TextSettingsNodeTool />
        </ToolNodeController>,
        <ToolNodeController
          position="top"
          align="middle"
          placement="start"
          key="textTopSettings"
        >
          <TextSettingsTopNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
