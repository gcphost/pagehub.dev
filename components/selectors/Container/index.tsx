import { useEditor, useNode } from "@craftjs/core";
import { DragAdjustNodeController } from "components/editor/NodeControllers/DragAdjustNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ContainerSettingsNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsNodeTool";
import ContainerSettingsTopNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsTopNodeTool";
import { ToolboxMenu } from "components/editor/RenderNode";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import { SelectedNodeAtom } from "components/editor/Viewport/Toolbox/lib";
import React, { useEffect, useRef } from "react";
import { CgArrowsV } from "react-icons/cg";
import { TbArrowBarToDown, TbContainer, TbNote } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { applyBackgroundImage, enableContext, motionIt } from "utils/lib";
import { CSStoObj, ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { EmptyState } from "../EmptyState";
import { RenderGradient, RenderPattern, hasInlay, inlayProps } from "../lib";
import { ContainerSettings } from "./ContainerSettings";

export interface ContainerProps extends BaseSelectorProps {
  type: string;
  isHomePage?: boolean;
  anchor?: string;
  action?: string;
  method?: string;
  onSubmit?: any;
  target?: any;
  id?: any;
}

const defaultProps: ContainerProps = {
  type: "container",
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
  canDelete: true,
  canEditName: true,
  isHomePage: false,
};

export const Container = (props: Partial<ContainerProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const view = useRecoilValue(ViewAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);
  const preview = useRecoilValue(PreviewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const setSelectedNode = useSetRecoilState(SelectedNodeAtom);

  const {
    connectors: { connect, drag },
  } = useNode();

  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  const { name, id } = useNode((node) => ({
    name: node.data.custom.displayName || node.data.displayName,
  }));

  //  const [isolate, setIsolate] = useRecoilState(IsolateAtom);

  useEffect(() => {
    if (props.type === "page") {
      // isolatePage(false, query, id, actions, setIsolate);
    }
  }, []);

  props = setClonedProps(props, query, ["order"]);

  const { children } = props;

  const ref = useRef(null);

  const contexted = (e) => {
    if (!enabled || !enableContext) return;
    if (!enableContext) {
      const theNode = id ? query.node(id).get() : { data: "no active node" };

      console.info(theNode.data);
    }

    if (!enabled || !enableContext) return;

    e.preventDefault();
    e.stopPropagation();

    setMenu({
      x: e.clientX,
      y: e.clientY,
      enabled: true,
      position: "inside",
      name,
      id,
      parent: {
        name,
        props,
        displayName: name,
      },
    });
  };

  const inlayed = hasInlay(props);

  const className = ClassGenerator(
    props,
    view,
    enabled,
    inlayed ? inlayProps : [],
    [],
    preview
  );

  let prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    style: props.root?.style ? CSStoObj(props.root.style) || {} : {},
    className,
    children: (
      <RenderPattern
        props={props}
        settings={settings}
        view={view}
        enabled={enabled}
        properties={inlayProps}
        preview={preview}
      >
        <RenderGradient
          props={props}
          view={view}
          enabled={enabled}
          properties={inlayProps}
          preview={preview}
        >
          {children || (
            <EmptyState
              icon={props.type === "page" ? <TbNote /> : <TbContainer />}
            />
          )}
        </RenderGradient>
      </RenderPattern>
    ),
  };

  if (props.url) {
    prop.onClick = (e) => {
      e.preventDefault();

      if (!enabled) {
        window.open(props.url, props.urlTarget);
      }
    };
  }

  if (props.type === "form") {
    prop.action = props.action;
    prop.method = props.method;
    prop.onSubmit = props.onSubmit;
    prop.target = props.target;
  }

  if (props.id) prop.id = props.id;

  if (enabled) {
    prop["data-border"] = !!(props.root?.border || props.root?.borderColor);

    prop["data-bounding-box"] = enabled;
    prop.onContextMenu = contexted;
    prop.onDoubleClick = contexted;
    prop["data-empty-state"] = !children;
    prop["node-id"] = id;
    prop["data-enabled"] = true;

    prop.onClick = (event) => {
      let closestChild = null;
      let minDistance = Infinity;
      const children = ref.current.querySelectorAll("*");

      children.forEach((child) => {
        const childRect = child.getBoundingClientRect();
        const childTop = childRect.top;
        const childBottom = childRect.bottom;

        if (event.clientY >= childTop && event.clientY <= childBottom) {
          closestChild = child;
          return;
        }

        let distance = null;
        if (event.clientY < childTop) {
          distance = childTop - event.clientY;
        } else if (event.clientY > childBottom) {
          distance = event.clientY - childBottom;
        }

        if (distance !== null && distance < minDistance) {
          minDistance = distance;
          closestChild = child;
        }
      });

      if (closestChild) {
        setSelectedNode({
          id: closestChild.getAttribute(["node-id"]),
          position: "after",
        });
      }
    };
  }

  if (props.anchor) prop.id = props.anchor;

  prop = {
    ...applyBackgroundImage(prop, props, settings),
    ...applyAnimation({ ...prop, key: id }, props),
  };

  let tagName = props?.type === "page" ? "article" : "div";

  if (props?.type === "form") tagName = "form";

  const container = React.createElement(motionIt(prop, tagName), prop);

  return container;
};

const canMoveIn = (nodes, into) => {
  const result = nodes.every((node) => {
    if (node?.data?.props?.type === "form") {
      if (into.data?.props?.type === "form") return false;
    }

    return node?.data?.props?.type !== "page";
  });

  // console.log(nodes, into, result);

  return result;
};

Container.craft = {
  displayName: "Container",
  rules: {
    canDrag: () => true,
    canMoveIn: (node, into) => canMoveIn(node, into),
  },
  related: {
    toolbar: ContainerSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="start"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,
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

        <ToolNodeController
          position="bottom"
          align="start"
          alt={{
            position: "top",
            align: "start",
            placement: "start",
          }}
        >
          <ContainerSettingsNodeTool />
        </ToolNodeController>,
      ];

      if (props.type === "page") {
        return baseControls;
      }

      return [
        ...baseControls,
        <DragAdjustNodeController
          position="top"
          align="end"
          direction="vertical"
          propVar="mt"
          styleToUse="marginTop"
          name="Margin"
          icon={<TbArrowBarToDown />}
        />,
        <DragAdjustNodeController
          position="bottom"
          align="end"
          direction="vertical"
          propVar="height"
          styleToUse="height"
          name="Height"
          icon={<CgArrowsV />}
        />,
        <ToolNodeController position="top" align="middle" placement="start">
          <ContainerSettingsTopNodeTool />
        </ToolNodeController>,
        <ToolNodeController position="left" align="middle" placement="middle">
          <ContainerSettingsTopNodeTool direction="vertical" />
        </ToolNodeController>,
      ];
    },
  },
};
