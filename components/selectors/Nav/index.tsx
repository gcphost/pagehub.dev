import { Element, useEditor, useNode, UserComponent } from "@craftjs/core";

import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ContainerSettingsNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsNodeTool";
import ContainerSettingsTopNodeTool from "components/editor/NodeControllers/Tools/ContainerSettingsTopNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import ClientIconLoader from "components/editor/Toolbar/Tools/ClientIconLoader";
import { InitialLoadCompleteAtom, PreviewAtom, TabAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import debounce from "lodash.debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TbRectangle } from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { mergeAccessibilityProps } from "utils/accessibility";
import { SettingsAtom } from "utils/atoms";
import { applyBackgroundImage, motionIt, resolvePageRef, selectAfterAdding } from "utils/lib";
import { usePalette } from "utils/PaletteContext";
import {
  applyAnimation,
  ClassGenerator,
  CSStoObj,
} from "utils/tailwind";
import { replaceVariables } from "utils/variables";
import { BaseSelectorProps, BaseStyleProps, RootStyleProps } from "..";
import { Button } from "../Button";
import { ButtonList } from "../ButtonList";
import { Container } from "../Container";
import {
  hasInlay,
  RenderGradient,
  RenderPattern,
  useScrollToSelected,
} from "../lib";
import { Text } from "../Text";
import { NavSettings, SelectedNavItemAtom } from "./NavSettings";

const EditableName = ({ navItem, ikey, enabled, query, preview }) => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const navItems = getProp(
    { propKey: "navItems", propType: "component" },
    "root",
    nodeProps
  );

  // Replace variables in nav item text (only in preview/published mode, not while editing)
  const displayText = (!enabled || preview) ? replaceVariables(navItem.text, query) : navItem.text;

  if (!enabled) return <span className="flex-1">{displayText}</span>;

  return (
    <span
      className="flex-1 cursor-text"
      contentEditable={true}
      suppressContentEditableWarning={true}
      role="textbox"
      aria-label="Edit nav item text"
      onInput={debounce((e) => {
        const _navItems = [...navItems];
        _navItems[ikey] = { ..._navItems[ikey] };
        _navItems[ikey].text = e.target.innerText;

        changeProp({
          setProp,
          propKey: "navItems",
          propType: "component",
          value: _navItems,
        });
      }, 500)}
    >
      {navItem.text}
    </span>
  );
};

export const OnlyNavItems = ({ children, ...props }) => {
  const {
    connectors: { connect },
  }: any = useNode();
  return (
    <div title="only-nav-items" ref={connect} className="" {...props}>
      {children}
    </div>
  );
};

OnlyNavItems.craft = {
  rules: {
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Nav"),
  },
};

type NavItemArrayProp = {
  type?: string;
  text: string;
  icon?: string;
  iconPosition?: string;
  url?: string;
  onClick?: any;
  background?: string;
  color?: string;
  border?: string;
  iconOnly?: boolean;
  root?: {
    background?: string;
    color?: string;
    border?: string;
  };
};

interface NavItemProp extends RootStyleProps, BaseStyleProps { }

interface NavProps extends BaseSelectorProps {
  flex?: string;
  text?: string;
  textComponent?: any;
  activeTab?: number;
  navItems?: NavItemArrayProp[];
  iconPosition?: string;
  iconSize?: string;
  iconFontSize?: string;
  iconColor?: string;
  iconGap?: string;
  iconShadow?: string;
  navItem?: NavItemProp;
  clickType?: string;
  clickValue?: string;
  clickDirection?: string;
  enableMobileNav?: boolean;
}

const defaultProps: NavProps = {
  tablet: {},
  navItem: {},
  navItems: [],
  className: [],
  root: {},
  mobile: {},
  canDelete: true,
  canEditName: true,
  enableMobileNav: false,
};

