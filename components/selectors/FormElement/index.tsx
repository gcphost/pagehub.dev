import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import { ToolNodeController } from "components/editor/NodeControllers/ToolNodeController";
import TextSettingsNodeTool from "components/editor/NodeControllers/Tools/TextSettingsNodeTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";

import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { usePalette } from "utils/PaletteContext";
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
  "select",
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
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  cols?: number;
  min?: string;
  max?: string;
  step?: string;
  pattern?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  invalid?: boolean;
}

const defaultProps: FormElementProps = {
  root: {
    border: 'style:inputBorderWidth',
    borderColor: 'border-style:inputBorderColor',
    radius: 'style:inputBorderRadius',
    background: 'bg-style:inputBgColor',
    color: 'text-style:inputTextColor',
    placeholderColor: 'placeholder-style:inputPlaceholderColor',
    focus: {
      ring: 'style:inputFocusRing',
      ringColor: 'ring-style:inputFocusRingColor',
      outline: 'outline-none',
    },
  },
  mobile: {
    p: 'style:inputPadding',
    width: 'w-full',
  },
  tablet: {},
  desktop: {},
  canDelete: true,
  type: "",
  placeholder: "",
  name: "",
  required: false,
  disabled: false,
  readOnly: false,
  rows: 4,
  cols: 50,
  min: "",
  max: "",
  step: "",
  pattern: "",
  options: [],
} as any;

export const FormElement = (props: Partial<FormElementProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  props = setClonedProps(props, query);

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const palette = usePalette();

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const prop: any = {
    ref: (r) => connect(drag(r)),
    className: ClassGenerator(props, view, enabled, [], [], preview, false, palette, query),
    type: props.type,
    placeholder: props.placeholder,
    name: props.name,
    disabled: props.disabled,
    readOnly: props.readOnly,
    rows: props.rows,
    cols: props.cols,
    min: props.min,
    max: props.max,
    step: props.step,
    pattern: props.pattern,
    defaultValue: "", // Add defaultValue to make it uncontrolled
    "aria-label": props.placeholder || props.name || `${props.type || 'text'} input`,
    ...(props.type === "email" && { "aria-describedby": "email-desc" }),
    ...(props.type === "tel" && { "aria-describedby": "tel-desc" }),
    ...(props.type === "url" && { "aria-describedby": "url-desc" }),
  };

  // Add required attribute for better accessibility if needed
  if (props.required) {
    prop["aria-required"] = "true";
    prop["required"] = true;
  }

  // Add invalid state support
  if (props.invalid) {
    prop["aria-invalid"] = "true";
  }

  prop["data-border"] = !!(props.root?.border || props.root?.borderColor);

  if (enabled) {
    // if (!text) prop["children"] = <BsInputCursorText />;
    prop["data-bounding-box"] = enabled;
    // prop["data-empty-state"] = !text;
    prop["node-id"] = id;
  }

  const tagName = prop.type === "textarea" ? "textarea" : prop.type === "select" ? "select" : "input";

  // If in edit mode and mounted, wrap in a container with inline tools
  // Input elements are void elements and can't have children
  if (enabled && isMounted) {
    // Remove ref from prop since we'll apply it to the wrapper instead
    const { ref: _, ...formElementProp } = prop;

    // For select elements, add options as children
    let children = undefined;
    if (tagName === "select" && props.options) {
      children = props.options.map((option, index) =>
        React.createElement("option", {
          key: index,
          value: option.value,
          disabled: option.disabled
        }, option.label)
      );
    }

    const formElement = React.createElement(
      motionIt(props, tagName),
      applyAnimation({ ...formElementProp, key: `formelement-${id}-${tagName}`, children }, props)
    );

    const containerProp: any = {
      ref: (r) => connect(drag(r)),
      style: {

        display: 'inline-block', // Maintain inline nature of form elements
        width: '100%', // Take full width like the input would
      },
      "data-bounding-box": enabled,
      "data-empty-state": false,
      "node-id": id,
    };

    return (
      <div {...containerProp}>
        {formElement}
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={FormElement} props={props} />
      </div>
    );
  }

  // Create the form element with ref for preview mode
  // For select elements, add options as children
  let children = undefined;
  if (tagName === "select" && props.options) {
    children = props.options.map((option, index) =>
      React.createElement("option", {
        key: index,
        value: option.value,
        disabled: option.disabled
      }, option.label)
    );
  }

  const formElement = React.createElement(
    motionIt(props, tagName),
    applyAnimation({ ...prop, key: `${id}-${tagName}`, children }, props)
  );

  return formElement;
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
        <NameNodeController
          position="top"
          align="end"
          placement="end"
          key="formElementNameController"
        />,
        <HoverNodeController
          key="formElementHoverController"
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
          key="formElementSettingsController"
        >
          <TextSettingsNodeTool />
        </ToolNodeController>,
      ];

      return [...baseControls];
    },
  },
};
