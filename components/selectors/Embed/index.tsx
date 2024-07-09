import { useEditor, useNode } from "@craftjs/core";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import React, { useRef } from "react";
import { TbCode } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motionIt, selectAfterAdding } from "utils/lib";
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
}

const defaultProps: EmbedProps = {
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
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

  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  useScrollToSelected(id, enabled);
  selectAfterAdding(
    actions.selectNode,
    useSetRecoilState(TabAtom),
    id,
    enabled
  );

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { videoId } = props;

  const ref = useRef(null);

  props = setClonedProps(props, query);

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: ClassGenerator(props, view, enabled, [], [], preview),
  };

  if (videoId) prop.dangerouslySetInnerHTML = { __html: videoId || "" };

  if (enabled) {
    if (!videoId) prop.children = <TbCode />;
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !videoId;
    prop["node-id"] = id;
  }

  return React.createElement(
    motionIt(props, "div"),
    applyAnimation({ ...prop, key: id }, props)
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
        <NameNodeController position="top" align="end" placement="start" />,
        <HoverNodeController
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <ToolNodeController position="bottom" align="start">
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
