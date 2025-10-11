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
import { TbMusic } from "react-icons/tb";

import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";

import { AudioSettings } from "./AudioSettings";

interface AudioProps extends BaseSelectorProps {
  audioUrl?: string;
  title?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

const defaultProps: AudioProps = {
  root: {},
  className: [],
  mobile: {},
  tablet: {},
  desktop: {},
  controls: true,
  autoplay: false,
  loop: false,
  canDelete: true,
  canEditName: true,
};

export const Audio = (props: AudioProps) => {
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

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { audioUrl, controls, autoplay, loop } = props;

  props = setClonedProps(props, query);

  const ref = useRef();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: "",
    role: "region",
    "aria-label": props.title || audioUrl ? `Audio: ${props.title || audioUrl}` : "Audio player",
    children: audioUrl ? (
      <audio
        className={ClassGenerator(props, view, enabled, [], [], preview)}
        src={audioUrl}
        controls={controls}
        autoPlay={autoplay && !enabled}
        loop={loop}
        preload="metadata"
        style={{ width: '100%' }}
      >
        Your browser does not support the audio element.
      </audio>
    ) : enabled ? (
      <div className="w-full h-full flex items-center justify-center text-3xl min-h-[50px] border border-dashed border-border rounded">
        <TbMusic aria-label="Audio icon" />
      </div>
    ) : null,
  };

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !audioUrl;
    prop["node-id"] = id;
    prop.onClick = (e) => e.preventDefault();
  }

  // Add inline tools renderer in edit mode (after hydration)
  if (enabled && isMounted) {
    prop.style = {
      ...(prop.style || {}),
      overflow: 'visible',
    };
    const originalChildren = prop.children;
    prop.children = (
      <>
        {originalChildren}
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={Audio} props={props} />
      </>
    );
  }

  return React.createElement(
    motionIt(props, "div"),
    applyAnimation({ ...prop, key: id }, props)
  );
};

Audio.craft = {
  displayName: "Audio",
  related: {
    toolbar: AudioSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="end"
          placement="start"
          key="audioNameController"
        />,
        <HoverNodeController
          key="audioHoverController"
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,
        <DeleteNodeController key="audioDelete" />,
        <ToolNodeController
          position="bottom"
          align="start"
          key="audioSettingsController"
        >
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};

