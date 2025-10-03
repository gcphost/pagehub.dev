import { useEditor, useNode } from "@craftjs/core";
import { AutoTextSize } from "auto-text-size";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import React from "react";
import { FaFont } from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motionIt, selectAfterAdding } from "utils/lib";

import { applyAnimation, ClassGenerator } from "utils/tailwind";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import TextSettingsTopNodeTool from "components/editor/NodeControllers/Tools/TextSettingsTopNodeTool";
import { changeProp } from "components/editor/Viewport/lib";
import debounce from "lodash.debounce";
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

  const tab = useSetRecoilState(TabAtom);
  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const {
    connectors: { connect, drag },
    id,
    actions: { setProp },
  } = useNode();

  const [isEditing, setIsEditing] = React.useState(false);

  useScrollToSelected(id, enabled);
  selectAfterAdding(actions.selectNode, tab, id, enabled);

  props = setClonedProps(props, query);

  let { text, tagName } = props;

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
    className: ClassGenerator(props, view, enabled, [], [], preview),
  };

  if (enabled) {
    if (!text) prop.children = <FaFont />;
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !text;
    prop["node-id"] = id;
    prop.contentEditable = isEditing;
    prop["data-gramm"] = false;
    prop.suppressContentEditableWarning = true;
    prop.onClick = (e) => {
      if (!isEditing) {
        // First click: select the node (let event propagate)
        actions.selectNode(id);
        setTimeout(() => setIsEditing(true), 0);
      } else {
        // Already editing: stop propagation to avoid deselection
        e.stopPropagation();
      }
    };
    prop.onBlur = () => {
      setIsEditing(false);
    };
    prop.onInput = debounce((e) => {
      changeProp({
        setProp,
        propKey: "text",
        propType: "component",
        value: e.target.innerText,
      });
    }, 500);
  } else if (props.url && typeof props.url === "string") {
    tagName = Link as any;
    prop.href = props.url || "#";
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
        dangerouslySetInnerHTML={{ __html: text }}
      />
    ) as any;
    prop.children = t;
  } else if (text) {
    prop.dangerouslySetInnerHTML = { __html: text };
  }

  const final = applyAnimation({ ...prop, key: id }, props);

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
        //     align: "end",
        //     placement: "start",
        //   }}
        // />,
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
