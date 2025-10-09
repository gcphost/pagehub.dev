import { useEditor, useNode } from "@craftjs/core";
import React from "react";
import { useRecoilValue } from "recoil";
import { ViewAtom } from "../Viewport";
import { changeProp, getPropFinalValue } from "../Viewport/lib";
import { QullInput } from "./Quill";

import { ToolbarDropdown } from "./ToolbarDropdown";
import { BgWrap, Wrap } from "./ToolbarStyle";

const Input = (__props, ref) => {
  const {
    props,
    propKey,
    type,
    value = "",
    changed,
    index,
    propTag = "",
    propType = "class",
    wrap = null,
  } = __props;

  if (type === "toggle") {
    return (
      <BgWrap wrap={wrap}>
        <label className="relative flex flex-col items-center cursor-pointer">
          {props.option && <div className="text-sm mb-3 font-medium text-white text-center">
            {props.option ? props.option : "Enable"}
          </div>}

          <div className="relative inline-flex">
            <input
              type="checkbox"
              defaultChecked={!!value}
              onChange={() => changed(value ? "" : props.on)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </div>
        </label>
      </BgWrap>
    );
  }

  if (type === "checkbox") {
    return (
      <BgWrap wrap={wrap}>
        <label className="relative flex flex-col items-center cursor-pointer">
          {props.option && <div className="text-sm mb-3 font-medium text-white text-center">
            {props.option ? props.option : "Enable"}
          </div>}

          <div className="relative inline-flex">
            <input
              type="checkbox"
              defaultChecked={!!value}
              onChange={() => changed(value ? "" : props.on)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </div>
        </label>
      </BgWrap>
    );
  }

  if (type === "number") {
    return (
      <input
        type="number"
        id={`input-${props.label || index}`}
        defaultValue={value}
        onChange={(event) => changed(event.target.value)}
        className="input"
        aria-label={props.label || propKey || "Number input"}
      />
    );
  }

  if (["custom"].includes(type)) {
    const str = value;
    const regex = /\[([^\]]?)\]/;
    const match = regex.exec(str);

    return (
      <input
        type="number"
        min="0"
        id={`input-${props.label || index}`}
        placeholder={props.placeholder}
        defaultValue={match?.length ? match[0] : null}
        onChange={(event) => changed(`${propTag}-[${event.target.value}px]`)}
        className="input"
        aria-label={props.label || props.placeholder || propKey || "Custom value"}
      />
    );
  }

  if (["url", "text", "email", "number"].includes(type)) {
    return (
      <input
        type={type}
        id={`input-${props.label || index}`}
        placeholder={props.placeholder}
        defaultValue={value}
        onChange={(event) => changed(event.target.value)}
        className="input"
        aria-label={props.label || props.placeholder || propKey || `${type} input`}
      />
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        id={`input-${props.label || index}`}
        defaultValue={value}
        onChange={(event) => changed(event.target.value)}
        rows={props.rows || 4}
        placeholder={props.placeholder}
        className="input"
        aria-label={props.label || props.placeholder || propKey || "Text area"}
      />
    );
  }

  if (type === "quill") {
    return <QullInput value={value} changed={changed} props={props} />;
  }

  if (type === "slider") {
    // Find the current index in valueLabels, or use value as index, default to 0
    let currentValue = 0;
    if (props?.valueLabels) {
      const index = props.valueLabels.indexOf(value);
      currentValue = index >= 0 ? index : (Number.isFinite(Number(value)) ? Number(value) : 0);
    } else {
      currentValue = Number(value) || 0;
    }

    return (
      <BgWrap wrap={wrap}>
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={props.min || 0}
          max={props.max || 100}
          step={props.step || 1}
          defaultValue={currentValue}
          onChange={(event) => {
            changed(
              props?.valueLabels
                ? props?.valueLabels[event.target.value]
                : event.target.value
            );
          }}
          aria-label={props.label || propKey || "Slider"}
          aria-valuemin={props.min || 0}
          aria-valuemax={props.max || 100}
          aria-valuenow={currentValue}
          aria-valuetext={value?.toString() || currentValue.toString()}
        />
      </BgWrap>
    );
  }

  if (type === "select") {
    return (
      <ToolbarDropdown
        wrap={wrap}
        value={value || ""}
        onChange={(value) => changed(value)}
        {...props}
      />
    );
  }

  if (type === "radio") {
    return (
      <BgWrap wrap={wrap}>
        <div
          className={`flex justify-center items-center p-1 gap-3 ${!props.cols ? "flex-col" : "flex-row"
            }`}
        >
          {props?.options?.map((_, key) => {
            const checked = value === _.value;
            return (
              <div key={key} className="flex items-center">
                <input
                  id={`radio-${propKey}-${key}`}
                  type="radio"
                  name={propKey}
                  defaultChecked={checked}
                  onClick={() => changed(_.value)}
                  className="hidden"
                  aria-label={_.value}
                />
                <label
                  htmlFor={`radio-${propKey}-${key}`}
                  className={`block text-sm font-medium text-current cursor-pointer input-hover hover:text-white ${checked ? "font-bold " : "text-gray-400"
                    }`}
                >
                  {_.label}
                </label>
              </div>
            );
          })}
        </div>
      </BgWrap>
    );
  }

  if (type === "toggleNext") {
    const checked = value;
    const opt = props?.options;
    const options = [];

    options.push(
      !value ? opt[0] : opt.find((_) => _.value === value) || opt[0]
    );

    return (
      <BgWrap wrap={wrap}>
        <div
          className={`flex justify-center items-center p-1 gap-3 ${!props.cols ? "flex-col" : "flex-row"
            }`}
        >
          {options?.map((_, key) => (
            <div key={key} className="flex items-center">
              <input
                id={`radio-${propKey}-${key}`}
                type="radio"
                name={propKey}
                defaultChecked={checked}
                onClick={() => {
                  // find next value..
                  const me = opt.find((_) => _.value === value);
                  const index = opt.indexOf(me);
                  const next = index < opt.length - 1 ? opt[index + 1] : opt[0];

                  changed(next.value);
                }}
                className="hidden"
                aria-label={_.value}
              />
              <label
                htmlFor={`radio-${propKey}-${key}`}
                className={`block text-sm font-medium text-current cursor-pointer input-hover hover:text-white ${checked ? "font-bold " : "text-gray-400"
                  }`}
              >
                {_.label}
              </label>
            </div>
          ))}
        </div>
      </BgWrap>
    );
  }
};

export type ToolbarItemProps = {
  label?: string;
  labelPrefix?: string;
  labelSuffix?: string;
  labelHide?: boolean;
  labelIcon?: React.ReactNode;
  showDeleteIcon?: boolean;
  showVarSelector?: boolean;
  varSelectorPrefix?: string;
  full?: boolean;
  propKey?: string;
  propItem?: any;
  propTag?: string;
  propItemKey?: string;
  index?: any;
  children?: React.ReactNode;
  type?: string;
  valueLabels?: any;
  max?: number;
  min?: number;
  step?: number;
  onChange?: (value: any) => any;
  class?: string;
  on?: any;
  option?: string;
  rows?: number;
  placeholder?: string;
  options?: any;
  cols?: boolean;
  propType?: string;
  wrap?: string;
  inline?: boolean;
};

export const ToolbarItem = (__props: ToolbarItemProps) => {
  const {
    full = 1,
    propKey,
    propItem,
    propType = "class",
    propItemKey,
    type,
    onChange = null,
    index = null,
    propTag = "",
    wrap = "",
    inline = false,
    ...props
  } = __props;

  const view = useRecoilValue(ViewAtom);

  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
  }));

  const { query, actions } = useEditor();

  const { value, viewValue } = getPropFinalValue(__props, view, nodeProps);

  const changed = (value) => {
    changeProp({
      propKey,
      value,
      setProp,
      view,
      index,
      onChange,
      propType,
      propItemKey,
      query,
      actions,
      nodeId: id,
    });
  };

  // Get the label: if value is an index, use valueLabels[index], 
  // if value is a string in valueLabels array, use it directly,
  // otherwise fallback to the value itself
  let label = value;
  if (props.valueLabels) {
    const valueIndex = props.valueLabels.indexOf(value);
    if (valueIndex >= 0) {
      // Value is already in the array, use it
      label = value;
    } else if (Number.isFinite(Number(value)) && props.valueLabels[Number(value)]) {
      // Value is an index number
      label = props.valueLabels[Number(value)];
    }
  }

  return (
    <Wrap
      props={props}
      lab={label}
      viewValue={viewValue}
      propType={propType}
      propKey={propKey}
      index={index}
      propItemKey={propItemKey}
      wrap={wrap}
      inline={inline}
    >
      <Input
        props={props}
        propKey={propKey}
        propTag={propTag}
        propType={propType}
        type={type}
        value={value}
        changed={changed}
        index={index}
        wrap={wrap}
      />
    </Wrap>
  );
};
