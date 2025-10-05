import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { AddSectionNodeController } from "components/editor/NodeControllers/AddSectionNodeController";
import { DragAdjustNodeController } from "components/editor/NodeControllers/DragAdjustNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ContainerSettingsNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsNodeTool";
import ContainerSettingsTopNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsTopNodeTool";
import { UniformPaddingNodeController } from "components/editor/NodeControllers/UniformPaddingNodeController";
import { ToolboxMenu } from "components/editor/RenderNode";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import { SelectedNodeAtom } from "components/editor/Viewport/Toolbox/lib";
import React, { useEffect, useRef, useState } from "react";
import { TbContainer, TbNote } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { applyBackgroundImage, enableContext, motionIt } from "utils/lib";
import { usePalette } from "utils/PaletteContext";
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
  role?: string;
  "aria-label"?: string;
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
  backgroundFetchPriority: "low",
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
  const palette = usePalette();

  const {
    connectors: { connect, drag },
  } = useNode();

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    preview,
    false,
    palette
  );

  let prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    style: {
      ...(props.root?.style ? CSStoObj(props.root.style) || {} : {}),
      // Add relative positioning in edit mode for inline controls
      ...(enabled && props.type !== "page" ? { position: 'relative' } : {}),
    },
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
  if (props.role) prop.role = props.role;
  if (props["aria-label"]) prop["aria-label"] = props["aria-label"];

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

  if (props?.type === "form") {
    // Render as div in edit mode for better drag support, form in preview mode
    tagName = enabled ? "div" : "form";
  }

  // Add inline controls as children if in edit mode (skip for pages, after hydration)
  if (enabled && props.type !== "page" && isMounted) {
    prop.style = {
      ...(prop.style || {}),
      overflow: 'visible',
    };
    const originalChildren = prop.children;
    prop.children = (
      <>
        {originalChildren}
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={Container} props={props} />
      </>
    );
  }

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

  return result;
};

Container.craft = {
  displayName: "Container",
  rules: {
    canDrag: () => true,
    canMoveIn: (node, into) => canMoveIn(node, into),
    /*canMoveOut: (outgoingNodes, currentNode, helpers) => {
      // Check if this Container is inside a Form
      const nodeData = helpers.query.node(currentNode.id).get();
      const parent = nodeData.parent;
      if (parent) {
        const parentNode = helpers.query.node(parent).get();
        // Only prevent moving out if parent is FormDrop (the actual form)
        if (parentNode.data.type === "FormDrop") {
          return false;
        }
      }
      return true; // Allow moving out for all other containers
    }, buggy but we gotta stop forms fromb eing messuspable*/
  },
  related: {
    toolbar: ContainerSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          key="container1"
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
          key="container2"
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
          key="container3"
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

      const addControls = [
        <AddSectionNodeController
          key="containeraddbottom"
          position="bottom"
          align="middle"
        />,
      ];

      if (props.type === "page") {
        return [...baseControls, ...addControls];
      }

      return [
        ...baseControls,
        ...addControls,
        <DragAdjustNodeController
          key="containerdrag1"
          position="top"
          align="end"
          direction="vertical"
          propVar="mt"
          styleToUse="marginTop"
          tooltip="Drag to adjust margin"
        />,
        <DragAdjustNodeController
          key="containerdrag2"
          position="bottom"
          align="end"
          direction="vertical"
          propVar="height"
          styleToUse="height"
          tooltip="Drag to adjust height"
        />,
        <DragAdjustNodeController
          key="containerdrag3"
          position="right"
          align="middle"
          direction="horizontal"
          propVar="width"
          styleToUse="width"
          gridSnap={12}
          tooltip="Drag to adjust width"
        />,
        // Padding controls (inside border)
        <DragAdjustNodeController
          key="paddingdrag1"
          position="top"
          align="middle"
          direction="vertical"
          propVar="pt"
          styleToUse="paddingTop"
          tooltip="Drag to adjust top padding"
          isPadding={true}
        />,
        <DragAdjustNodeController
          key="paddingdrag2"
          position="bottom"
          align="start"
          direction="vertical"
          propVar="pb"
          styleToUse="paddingBottom"
          tooltip="Drag to adjust bottom padding"
          isPadding={true}
        />,
        <DragAdjustNodeController
          key="paddingdrag3"
          position="left"
          align="middle"
          direction="horizontal"
          propVar="pl"
          styleToUse="paddingLeft"
          tooltip="Drag to adjust left padding"
          isPadding={true}
        />,
        <DragAdjustNodeController
          key="paddingdrag4"
          position="right"
          align="middle"
          direction="horizontal"
          propVar="pr"
          styleToUse="paddingRight"
          tooltip="Drag to adjust right padding"
          isPadding={true}
        />,
        <UniformPaddingNodeController key="uniformpadding" />,
        <ToolNodeController
          position="top"
          align="middle"
          placement="start"
          key="containercontroller1"
        >
          <ContainerSettingsTopNodeTool />
        </ToolNodeController>,
        <ToolNodeController
          position="left"
          align="middle"
          placement="middle"
          key="containercontroller2"
        >
          <ContainerSettingsTopNodeTool direction="vertical" />
        </ToolNodeController>,
      ];
    },
  },
};
