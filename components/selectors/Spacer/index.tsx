import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { DragAdjustNodeController } from "components/editor/NodeControllers/DragAdjustNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";
import { SpacerSettings } from "./SpacerSettings";

interface SpacerProps extends BaseSelectorProps {
  height?: string;
  width?: string;
  showName?: string;
}

const defaultProps: SpacerProps = {
  className: [],
  root: {
    background: "bg-transparent",
  },
  mobile: {
    py: "py-8", // Default height
    width: "w-full", // Default width
  },
  tablet: {},
  desktop: {},
};

export const Spacer = (props: SpacerProps) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  useScrollToSelected(id, enabled);

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  props = setClonedProps(props, query);

  // If in edit mode and mounted, wrap div in a container with inline tools
  if (enabled && isMounted) {
    const containerProp: any = {
      ref: (r) => {
        ref.current = r;
        connect(drag(r));
      },
      className: ClassGenerator(props, view, enabled, [], [], preview),
      style: {
        minHeight: "20px", // Minimum height so it's always visible
        border: "1px dashed #ccc", // Dashed border to show it's a spacer
        borderRadius: "4px",
      },
      "data-bounding-box": enabled,
      "data-empty-state": false,
      "node-id": id,
    };

    const spacerDiv = React.createElement(
      motionIt(props, "div"),
      applyAnimation(
        {
          key: `spacer-${id}`,
          style: { minHeight: "20px" },
        },
        props,
      ),
    );

    return (
      <div {...containerProp}>
        {spacerDiv}
        <InlineToolsRenderer
          key={`tools-${id}`}
          craftComponent={Spacer}
          props={props}
        />
      </div>
    );
  }

  // In preview mode, just render the spacer div
  const spacerProp: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: ClassGenerator(props, view, enabled, [], [], preview),
    style: {
      minHeight: "20px",
    },
  };

  if (enabled) {
    spacerProp["data-bounding-box"] = enabled;
    spacerProp["data-empty-state"] = false;
    spacerProp["node-id"] = id;
  }

  return React.createElement(
    motionIt(props, "div"),
    applyAnimation({ ...spacerProp, key: id }, props),
  );
};

Spacer.craft = {
  displayName: "Spacer",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: SpacerSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          key="name"
          position="top"
          align="end"
          placement="start"
        />,
        <HoverNodeController
          key="hover"
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,
        <DeleteNodeController key="spacerDelete" />,
        // Height drag control
        <DragAdjustNodeController
          key="spacerHeight"
          position="bottom"
          align="end"
          direction="vertical"
          propVar="height"
          styleToUse="height"
          tooltip="Drag to adjust height"
        />,
        // Width drag control
        <DragAdjustNodeController
          key="spacerWidth"
          position="right"
          align="middle"
          direction="horizontal"
          propVar="width"
          styleToUse="width"
          gridSnap={12}
          tooltip="Drag to adjust width"
        />,
      ];

      return [...baseControls];
    },
  },
};
