import { useEditor, useNode } from "@craftjs/core";
import { AutoTextSize } from "auto-text-size";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { InitialLoadCompleteAtom, PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaFont } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motionIt, resolvePageRef, selectAfterAdding } from "utils/lib";

import { getFontFromComp } from "utils/lib";
import { applyAnimation, ClassGenerator } from "utils/tailwind";

import TextSettingsTopNodeTool from "components/editor/NodeControllers/Tools/TextSettingsTopNodeTool";
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

  // Handler for inner span blur - save text changes and exit edit mode
  const handleTextBlur = (e) => {
    // Exit edit mode
    setIsEditing(false);

    // Check if element is being deleted - if so, don't save
    if (e.target.getAttribute('data-deleting') === 'true') {
      return;
    }

    // Save the current text value immediately on blur
    const newText = e.target.innerText;
    const trimmedNew = newText?.trim();
    const trimmedOld = text?.replace(/<[^>]*>/g, '').trim();

    // Only save if content has changed
    if (trimmedNew !== trimmedOld) {
      changeProp({
        setProp,
        propKey: "text",
        propType: "component",
        value: newText,
      });
    }
  };

  // Replace variables in text (only show raw text when actively editing)
  const processedText = (!enabled || preview || !isEditing) ? replaceVariables(text, query) : text;

  /* -- throws hydration errors after react-quilljs update.

if (text && typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(text, "text/html");
    const a = doc.getElementsByTagName("p");

    if (a.length) {
      const b = [];

      for (const d in a) {
        const res = a[d].innerHTML;
        b.push(res);
      }

      const c = b.filter((_) => _).map((_) => (_ === "<br>" ? "" : _));

      if (b.length) {
        text = c.join("<br>");
      }

      if (text === "<br>") text = "";
    }
  }]*/

  const prop: any = {
    ref: (r) => connect(drag(r)),
    className: ClassGenerator(props, view, enabled, [], [], preview, false, palette),
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

    tagName = Link as any;
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
        as={props.url ? Link : "div"}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    ) as any;
    prop.children = t;
  } else if (text) {
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
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive && !isEditing) {
                setIsEditing(true);
              }
            }}
            className={`block w-full min-h-inherit transition-all duration-1000 ease-in-out ${isEditing ? 'cursor-text' : 'cursor-pointer'}`}
            dangerouslySetInnerHTML={innerHTML}
          />
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Text} props={props} />
        </>
      );
    } else {
      const originalChildren = prop.children;
      prop.children = (
        <>
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={handleTextBlur}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isActive && !isEditing) {
                setIsEditing(true);
              }
            }}
            className={`block w-full min-h-inherit transition-all duration-150 ease-in-out ${isEditing ? 'cursor-text' : 'cursor-pointer'}`}
          >
            {originalChildren}
          </span>
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Text} props={props} />
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
