import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
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
import { DividerSettings } from "./DividerSettings";

interface DividerProps extends BaseSelectorProps {
  url?: string;
  showName?: string;
}

const defaultProps: DividerProps = {
  className: [],
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
};

export const Divider = (props: DividerProps) => {
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

  // If in edit mode and mounted, wrap hr in a minimal container with inline tools
  if (enabled && isMounted) {
    const containerProp: any = {
      ref: (r) => {
        ref.current = r;
        connect(drag(r));
      },
      // Copy width and alignment classes to wrapper so it has same dimensions as hr
      className: ClassGenerator(props, view, enabled, [], [], preview),
      "data-bounding-box": enabled,
      "data-empty-state": false,
      "node-id": id,
    };

    // Hr inside gets minimal styling
    const hrProp: any = {
      className: "", // No classes needed, wrapper handles it
    };

    const hr = React.createElement(
      motionIt(props, "hr"),
      applyAnimation({ ...hrProp, key: `hr-${id}` }, props),
    );

    return (
      <div {...containerProp}>
        {hr}
        <InlineToolsRenderer
          key={`tools-${id}`}
          craftComponent={Divider}
          props={props}
        />
      </div>
    );
  }

  const hrProp: any = {
    className: ClassGenerator(props, view, enabled, [], [], preview),
  };

  const hr = React.createElement(
    motionIt(props, "hr"),
    applyAnimation({ ...hrProp, key: `hr-${id}` }, props),
  );

  // In preview mode, just connect to the hr directly
  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    className: ClassGenerator(props, view, enabled, [], [], preview),
  };

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = false;
    prop["node-id"] = id;
  }

  return React.createElement(
    motionIt(props, "hr"),
    applyAnimation({ ...prop, key: id }, props),
  );
};

Divider.craft = {
  displayName: "Divider",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: DividerSettings,
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
        <DeleteNodeController key="dividerDelete" />,
      ];

      return [...baseControls];
    },
  },
};
