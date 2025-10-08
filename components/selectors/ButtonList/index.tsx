import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useState } from "react";
import { RxButton } from "react-icons/rx";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { usePalette } from "utils/PaletteContext";
import {
  applyAnimation,
  ClassGenerator,
  CSStoObj,
} from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";
import { ButtonListSettings } from "./ButtonListSettings";

type ButtonArrayProp = {
  type?: string;
  text: string;
  icon?: string;
  url?: string;
  onClick?: any;
  background?: string;
  color?: string;
  border?: string;
  iconOnly?: boolean;
  clickType?: string;
  clickDirection?: string;
  clickValue?: string;
  root?: {
    background?: string;
    color?: string;
    border?: string;
  };
};

interface ButtonListProps extends BaseSelectorProps {
  buttons?: ButtonArrayProp[];
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
}

const defaultProps: ButtonListProps = {
  className: [],
  root: {},
  mobile: {
    flexDirection: "flex-col",
  },
  tablet: {},
  desktop: {
    flexDirection: "flex-row",
  },
  buttons: [],
  alignItems: "items-center",
  justifyContent: "justify-start",
  gap: "gap-2",
};

export const ButtonList: UserComponent<ButtonListProps> = (props: ButtonListProps) => {
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

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const palette = usePalette();

  props = setClonedProps(props, query);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useScrollToSelected(id, enabled);

  const baseProps = [
    "flexDirection",
    "alignItems",
    "justifyContent",
    "gap",
  ];

  const prop: any = {
    ref: (r) => {
      connect(drag(r));
    },
    style: props.root.style ? CSStoObj(props.root.style) || {} : {},
    className: ClassGenerator(
      props,
      view,
      enabled,
      [],
      [],
      preview,
      false,
      palette
    ),
  };

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["node-id"] = id;
  }

  const element = motionIt(props, "div");

  const { children } = props;

  // Check if there are non-hamburger Button children
  let hasActualButtons = false;
  if (enabled) {
    try {
      const node = query.node(id).get();
      const childButtons = node.data.nodes || [];

      hasActualButtons = childButtons.some((childId) => {
        try {
          const childNode = query.node(childId).get();
          // Only count Button components that aren't hamburger menus
          if (childNode.data.name === 'Button') {
            const isHamburger = childNode.data.props?.clickValue?.includes('mobile-menu');
            return !isHamburger;
          }
          return false;
        } catch (e) {
          return false;
        }
      });
    } catch (e) {
      hasActualButtons = !!children;
    }
  } else {
    hasActualButtons = !!children;
  }

  const content = (
    <>
      {enabled && isMounted && (
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={ButtonList} props={props} />
      )}
      {hasActualButtons || !enabled ? (
        children
      ) : (
        enabled && (
          <div className="w-auto flex justify-center items-center p-4">
            <div data-empty-state={true} className="text-3xl">
              <RxButton />
            </div>
          </div>
        )
      )}
    </>
  );

  prop.children = content;

  return React.createElement(element, {
    ...applyAnimation(prop, props),
  });
};

ButtonList.craft = {
  displayName: "Button List",
  rules: {
    canDrag: () => true,
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Button"),
  },
  related: {
    toolbar: ButtonListSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [

        <HoverNodeController
          key="buttonListHoverController"
          position="top"
          align="end"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <DeleteNodeController key="buttonListDelete" />,



      ];

      return [...baseControls];
    },
  },
};
