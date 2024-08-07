import { useEditor, useNode, UserComponent } from "@craftjs/core";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import ButtonSettingsNodeTool from "components/editor/NodeControllers/Tools/ButtonSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import ClientIconLoader from "components/editor/Toolbar/Tools/ClientIconLoader";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import debounce from "lodash.debounce";
import Link from "next/link";
import React from "react";
import { TbRectangle } from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { applyBackgroundImage, motionIt, selectAfterAdding } from "utils/lib";
import {
  applyAnimation,
  ClassGene,
  ClassGenerator,
  CSStoObj,
} from "utils/tailwind";
import { BaseSelectorProps, BaseStyleProps, RootStyleProps } from "..";
import {
  hasInlay,
  RenderGradient,
  RenderPattern,
  useScrollToSelected,
} from "../lib";
import { ButtonSettings, SelectedButtonAtom } from "./ButtonSettings";

const EditableName = ({ but, ikey, enabled }) => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const view = useRecoilValue(ViewAtom);

  const buttons = getProp(
    { propKey: "buttons", propType: "component" },
    view,
    nodeProps
  );

  if (!enabled) return <span className="flex-1">{but.text}</span>;

  return (
    <span
      className="flex-1 cursor-text"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={debounce((e) => {
        const _buttons = [...buttons];
        _buttons[ikey] = { ..._buttons[ikey] };
        _buttons[ikey].text = e.target.innerText;

        changeProp({
          setProp,
          propKey: "buttons",
          propType: "component",
          value: _buttons,
        });
      }, 500)}
    >
      {but.text}
    </span>
  );
};

export const OnlyButtons = ({ children, ...props }) => {
  const {
    connectors: { connect },
  }: any = useNode();
  return (
    <div title="only-buttons" ref={connect} className="" {...props}>
      {children}
    </div>
  );
};

OnlyButtons.craft = {
  rules: {
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Button"),
  },
};

type ButtonArrayProp = {
  type?: string;
  text: string;
  icon?: string;
  url?: string;
  onClick?: any;
  background?: string;
  color?: string;
};

interface ButtonProp extends RootStyleProps, BaseStyleProps {}

interface ButtonProps extends BaseSelectorProps {
  flex?: string;
  text?: string;
  textComponent?: any;
  activeTab?: number;
  buttons?: ButtonArrayProp[];
  iconPosition?: string;
  iconSize?: string;
  iconFontSize?: string;
  iconColor?: string;
  iconGap?: string;
  iconShadow?: string;
  button?: ButtonProp;
  clickType?: string;
  clickValue?: string;
  clickDirection?: string;
}

const defaultProps: ButtonProps = {
  tablet: {},
  button: {},
  buttons: [],
  className: [],
  root: {},
  mobile: {},
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

  useScrollToSelected(id, enabled);
  selectAfterAdding(
    actions.selectNode,
    useSetRecoilState(TabAtom),
    id,
    enabled
  );

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const settings = useRecoilValue(SettingsAtom);
  const [selectedButton, setSelectedButton] =
    useRecoilState(SelectedButtonAtom);

  props = setClonedProps(props, query);

  const defaultProp: any = {
    ref: (r) => connect(drag(r)),
    style: props.root?.style ? CSStoObj(props.root.style) || {} : {},
    className: ClassGenerator(props, view, enabled),
  };

  if (enabled) {
    if (!props?.buttons?.length) defaultProp.children = <TbRectangle />;
    if (props?.root?.border || props.root?.borderColor || props.root?.radius) {
      defaultProp["data-border"] = true;
    }
    defaultProp["data-bounding-box"] = enabled;
    defaultProp["data-empty-state"] = !props?.buttons?.length;
  }

  if (!props?.buttons?.length) {
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
  return (
    <div
      ref={(r: any) => connect(drag(r))}
      className={[
        ...ClassGenerator({ ...props }, view, enabled, [], baseProps).split(
          " "
        ),
        ...mainClasses,
      ]
        .filter((_) => _)
        .join(" ")}
    >
      {props?.buttons?.map((but, key) => {
        const include = [
          but?.background || props.root?.background,
          but?.color || props.root.color,
          props?.mobile?.width,
          props?.desktop?.width ? `md:${props.desktop.width}` : null,
          props.iconGap,
          "overflow-hidden",
          "flex",
          "items-center",
        ];

        const butClass = [
          props.iconSize
            ? `${props.iconSize} h-${props.iconSize.split("w-")[1]}`
            : "w-6 h-6",
          props.iconColor,
          props.iconShadow,
          "flex",
          "items-center",
        ];

        const className = [
          ...ClassGene(props.button, [], []),
          ...ClassGenerator(
            { ...props },
            view,
            enabled,
            inlayed ? [...inlayProps, ...baseProps] : baseProps,
            []
          ).split(" "),
          ...include,
        ]
          .filter((_) => _)
          .join(" ");

        let prop: any = {};

        let ele = but.url && typeof but.url === "string" ? Link : "button";

        if (but.url && typeof but.url === "string") {
          prop.href = but.url;
        }

        if (enabled && ele === Link) ele = "span";

        const element: any = motionIt(props, ele);

        prop = {
          ...prop,
          key,
          type: but.type || "",
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
              setSelectedButton(key);
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
          // style: {},
          className,
          children: (
            <RenderPattern
              props={props}
              settings={settings}
              view={view}
              enabled={enabled}
              properties={{}}
              preview={preview}
            >
              <RenderGradient
                props={props}
                view={view}
                enabled={enabled}
                properties={inlayProps}
                preview={preview}
              >
                {but.icon && props.iconPosition === "left" && (
                  <span className={butClass.join(" ")}>
                    <ClientIconLoader value={but.icon} />
                  </span>
                )}

                <EditableName but={but} ikey={key} enabled={enabled} />

                {but.icon && props.iconPosition === "right" && (
                  <span className={butClass.join(" ")}>
                    <ClientIconLoader value={but.icon} />
                  </span>
                )}
              </RenderGradient>
            </RenderPattern>
          ),
        };

        prop = {
          ...applyAnimation(prop, props),
        };

        return React.createElement(element, prop);
      })}
    </div>
  );
};

Button.craft = {
  displayName: "Button",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: ButtonSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController
          position="top"
          align="end"
          placement="start"
          key="buttonNameController"
        />,
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

        <ToolNodeController
          position="bottom"
          align="start"
          key="buttonSettingsController"
        >
          <ButtonSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
