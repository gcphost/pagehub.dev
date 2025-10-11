import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useRef, useState } from "react";
import { TbCode } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";

import { EmbedSettings } from "./EmbedSettings";

const YoutubeDiv = `
  width: 100%;
  height: 100%;
  > div {
    height: 100%;
  }
  iframe {
    pointer-events: ${(props) => (props.enabled ? "none" : "auto")};
    // width:100%!important;
    // height:100%!important;
  }
`;

interface EmbedProps extends BaseSelectorProps {
  videoId?: string;
  title?: string;
}

const defaultProps: EmbedProps = {
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
  canDelete: true,
  canEditName: true,
};

export const Embed = (props: EmbedProps) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { name } = useNode((node) => ({
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  useScrollToSelected(id, enabled);

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { videoId } = props;

  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  props = setClonedProps(props, query);

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: ClassGenerator(props, view, enabled, [], [], preview),
    role: "region",
    "aria-label": props.title || "Embedded content",
  };

  if (videoId) prop.dangerouslySetInnerHTML = { __html: videoId || "" };

  if (enabled) {
    if (!videoId) prop.children = <TbCode aria-label="Code icon" />;
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !videoId;
    prop["node-id"] = id;
  }

  // Add inline tools renderer in edit mode (after hydration)
  if (enabled && isMounted) {
    prop.style = {
      ...(prop.style || {}),
      overflow: "visible",
    };
    // Handle dangerouslySetInnerHTML case
    if (prop.dangerouslySetInnerHTML) {
      const innerHTML = prop.dangerouslySetInnerHTML;
      delete prop.dangerouslySetInnerHTML;
      prop.children = (
        <>
          <div dangerouslySetInnerHTML={innerHTML} />
          <InlineToolsRenderer
            key={`tools-${id}`}
            craftComponent={Embed}
            props={props}
          />
        </>
      );
    } else {
      const originalChildren = prop.children;
      prop.children = (
        <>
          {originalChildren}
          <InlineToolsRenderer
            key={`tools-${id}`}
            craftComponent={Embed}
            props={props}
          />
        </>
      );
    }
  }

  return React.createElement(
    motionIt(props, "div"),
    applyAnimation({ ...prop, key: id }, props),
  );
};

Embed.craft = {
  displayName: "Embed",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: EmbedSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="end"
          placement="start"
          key="embedNameController"
        />,
        <HoverNodeController
          key="emebedHoverController"
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <DeleteNodeController key="embedDelete" />,
        <ToolNodeController
          position="bottom"
          align="start"
          key="embedSettingsController"
        >
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
