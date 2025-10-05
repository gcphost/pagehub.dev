import { useEditor, useNode } from "@craftjs/core";
import { CSStoObj, ClassGenerator, applyAnimation } from "utils/tailwind";

import React, { useEffect, useRef, useState } from "react";
import { TbContainer } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ContainerSettingsNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsNodeTool";
import { ToolboxMenu } from "components/editor/RenderNode";
import { DeviceAtom, PreviewAtom, ViewAtom } from "components/editor/Viewport";
import { SettingsAtom } from "utils/atoms";
import {
  applyBackgroundImage,
  enableContext,
  isCssValid,
  isJsValid,
} from "utils/lib";
import { PaletteProvider } from "utils/PaletteContext";
import { BaseSelectorProps } from "..";
import { EmptyState } from "../EmptyState";
import { RenderGradient, RenderPattern, hasInlay, inlayProps } from "../lib";
import { BackgroundSettings } from "./BackgroundSettings";

export interface NamedColor {
  name: string;
  color: string;
}

export interface ContainerProps extends BaseSelectorProps {
  activeTab?: number;
  "data-renderer"?: boolean;
  pallet?: NamedColor[];
  header?: string;
  footer?: string;
  pageTitle?: string;
  pageDescription?: string;
  ico?: string;
  icoType?: string;
  icoContent?: string;
  pageMedia?: Array<{
    id: string;
    type: string;
    uploadedAt: number;
    componentId?: string;
  }>;
  savedComponents?: Array<{
    rootNodeId: string;
    nodes: string;
    name: string;
  }>;
}

const defaultProps: ContainerProps = {
  type: "background",
  pallet: [
    { name: "Primary", color: "blue-500" },
    { name: "Secondary", color: "purple-500" },
    { name: "Accent", color: "orange-500" },
    { name: "Neutral", color: "gray-500" },
    { name: "Background", color: "white" },
    { name: "Alternate Background", color: "gray-50" },
    { name: "Text", color: "gray-900" },
    { name: "Alternate Text", color: "gray-600" },
  ],
  root: {},
  mobile: {
    width: "w-full",
    height: "h-full",
    display: "flex",
    flexDirection: "flex-col",
    alignItems: "items-center",
  },
  tablet: {},
  desktop: {},
  backgroundFetchPriority: "low",
  pageMedia: [],
  savedComponents: [],
};

export const Background = (props: Partial<ContainerProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };
  const { children } = props;

  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const view = useRecoilValue(ViewAtom);
  const device = useRecoilValue(DeviceAtom);
  const preview = useRecoilValue(PreviewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const setMenu = useSetRecoilState(ToolboxMenu);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const contexted = (e) => {
    if (!enabled || !enableContext) return;

    e.preventDefault();
    e.stopPropagation();

    setMenu({
      enabled: true,
      x: e.clientX,
      y: e.clientY,
      position: "inside",
      name: "Background",
      id,
      parent: {
        name: "Background",
        props,
        displayName: "Background",
      },
    });
  };

  const inlayed = hasInlay(props);

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    style: {
      ...(props.root?.style ? CSStoObj(props.root.style) || {} : {}),
      ...(enabled ? { position: 'relative' } : {}),
    },
    className: ClassGenerator(
      props,
      view,
      enabled,
      inlayed ? inlayProps : [],
      [],
      preview,
      false,
      props.pallet || []
    ),
  };

  if (enabled) {
    prop["data-no-scrollbars"] = view !== "desktop" && device;
    prop["data-renderer"] = enabled;
    prop["data-bounding-box"] = enabled;
    prop.onContextMenu = contexted;
    prop["node-id"] = id;
    prop["main-node"] = "true";
  }
  const validScriptTypes = ["link", "meta", "title", "style", "script"];

  function addElementsToHead(header, head) {
    const elements = [];

    if (header && typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(header, "text/html");
      const headElement = doc.head;

      for (let i = 0; i < headElement.childNodes?.length; i++) {
        const node: Element = headElement.childNodes[i] as Element;
        const nodeName = node.nodeName.toLowerCase();

        if (validScriptTypes.includes(nodeName)) {
          if (nodeName === "style") {
            const styleContent = node.textContent.trim();

            if (!isCssValid(styleContent)) {
              console.warn(
                `Ignoring invalid ${nodeName} element: ${node.textContent}`
              );
              continue;
            }
          }

          if (nodeName === "script") {
            if (node.hasAttribute("src")) {
              const src = node.getAttribute("src");
              const script = document.createElement("script");
              script.setAttribute("src", src);
              script.setAttribute("async", "");
              elements.push(script);

              try {
                head.appendChild(script);
              } catch (e: any) {
                console.warn(`Failed to load ${src}: ${e.message}`);
              }
            } else {
              const scriptContent = node.textContent.trim();

              if (!isJsValid(scriptContent)) {
                console.warn(
                  `Ignoring invalid ${nodeName} element: ${node.textContent}`
                );
                continue;
              }

              const script = document.createElement(nodeName);
              script.textContent = scriptContent;
              elements.push(script);

              try {
                head.appendChild(script);
              } catch (e) {
                console.warn(
                  `Failed to append ${nodeName} element: ${node.textContent}`
                );
              }
            }
          }

          if (nodeName === "link") {
            if (
              node.hasAttribute("href") &&
              node.hasAttribute("rel") &&
              node.getAttribute("rel") === "stylesheet"
            ) {
              const href = node.getAttribute("href");
              const link = document.createElement("link");
              link.setAttribute("href", href);
              link.setAttribute("rel", "stylesheet");
              elements.push(link);

              try {
                head.appendChild(link);
              } catch (e: any) {
                console.warn(`Failed to load ${href}: ${e.message}`);
              }
            } else {
              console.warn(
                `Ignoring invalid ${nodeName} element: ${node.textContent}`
              );
            }
          }
        }
      }
    }
    return elements;
  }

  useEffect(() => {
    const head = document.getElementsByTagName("head")[0];

    const elements = addElementsToHead(props.header, head);

    return () => {
      elements?.forEach((element) => {
        head.removeChild(element);
      });
    };
  }, [props.header]);

  useEffect(() => {
    const head = document.body;

    const elements = addElementsToHead(props.footer, head);

    return () => {
      elements?.forEach((element) => {
        head.removeChild(element);
      });
    };
  }, [props.footer]);

  prop.children = (
    <PaletteProvider palette={props.pallet || []}>
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
          {children || <EmptyState icon={<TbContainer />} />}
        </RenderGradient>
      </RenderPattern>
      {enabled && isMounted && (
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={Background} props={props} />
      )}
    </PaletteProvider>
  );

  // In edit mode with inline tools, set overflow: visible so controls aren't clipped
  if (enabled && isMounted) {
    prop.style = {
      ...(prop.style || {}),
      overflow: 'visible',
    };
  }

  applyBackgroundImage(prop, props, settings);
  applyAnimation(prop, props);

  return React.createElement("main", prop);
};

Background.craft = {
  displayName: "Background",
  rules: {
    canDrag: () => false,
    canMoveIn: (nodes) =>
      nodes.every((node) => node.data?.name === "Container"),
  },
  related: {
    toolbar: BackgroundSettings,
  },
  props: {
    tools: () => [
      <NameNodeController key="name" position="bottom" align="end" placement="start" />,
      <ToolNodeController key="tool" position="bottom" align="start" placement="start">
        <ContainerSettingsNodeTool />
      </ToolNodeController>,
    ],
  },
};
