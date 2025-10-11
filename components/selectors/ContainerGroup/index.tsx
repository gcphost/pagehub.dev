import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ContainerSettingsTopNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsTopNodeTool";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useRef, useState } from "react";
import { TbContainer } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { mergeAccessibilityProps } from "utils/accessibility";
import { SettingsAtom } from "utils/atoms";
import {
  IsolateAtom,
  ViewModeAtom,
  applyBackgroundImage,
  motionIt,
} from "utils/lib";
import { usePalette } from "utils/PaletteContext";
import { CSStoObj, ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { EmptyState } from "../EmptyState";
import { RenderGradient, RenderPattern, hasInlay, inlayProps } from "../lib";
import { ContainerGroupSettings } from "./ContainerGroupSettings";

export interface ContainerGroupProps extends BaseSelectorProps {
  items?: Array<{
    id: string;
    type: string;
    props: any;
    media?: any;
  }>;
  groupSettings?: {
    [type: string]: {
      [settingKey: string]: any;
    };
  };
  backgroundPattern?: any;
  backgroundGradient?: any;
  id?: string;
  role?: string;
  "aria-label"?: string;
}

export const ContainerGroup = (props: ContainerGroupProps) => {
  const { query, actions } = useEditor();
  const { connectors, id } = useNode();
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const view = useRecoilValue(ViewAtom);
  const viewMode = useRecoilValue(ViewModeAtom);
  const isolate = useRecoilValue(IsolateAtom);
  const preview = useRecoilValue(PreviewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const setSettings = useSetRecoilState(SettingsAtom);
  const palette = usePalette();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Group components by type
  const groupedComponents = React.useMemo(() => {
    const groups: { [type: string]: any[] } = {};
    const items = props.items || [];
    items.forEach((item) => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });
    return groups;
  }, [props.items]);

  // Generate CSS classes
  const cssClasses = React.useMemo(() => {
    const inlayed = hasInlay(props);
    return ClassGenerator(
      props,
      view,
      enabled,
      inlayed ? inlayProps : [],
      [],
      preview,
      false,
      palette,
      query,
    );
  }, [props, view, enabled, preview, palette, query]);

  const inlayed = hasInlay(props);

  let className = ClassGenerator(
    props,
    view,
    enabled,
    inlayed ? inlayProps : [],
    [],
    preview,
    false,
    palette,
    query,
  );

  // Hide container if needed
  if (enabled) {
    // In preview mode, only show if this specific component is isolated
    if (viewMode === "preview" && isolate && isolate !== id) {
      className = `${className} hidden`;
    }
    // In component mode, only show if this specific component is isolated
    else if (viewMode === "component" && isolate && isolate !== id) {
      className = `${className} hidden`;
    }
  }

  let prop: any = {
    ref: (r) => {
      containerRef.current = r;
      connectors.connect(connectors.drag(r));
    },
    style: {
      ...(props.root?.style ? CSStoObj(props.root.style) || {} : {}),
    },
    className,
    children: (
      <>
        {/* Render background elements */}
        {props.backgroundPattern && (
          <RenderPattern
            props={props}
            settings={settings}
            view={view}
            enabled={enabled}
            properties={inlayProps}
            preview={preview}
            query={query}
          >
            <></>
          </RenderPattern>
        )}
        {props.backgroundGradient && (
          <RenderGradient
            props={props}
            view={view}
            enabled={enabled}
            properties={inlayProps}
            preview={preview}
            query={query}
          >
            <></>
          </RenderGradient>
        )}

        {/* Render grouped components */}
        {Object.entries(groupedComponents).map(([type, components]) => (
          <div key={type} className="group-section">
            <h3 className="group-title">
              {type}s ({components.length})
            </h3>
            <div className="group-items">
              {components.map((component, index) => (
                <div key={component.id} className="group-item">
                  {/* Render individual component */}
                  {props.children}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Render children */}
        {props.children}

        {/* Render empty state if no items */}
        {(props.items || []).length === 0 && <EmptyState icon={TbContainer} />}

        {/* Render inline tools */}
        <InlineToolsRenderer />
      </>
    ),
  };

  if (enabled) {
    prop["data-border"] = !!(props.root?.border || props.root?.borderColor);
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = !props.children;
    prop["node-id"] = id;
    prop["data-enabled"] = true;
  }

  if (props.id) prop.id = props.id;
  if (props.role) prop.role = props.role;
  if (props["aria-label"]) prop["aria-label"] = props["aria-label"];

  prop = mergeAccessibilityProps(
    {
      ...applyBackgroundImage(prop, props, settings, query),
      ...applyAnimation({ ...prop, key: id }, props),
    },
    props,
  );

  let tagName = "div";

  // Add inline controls as children if in edit mode (skip for pages, after hydration)
  if (enabled && props.type !== "page" && isMounted) {
    prop.style = {
      ...(prop.style || {}),
      overflow: "visible",
    };
    const originalChildren = prop.children;
    prop.children = (
      <>
        {originalChildren}
        <InlineToolsRenderer />
      </>
    );
  }

  const container = React.createElement(motionIt(prop, tagName), prop);

  return container;
};

ContainerGroup.craft = {
  displayName: "Container Group",
  props: {
    items: [],
    groupSettings: {},
  },
  related: {
    toolbar: ContainerGroupSettings,
  },
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  tools: (props) => {
    const baseControls = [
      <ToolNodeController
        position="top"
        align="middle"
        placement="start"
        key="containergroupcontroller1"
      >
        <ContainerSettingsTopNodeTool />
      </ToolNodeController>,
      <ToolNodeController
        position="left"
        align="middle"
        placement="middle"
        key="containergroupcontroller2"
      >
        <ContainerSettingsTopNodeTool direction="vertical" />
      </ToolNodeController>,
    ];

    return baseControls;
  },
};
