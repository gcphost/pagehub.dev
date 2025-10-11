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


// Helper functions for Text component
const checkIfAncestorLinked = (nodeId: string, query: any): boolean => {
  const node = query.node(nodeId).get();
  if (!node) return false;

  if (node.data.props?.belongsTo && node.data.props?.relationType !== "style") {
    return true;
  }

  if (node.data.parent) {
    return checkIfAncestorLinked(node.data.parent, query);
  }

  return false;
};

const getTiptapExtensions = () => [
  StarterKit.configure({
    heading: {},
    codeBlock: false,
    blockquote: {},
    horizontalRule: {},
    bulletList: {},
    orderedList: {},
    listItem: {},
  }),
  Placeholder.configure({ placeholder: "Start typing..." }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TextStyle,
  Color.configure({ types: [TextStyle.name] }),
  FontFamily.configure({ types: [TextStyle.name] }),
  FontSize.configure({ types: [TextStyle.name] }),
  Highlight.configure({ multicolor: true }),
  Superscript,
  Subscript,
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: { class: "text-primary underline" },
  }),
  Image.configure({
    HTMLAttributes: { class: "max-w-full h-auto" },
  }),
];

// EDITOR MODE - All Tiptap and editing logic
const renderEditorMode = (
  props: any,
  id: string,
  query: any,
  enabled: boolean,
  isMounted: boolean,
  setProp: any
) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const isEditingRef = React.useRef(isEditing);

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

  const isInsideLinkedComponent = checkIfAncestorLinked(id, query);
  const processedText = replaceVariables(props.text, query);

  // Tiptap editor instance
  const tiptapEditor = useTiptapEditor(
    {
      extensions: getTiptapExtensions(),
      content: processedText,
      editable: isEditing && !isInsideLinkedComponent,
      immediatelyRender: false,
      editorProps: { attributes: {} },
      onUpdate: ({ editor }: { editor: any }) => {
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
        if (isActive && !isEditingRef.current) {
          setIsEditing(true);
        }
      },
      onBlur: () => {
        // setIsEditing(false);
      },
    },
    [enabled],
  );

  // Update content when prop changes
  useEffect(() => {
    if (tiptapEditor && processedText) {
      const currentContent = tiptapEditor.getHTML();
      const normalize = (html: string) => html.replace(/>\s+</g, "><").trim();

      if (normalize(currentContent) !== normalize(processedText)) {
        tiptapEditor.commands.setContent(processedText, {
          errorOnInvalidContent: false,
          emitUpdate: false,
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

  if (!isMounted) return null;

  const handleClick = () => {
    if (!isEditing && isActive && !isInsideLinkedComponent) {
      setIsEditing(true);
      setTimeout(() => {
        tiptapEditor?.commands.focus();
      }, 10);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`min-h-inherit w-full transition-all duration-150 ease-in-out ${isEditing ? "relative cursor-text" : "cursor-pointer"}`}
      >
        {tiptapEditor ? (
          <EditorContent editor={tiptapEditor} />
        ) : (
          <div className="italic text-muted-foreground">Loading editor...</div>
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
};

// RENDER MODE - Simple HTML rendering
const renderLiveMode = (
  props: any,
  query: any,
  router: any
) => {
  const processedText = replaceVariables(props.text, query);
  let { tagName } = props;

  // Setup link props
  if (props.url && typeof props.url === "string") {
    const resolvedUrl = resolvePageRef(props.url, query, router?.asPath);
    tagName = NextLink as any;

    return React.createElement(tagName, {
      href: resolvedUrl || "#",
      target: props.urlTarget,
      dangerouslySetInnerHTML: { __html: processedText },
    });
  }

  // Setup Textfit content
  if (tagName === "Textfit") {
    return (
      <AutoTextSize
        style={{ margin: "0 auto" }}
        as={props.url ? NextLink : "div"}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    );
  }

  // Regular text content
  return React.createElement(tagName || "div", {
    dangerouslySetInnerHTML: { __html: processedText },
  });
};

export const Text = (props: Partial<TextProps>) => {
  props = { ...defaultProps, ...props };

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

  const { text, tagName } = props;

  // Create base props
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

  // Setup editor-specific props
  if (enabled) {
    if (!text) prop.children = <FaFont />;
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !text;
    prop["node-id"] = id;
    prop["data-gramm"] = false;
    prop.suppressContentEditableWarning = true;
  }

  // MAIN LOGIC: if(editor) return edit() else return render()
  if (enabled) {
    // EDITOR MODE
    prop.children = renderEditorMode(props, id, query, enabled, isMounted, setProp);
  } else {
    // LIVE MODE
    const liveContent = renderLiveMode(props, query, router);

    // Handle different tag types for live mode
    if (props.url && typeof props.url === "string") {
      // Link content - already handled in renderLiveMode
      return liveContent;
    } else if (props.tagName === "Textfit") {
      // Textfit content - already handled in renderLiveMode
      return liveContent;
    } else {
      // Regular content - wrap in the base element
      prop.children = liveContent;
    }
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
