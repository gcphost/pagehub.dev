import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { InitialLoadCompleteAtom, PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { motionIt, resolvePageRef, selectAfterAdding } from "utils/lib";
import { usePalette } from "utils/PaletteContext";
import {
  applyAnimation,
  ClassGenerator
} from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";
import { ButtonSettings } from "./ButtonSettings";

interface ButtonProps extends BaseSelectorProps {
  text?: string;
  icon?: string;
  url?: string;
  type?: string;
  iconOnly?: boolean;
  iconPosition?: string;
  iconSize?: string;
  iconFontSize?: string;
  iconColor?: string;
  iconGap?: string;
  iconShadow?: string;
  clickType?: string;
  clickValue?: string;
  clickDirection?: string;
}

const defaultProps: ButtonProps = {
  className: [],
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
  canDelete: true,
  canEditName: true,
  text: "Button",
  type: "button",
  iconPosition: "left",
  iconSize: "w-6 h-6",
  iconGap: "gap-2",
};

export const Button: UserComponent<ButtonProps> = (props: ButtonProps) => {
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
  const settings = useRecoilValue(SettingsAtom);
  const router = useRouter();
  const tab = useSetRecoilState(TabAtom);
  const initialLoadComplete = useRecoilValue(InitialLoadCompleteAtom);

  props = setClonedProps(props, query);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useScrollToSelected(id, enabled);
  selectAfterAdding(actions.selectNode, tab, id, enabled, initialLoadComplete);

  const baseProps = [
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer",
    "transition-colors",
    "duration-200",
  ];

  const inlayProps = [
    "flex",
    "items-center",
    "justify-center",
  ];

  const include = [
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer",
    "transition-colors",
    "duration-200",
  ];

  const prop: any = {
    ref: (r) => connect(drag(r)),
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

  // Resolve page references to actual URLs
  const resolvedUrl = props.url && typeof props.url === "string"
    ? resolvePageRef(props.url, query, router?.asPath)
    : props.url;

  let ele = resolvedUrl && typeof resolvedUrl === "string" ? Link : props.type || "button";

  if (resolvedUrl && typeof resolvedUrl === "string") {
    prop.href = resolvedUrl;
  }

  if (enabled && ele === Link) ele = "span";

  // Handle click actions
  const handleClick = () => {
    if (enabled) {
      return;
    }

    if (props.clickType === "click" && props.clickDirection && props.clickValue) {
      const element = document.getElementById(props.clickValue);
      if (element) {
        if (props.clickDirection === "show") {
          element.style.display = "block";
        } else if (props.clickDirection === "hide") {
          element.style.display = "none";
        } else if (props.clickDirection === "toggle") {
          element.style.display = element.style.display === "none" ? "block" : "none";
        }
      }
    }
  };

  const handleMouseEnter = () => {
    if (enabled) {
      return;
    }

    if (props.clickType === "hover" && props.clickDirection && props.clickValue) {
      const element = document.getElementById(props.clickValue);
      if (element) {
        if (props.clickDirection === "show") {
          element.style.display = "block";
        } else if (props.clickDirection === "hide") {
          element.style.display = "none";
        } else if (props.clickDirection === "toggle") {
          element.style.display = element.style.display === "none" ? "block" : "none";
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (enabled) {
      return;
    }

    if (props.clickType === "hover" && props.clickDirection && props.clickValue) {
      const element = document.getElementById(props.clickValue);
      if (element) {
        if (props.clickDirection === "show") {
          element.style.display = "none";
        } else if (props.clickDirection === "hide") {
          element.style.display = "block";
        }
        // For toggle, we don't revert on mouse leave
      }
    }
  };

  const handleDoubleClick = () => {
    if (enabled && props.clickType === "click" && props.clickDirection && props.clickValue) {
      const element = document.getElementById(props.clickValue);
      if (element) {
        if (props.clickDirection === "show") {
          element.style.display = "block";
        } else if (props.clickDirection === "hide") {
          element.style.display = "none";
        } else if (props.clickDirection === "toggle") {
          element.style.display = element.style.display === "none" ? "block" : "none";
        }
      }
    }
  };

  prop.onClick = handleClick;
  prop.onMouseEnter = handleMouseEnter;
  prop.onMouseLeave = handleMouseLeave;
  prop.onDoubleClick = handleDoubleClick;

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["node-id"] = id;
  }

  const iconClass = [
    props.iconSize || "w-6 h-6",
    props.iconColor || "fill-current",
    props.iconShadow,
    "flex",
    "items-center",
  ];

  const content = (
    <>
      {enabled && isMounted && (
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={Button} props={props} />
      )}

      {props.icon && props.iconPosition === "left" && (

        <div className={iconClass.join(" ")} dangerouslySetInnerHTML={{ __html: props.icon }} />

      )}

      {!props.iconOnly && props.text && (
        <span className="flex items-center">
          {props.text}
        </span>
      )}

      {props.icon && props.iconPosition === "right" && (

        <div className={iconClass.join(" ")} dangerouslySetInnerHTML={{ __html: props.icon }} />

      )}
    </>
  );

  prop.children = content;

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["node-id"] = id;
  }

  const final = applyAnimation({ ...prop, key: `${id}` }, props);

  return React.createElement(motionIt(props, ele), final);
};

Button.craft = {
  displayName: "Button",
  rules: {
    canDrag: () => true,
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Button"),
  },
  related: {
    toolbar: ButtonSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [

        <HoverNodeController
          key="buttonHoverController"
          position="top"
          align="end"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,

        <DeleteNodeController key="buttonDelete" />,
      ];

      return [...baseControls];
    },
  },
};