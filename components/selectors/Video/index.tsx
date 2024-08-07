import { useEditor, useNode } from "@craftjs/core";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useRef } from "react";
import { TbBrandYoutube } from "react-icons/tb";

import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";

import { VideoSettings } from "./VideoSettings";

const DynamicYouTube = React.lazy(() => import("react-youtube"));

const YouTube = (props) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <DynamicYouTube {...props} />
  </React.Suspense>
);

interface VideoProps extends BaseSelectorProps {
  videoId?: string;
}

const defaultProps: VideoProps = {
  root: {},
  className: [],
  mobile: {},
  tablet: {},
  desktop: {},
};

export const Video = (props: VideoProps) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { videoId } = props;

  props = setClonedProps(props, query);

  const ref = useRef();

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: "",
    children: videoId ? (
      <YouTube
        className={ClassGenerator(props, view, enabled, [], [], preview)}
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
        }}
      />
    ) : enabled ? (
      <TbBrandYoutube />
    ) : null,
  };

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !videoId;
    prop["node-id"] = id;
    prop.onClick = (e) => e.preventDefault();
  }

  return React.createElement(
    motionIt(props, "div"),
    applyAnimation({ ...prop, key: id }, props)
  );
};

Video.craft = {
  displayName: "Video",
  related: {
    toolbar: VideoSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="end"
          placement="start"
          key="videoNameController"
        />,

        <ToolNodeController
          position="bottom"
          align="start"
          key="videoSettingsController"
        >
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
