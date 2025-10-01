import { useEditor, useNode } from "@craftjs/core";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import React, { useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motionIt, selectAfterAdding } from "utils/lib";
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

  const ref = useRef(null);

  props = setClonedProps(props, query);

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
    applyAnimation({ ...prop, key: id }, props)
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
        <NameNodeController key="name" position="top" align="end" placement="start" />,
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
      ];

      return [...baseControls];
    },
  },
};
