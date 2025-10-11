import { useEditor, useNode } from "@craftjs/core";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AutoTextSize } from "auto-text-size";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaFont } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { motionIt, resolvePageRef } from "utils/lib";

import { getFontFromComp } from "utils/lib";
import { applyAnimation, ClassGenerator } from "utils/tailwind";

import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
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


export const Text = (props: Partial<TextProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  const router = useRouter();
  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const palette = usePalette();

  const {
    connectors: { connect, drag },
    id,
    actions: { setProp },
  } = useNode();

  const [isEditing, setIsEditing] = React.useState(false);
  const isEditingRef = React.useRef(isEditing);

  // Keep ref in sync with state
  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

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
  const processedText =
    !enabled || preview || !isEditing ? replaceVariables(text, query) : text;

  // Check if this node or any ancestor is a fully linked component
  const checkIfAncestorLinked = (nodeId) => {
    const node = query.node(nodeId).get();
    if (!node) return false;

    // If this node is fully linked, return true
    if (
      node.data.props?.belongsTo &&
      node.data.props?.relationType !== "style"
    ) {
      return true;
    }

    // Check parent
    if (node.data.parent) {
      return checkIfAncestorLinked(node.data.parent);
    }

    return false;
  };

  const isInsideLinkedComponent = checkIfAncestorLinked(id);

  // Tiptap editor instance - only create when in edit mode or when enabled
  const tiptapEditor = useTiptapEditor(
    {
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
          placeholder: "Start typing...",
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
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
            class: "text-primary underline",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto",
          },
        }),
      ],
      content: processedText,
      editable: isEditing && !isInsideLinkedComponent,
      immediatelyRender: false, // Fix SSR hydration issues
      onUpdate: ({ editor }) => {
        // Only save changes when actively editing (not when content is being set programmatically)
        // Use ref to avoid stale closure issues
        if (isEditingRef.current && !isInsideLinkedComponent) {
          changeProp({
            setProp,
            propKey: "text",
            propType: "component",
            value: editor.getHTML(),
          });
        }
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
        attributes: {},
      },
    },
    [enabled],
  ); // Only recreate when enabled state changes

  // Update content when prop changes or when switching edit modes
  useEffect(() => {
    if (tiptapEditor && processedText) {
      // When switching to editing mode, always update to show raw template text
      // When switching from editing mode, show replaced text
      const currentContent = tiptapEditor.getHTML();

      // Normalize HTML for comparison (strip whitespace differences)
      const normalize = (html: string) => html.replace(/>\s+</g, "><").trim();

      if (normalize(currentContent) !== normalize(processedText)) {
        // Don't emit update event when programmatically setting content
        tiptapEditor.commands.setContent(processedText, {
          errorOnInvalidContent: false,
          emitUpdate: false, // Prevent onUpdate from firing
        });
      }
    }
  }, [processedText, tiptapEditor, isEditing]);

  // Update editable state
  useEffect(() => {
    if (tiptapEditor) {
      tiptapEditor.setEditable(isEditing);
    }
  }, [tiptapEditor, isEditing]);

  const prop: any = {
    ref: (r) => connect(drag(r)),
    className: ClassGenerator(
      props,
      view,
      enabled,
      [],
      [],
      preview,
      false,
      palette,
      query,
    ),
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
    prop.children = (
      <>
        <div
          onClick={() => {
            if (!isEditing && isActive && !isInsideLinkedComponent) {
              setIsEditing(true);
              // Focus the editor after a short delay to ensure it's ready
              setTimeout(() => {
                tiptapEditor?.commands.focus();
              }, 10);
            }
          }}
          className={`min-h-inherit w-full transition-all duration-150 ease-in-out ${isEditing ? "relative cursor-text" : "cursor-pointer"}`}
        >
          {tiptapEditor ? (
            <EditorContent editor={tiptapEditor} />
          ) : (
            <div className="italic text-muted-foreground">
              Loading editor...
            </div>
          )}
        </div>
        <InlineToolsRenderer
          key={`tools-${id}`}
          craftComponent={Text}
          props={props}
        >
          <TiptapProvider editor={tiptapEditor}>
            <TiptapToolbar editor={tiptapEditor} />
          </TiptapProvider>
        </InlineToolsRenderer>
      </>
    );
  }

  const final = applyAnimation({ ...prop, key: `${id}` }, props);

  return React.createElement(motionIt(props, tagName || "div"), final);
};

Text.craft = {
  displayName: "Text",
  rules: {
    canDrag: (node, helpers) => {
      return true;
      // Check if this node or any ancestor is a fully linked component
      const checkIfLinked = (nodeId) => {
        const n = helpers.query.node(nodeId).get();
        if (!n) return false;

        // If this node is fully linked, return true (it IS linked)
        if (n.data.props?.belongsTo && n.data.props?.relationType !== "style") {
          return true;
        }

        // Check parent
        if (n.data.parent) {
          return checkIfLinked(n.data.parent);
        }

        return false; // Not linked
      };

      return !checkIfLinked(node.id);
    },
    canMoveIn: () => false,
  },
  related: {
    toolbar: TextSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <HoverNodeController
          key="textHoverController"
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <ToolNodeController position="bottom" align="start" key="textSettings">
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