export const Nav: UserComponent<NavProps> = (props: NavProps) => {
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

  const router = useRouter();
  const initialLoadComplete = useRecoilValue(InitialLoadCompleteAtom);

  useScrollToSelected(id, enabled);
  selectAfterAdding(
    actions.selectNode,
    useSetRecoilState(TabAtom),
    id,
    enabled,
    initialLoadComplete
  );

  const preview = useRecoilValue(PreviewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const palette = usePalette();
  const [selectedNavItem, setSelectedNavItem] =
    useRecoilState(SelectedNavItemAtom);

  props = setClonedProps(props, query);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultProp: any = {
    ref: (r) => connect(drag(r)),
    style: props.root?.style ? CSStoObj(props.root.style) || {} : {},
    className: ClassGenerator(props, "root", enabled, [], [], preview, false, palette, query),
  };

  if (enabled) {
    if (!props?.navItems?.length) defaultProp.children = <TbRectangle />;
    if (props?.root?.border || props.root?.borderColor || props.root?.radius) {
      defaultProp["data-border"] = true;
    }
    defaultProp["data-bounding-box"] = enabled;
    defaultProp["data-empty-state"] = !props?.navItems?.length;
  }

  if (!props?.navItems?.length) {
    return React.createElement(
      motionIt(props, "div"),
      applyAnimation(defaultProp, props)
    );
  }

  const inlayed = hasInlay(props);

  const inlayProps = [
    "backgroundGradient",
    "backgroundGradientTo",
    "backgroundGradientFrom",
    "px",
    "py",
    "alignItems",
    "textAlign",
    "backgroundRepeat",
    "backgroundSize",
    "backgroundAttachment",
    "backgroundOrigin",
    "backgroundPosition",
    "background",
  ];

  const mainClasses = ["flex", "w-"];

  const baseProps = [
    "flexDirection",
    "alignItems",
    "justifyContent",
    "gap",
    "display",
  ];

  // Render individual nav item
  const renderNavItem = (navItem, key) => {
    // Resolve palette references for per-nav-item properties
    const resolveNavItemPalette = (value: string) => {
      if (typeof value === "string" && value.includes("palette:")) {
        const match = value.match(/^([a-z]+-)?palette:(.+)$/);
        if (match) {
          const prefixPart = match[1] || "";
          const paletteName = match[2];
          const paletteColor = palette.find((p) => p.name === paletteName);
          if (paletteColor) {
            let colorValue = paletteColor.color;
            if (prefixPart && colorValue.startsWith(prefixPart)) {
              return colorValue;
            }
            if (prefixPart) {
              if (colorValue.includes("rgba") || colorValue.includes("rgb") || colorValue.startsWith("#")) {
                return `${prefixPart}[${colorValue}]`;
              } else {
                return `${prefixPart}${colorValue}`;
              }
            }
            return colorValue;
          }
        }
      }
      return value;
    };

    // Get nav-item-specific styles from navItem.root if they exist
    const navItemBg = navItem?.root?.background || navItem?.background || props.root?.background;
    const navItemColor = navItem?.root?.color || navItem?.color || props.root.color;
    const navItemBorder = navItem?.root?.border || navItem?.border || props.root?.border;

    const include = [
      resolveNavItemPalette(navItemBg),
      resolveNavItemPalette(navItemColor),
      resolveNavItemPalette(navItemBorder),
      props?.mobile?.width,
      props?.desktop?.width ? `md:${props.desktop.width}` : null,
      props.iconGap,
      "overflow-hidden",
      "flex",
      "items-center",
    ];

    const iconClass = [
      props.iconSize
        ? `${props.iconSize} h-${props.iconSize.split("w-")[1]}`
        : "w-5 h-5",
      props.iconColor,
      props.iconShadow,
      "flex",
      "items-center",
    ];

    const className = [
      ...ClassGenerator(props.navItem, "root", enabled, [], [], preview, false, palette, query),
      ...ClassGenerator(
        { ...props },
        "root",
        enabled,
        inlayed ? [...inlayProps, ...baseProps] : baseProps,
        [],
        preview,
        false,
        palette,
        query
      ).split(" "),
      ...include,
    ]
      .filter((_) => _)
      .join(" ");

    let prop: any = {};

    // Resolve page references to actual URLs
    const resolvedUrl = navItem.url && typeof navItem.url === "string"
      ? resolvePageRef(navItem.url, query, router?.asPath)
      : navItem.url;

    let ele = resolvedUrl && typeof resolvedUrl === "string" ? Link : "button";

    if (resolvedUrl && typeof resolvedUrl === "string") {
      prop.href = resolvedUrl;
    }

    if (enabled && ele === Link) ele = "span";

    const element: any = motionIt(props, ele);

    prop = mergeAccessibilityProps({
      ...prop,
      key,
      type: navItem.type || "button",
      "aria-label": navItem.text || `Navigation item ${key + 1}`,
      ...(navItem.iconOnly && navItem.text ? { "aria-label": navItem.text } : {}),
      onMouseEnter: () => {
        if (enabled) {
          return;
        }
        const element = document.getElementById(props.clickValue);

        if (!element) return;
        if (props.clickType === "hover" && props.clickValue) {
          element.classList.remove("hidden");
        }
      },
      onMouseLeave: () => {
        if (enabled) {
          return;
        }
        const element = document.getElementById(props.clickValue);

        if (!element) return;
        if (props.clickType === "hover" && props.clickValue) {
          element.classList.add("hidden");
        }
      },

      onClick: (e) => {
        if (enabled) {
          setSelectedNavItem(key);
          // e.preventDefault();
          return;
        }

        if (props.clickType === "click" && props.clickValue) {
          // e.preventDefault();
          const element = document.getElementById(props.clickValue);

          if (!element) return;

          if (props.clickDirection === "show") {
            element.classList.remove("hidden");
            return;
          }

          if (props.clickDirection === "hide") {
            element.classList.add("hidden");
            return;
          }

          if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
          } else {
            element.classList.add("hidden");
          }
        }
      },
      ...applyBackgroundImage({}, props, settings),
      className,
      children: (
        <RenderPattern
          props={props}
          settings={settings}
          view="root"
          enabled={enabled}
          properties={{}}
          preview={preview}
        >
          <RenderGradient
            props={props}
            view="root"
            enabled={enabled}
            properties={inlayProps}
            preview={preview}
          >
            {navItem.icon && props.iconPosition === "left" && (
              <span className={iconClass.join(" ")}>
                <ClientIconLoader value={navItem.icon} />
              </span>
            )}

            {!navItem.iconOnly && (
              <EditableName navItem={navItem} ikey={key} enabled={enabled} query={query} preview={preview} />
            )}

            {navItem.icon && props.iconPosition === "right" && (
              <span className={iconClass.join(" ")}>
                <ClientIconLoader value={navItem.icon} />
              </span>
            )}
          </RenderGradient>
        </RenderPattern>
      ),
    }, props);

    prop = {
      ...applyAnimation(prop, props),
    };

    return React.createElement(element, prop);
  };


  return (
    <>
      <div
        ref={(r: any) => connect(drag(r))}
        className={[
          ...ClassGenerator({ ...props }, "root", enabled, [], baseProps, preview, false, palette, query).split(
            " "
          ),
          ...mainClasses,
        ]
          .filter((_) => _)
          .join(" ")}

      >
        {enabled && isMounted && <InlineToolsRenderer key={`tools`} craftComponent={Nav} props={props} />}

        {/* Desktop Navigation */}
        <Element
          canvas
          id={`desktop-nav`}
          is={ButtonList}
          custom={{ displayName: "Desktop Nav" }}
          canDelete={false}
          canEditName={false}
          mobile={{
            display: "hidden",
            flexDirection: "flex-row",
            alignItems: "items-center",
            gap: "gap-2",
            px: "px-4",
            py: "py-2",
            width: "w-auto",
          }}
          desktop={{
            display: "flex",
            alignItems: "items-center"
          }}
        >
          {props?.navItems?.map((navItem, index) => (
            <Element
              key={`nav-item-${index}`}
              is={Button}
              custom={{ displayName: navItem.text || `Nav Item ${index + 1}` }}
              canDelete={true}
              canEditName={true}
              text={navItem.text}
              url={navItem.url}
              icon={navItem.icon}
              iconOnly={navItem.iconOnly}
              iconPosition={navItem.iconPosition || "left"}
              clickType={props.clickType}
              clickDirection={props.clickDirection}
              clickValue={props.clickValue}
              root={{
                background: navItem.background,
                color: navItem.color,
                border: navItem.border,
                ...navItem.root,
              }}
            />
          ))}
        </Element>

        {/* Mobile Hamburger Button */}
        {props.enableMobileNav && (
          <Element
            canvas
            id={`mobile-nav-hamburger`}
            is={Button}
            custom={{ displayName: "Mobile Nav Hamburger" }}
            canDelete={false}
            canEditName={false}
            clickType="click"
            clickDirection="toggle"
            clickValue={`mobile-nav-${id}`}
            text=""
            url=""
            icon={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>`}
            iconOnly={true}
            root={{
              background: "bg-transparent",
              border: "border-0"
            }}
            mobile={{
              display: "block",
              p: "p-2",
            }}
            desktop={{
              display: "hidden",
            }}
          />
        )}
      </div>

      {/* Mobile Navigation Overlay */}
      {props.enableMobileNav && (
        <Element
          canvas
          id={`mobile-nav-${id}`}
          anchor={`mobile-nav-${id}`}
          is={Container}
          custom={{ displayName: "Mobile Nav Wrapper" }}
          canDelete={false}
          canEditName={false}
          className={["mobile-nav"]}
          clickType="click"
          clickDirection="hide"
          clickValue={`mobile-nav-${id}`}
          mobile={{
            display: "hidden",
            position: "absolute",
            height: "h-full",
            width: "w-full",
            top: "top-0",
            left: "left-0",
            right: "right-0",
            bottom: "bottom-0",
            zIndex: "z-50"

          }}
          root={{
            background: "bg-black",
            bgOpacity: "bg-opacity-50"
          }}
        >
          {/* Mobile Nav Panel Container */}
          <Element
            canvas
            id={`mobile-nav-panel`}
            is={Container}
            custom={{ displayName: "Mobile Nav Panel" }}
            canDelete={false}
            canEditName={false}
            root={{
              background: "bg-white",
              shadow: "shadow-xl"
            }}
            mobile={{
              position: "absolute",
              height: "h-full",
              width: "w-80",
              maxWidth: "max-w-sm",
              transform: "transform"
            }}
          >
            {/* Mobile Nav Header */}
            <Element
              canvas
              id={`mobile-nav-header`}
              is={Container}
              custom={{ displayName: "Mobile Nav Header" }}
              canDelete={false}
              canEditName={false}
              root={{
                borderBottom: "border-b"
              }}
              mobile={{
                display: "flex",
                alignItems: "items-center",
                justifyContent: "justify-between",
                p: "p-4"
              }}
            >
              <Element
                canvas
                id={`mobile-nav-title`}
                is={Text}
                custom={{ displayName: "Mobile Nav Title" }}
                canDelete={false}
                canEditName={false}
                text="Menu"
                mobile={{
                  fontSize: "text-lg",
                  fontWeight: "font-semibold"
                }}
              />

              <Element
                canvas
                id={`mobile-nav-close`}
                is={Button}
                custom={{ displayName: "Mobile Nav Close" }}
                canDelete={false}
                canEditName={false}
                clickType="click"
                clickDirection="hide"
                clickValue={`mobile-nav-${id}`}
                text="×"
                url=""
                root={{
                  background: "bg-transparent",
                  border: "border-0"
                }}
                mobile={{
                  p: "p-2",
                  fontSize: "text-xl",
                  fontWeight: "font-bold"
                }}
              />
            </Element>

            {/* Mobile Nav Content */}
            <Element
              canvas
              id={`mobile-nav-content`}
              is={Container}
              custom={{ displayName: "Mobile Nav Content" }}
              canDelete={false}
              canEditName={false}
              root={{}}
              mobile={{
                flexGrow: "flex-1",
                overflow: "overflow-y-auto",
                p: "p-4"
              }}
            >
              <Element
                canvas
                id={`mobile-nav-items`}
                is={ButtonList}
                custom={{ displayName: "Mobile Nav Items" }}
                canDelete={false}
                canEditName={false}
                root={{
                  background: "bg-transparent",
                  border: "border-0",
                  color: "text-gray-700",
                  radius: "rounded-md"
                }}
                mobile={{
                  display: "flex",
                  flexDirection: "flex-col",
                  gap: "space-y-2",
                  width: "w-full"
                }}
              >
                {props?.navItems?.map((navItem, index) => (
                  <Element
                    key={`mobile-nav-item-${index}`}
                    is={Button}
                    custom={{ displayName: navItem.text || `Mobile Nav Item ${index + 1}` }}
                    canDelete={true}
                    canEditName={true}
                    text={navItem.text}
                    url={navItem.url}
                    icon={navItem.icon}
                    iconOnly={navItem.iconOnly}
                    iconPosition={navItem.iconPosition || "left"}
                    clickType={props.clickType}
                    clickDirection={props.clickDirection}
                    clickValue={props.clickValue}
                    root={{
                      background: navItem.background || "bg-transparent",
                      color: navItem.color || "text-gray-700",
                      border: navItem.border || "border-0",
                      radius: "rounded-md",
                      ...navItem.root,
                    }}
                  />
                ))}
              </Element>
            </Element>
          </Element>

        </Element>
      )}
    </>
  );
};

Nav.craft = {
  displayName: "Nav",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: NavSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [

        <HoverNodeController
          key="nav2"
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
          key="nav3"
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
        <ToolNodeController
          position="left"
          align="middle"
          placement="middle"
          key="containercontroller2"
        >
          <ContainerSettingsTopNodeTool direction="vertical" />
        </ToolNodeController>
      ];

      return [...baseControls];
    },
  },
};
