import { useEditor, useNode } from "@craftjs/core";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React from "react";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { applyAnimation, ClassGenerator } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { FormElementSettings } from "./FormElementSettings";

export const inputTypes = [
  "text",
  "textarea",
  "email",
  "password",
  "url",
  "tel",
  "date",
  "datetime-local",
  "radio",
  "checkbox",
  "reset",
  "hidden",
  "color",
  "month",
  "number",
  "range",
  "search",
  "time",
  "week",
];

export const OnlyFormElement = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
    id,
  }: any = useNode();
  return (
    <div
      title="only-FormElement"
      ref={connect}
      className="w-full mt-5"
      {...props}
    >
      {children}
    </div>
  );
};

OnlyFormElement.craft = {
  rules: {
    canMoveIn: (nodes) =>
      nodes.every((node) => node.data?.name === "FormElement"),
  },
};

export interface FormElementProps extends BaseSelectorProps {
  text?: string;
  tagName?: string;
  activeTab?: number;
  type?: string;
  placeholder?: string;
  name?: string;
}

const defaultProps: FormElementProps = {
  root: {},
  tablet: {},
  mobile: {},
  desktop: {},
  canDelete: true,
  type: "",
  placeholder: "",
  name: "",
};

export const FormElement = (props: Partial<FormElementProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  props = setClonedProps(props, query);

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { tagName } = props;

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const prop = {
    ref: (r) => connect(drag(r)),
    className: ClassGenerator(props, view, enabled, [], [], preview),
    type: props.type,
    placeholder: props.placeholder,
    name: props.name,
  };

  prop["data-border"] = !!(props.root?.border || props.root?.borderColor);

  if (enabled) {
    // if (!text) prop["children"] = <BsInputCursorText />;
    prop["data-bounding-box"] = enabled;
    // prop["data-empty-state"] = !text;
    prop["node-id"] = id;
  }

  return React.createElement(
    motionIt(props, prop.type === "textarea" ? "textarea" : "input"),
    applyAnimation({ ...prop, key: id }, props)
  );
};

FormElement.craft = {
  displayName: "Form Item",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: FormElementSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <NameNodeController position="top" align="end" placement="end" />,
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
          children={<TextSettingsNodeTool />}
        />,
      ];

      return [...baseControls];
    },
  },
};
