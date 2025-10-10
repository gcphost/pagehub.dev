import { Tooltip } from "components/layout/Tooltip";
import { TbInfoCircle } from "react-icons/tb";
import { ToolbarLabel } from "./Label";

export const BgWrap = ({ children, className = "", wrap = null }) => {
  if (wrap) {
    return children;
  }
  return (
    <div
      className={`input-wrapper   ${className || " input-hover"
        }`}
    >
      {children}
    </div>
  );
};

const Labler = ({
  props,
  lab,
  viewValue = "mobile",
  propType = "class",
  propKey,
  index = null,
  propItemKey = null,
  wrap = null,
}) => {
  if ((!props?.label && props?.labelHide) || wrap) return null;

  return (
    <h4
      className={`toolbar-label ${lab ? "my-1" : "mb-1"
        } gap-3 flex justify-between`}
    >
      <div className="flex gap-1.5 items-center">
        {props?.label}
        <div className="text-gray-500 hover:text-white hidden">
          <TbInfoCircle />
        </div>
      </div>

      {!props?.labelHide && (
        <ToolbarLabel
          lab={lab}
          prefix={props?.labelPrefix}
          suffix={props?.labelSuffix}
          viewValue={viewValue}
          propType={propType}
          propKey={propKey}
          index={index}
          propItemKey={propItemKey}
          icon={props?.labelIcon}
          showDeleteIcon={props?.showDeleteIcon}
          showVarSelector={props?.showVarSelector}
          varSelectorPrefix={props?.varSelectorPrefix}
        />
      )}
    </h4>
  );
};

export const Wrap = ({
  children,
  props,
  lab = "",
  viewValue = "mobile",
  propType = "class",
  propKey = "",
  index = null,
  propItemKey = null,
  wrap = null,
  inline = false,
  inputWidth = "",
  labelWidth = "",
  className = "",
}) => {
  if (inline) {
    // Inline mode: everything in one row
    // In inline mode, always show label if it exists (ignore labelHide for the label text)
    return (
      <div className={`w-full flex items-center gap-2 ${className}`}>
        {props?.label && (
          <span className={`text-xs whitespace-nowrap ${labelWidth || "w-20"} truncate`}>{props?.label}</span>
        )}
        <div className={inputWidth || "flex-1"}>
          {children}
        </div>

        <ToolbarLabel
          lab={lab}
          prefix={props?.labelPrefix}
          suffix={props?.labelSuffix}
          viewValue={viewValue}
          propType={propType}
          propKey={propKey}
          index={index}
          propItemKey={propItemKey}
          icon={props?.labelIcon}
          showDeleteIcon={props?.showDeleteIcon}
          showVarSelector={props?.showVarSelector}
          varSelectorPrefix={props?.varSelectorPrefix}
        />
      </div>
    );
  }

  // Default mode: 2 rows
  return (
    <div className="w-full">
      <Labler
        props={props}
        lab={lab}
        viewValue={viewValue}
        propType={propType}
        propKey={propKey}
        index={index}
        propItemKey={propItemKey}
        wrap={wrap}
      />
      {children}
    </div>
  );
};

export const Card = ({
  value,
  onClick,
  bgColor = "bg-primary-300 inside-shadow",
}) => {
  if (!value) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Copy to clipboard on left-click
    navigator.clipboard.writeText(value).then(() => {
      console.log(`Copied to clipboard: ${value}`);
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Delete on right-click
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`${bgColor} text-gray-800 hover:opacity-80 hover:text-gray-700 text-xs font-medium mr-2 p-1 rounded inline-flex cursor-pointer whitespace-nowrap`}
    >
      <Tooltip content={`Left-click: Copy | Right-click: Remove`} placement="bottom" arrow={false}>
        {value}
      </Tooltip>
    </button>
  );
};

export const CardLight = ({ value, onClick }) => {
  if (!value) {
    return null;
  }
  return (
    <button
      onClick={onClick}
      className="bg-white text-gray-800 text-xs font-medium mr-2 p-1 rounded inline-flex cursor-pointer"
    >
      <Tooltip content={`Add ${value}`} placement="top" arrow={false}>
        {value}
      </Tooltip>
    </button>
  );
};

export const Accord = ({
  prop,
  accordion,
  setAccordion,
  title,
  children,
  className = "",
  buttons = [],
}) => {
  const active = accordion === prop;

  return (
    <div className={className}>
      <div className="flex gap-2 px-3 py-1.5 bg-primary-800">
        <button
          className="whitespace-nowrap font-2xl font-bold cursor-pointer truncate pr-3 w-full"
          onClick={() => setAccordion(active ? "" : prop)}
        >
          {title}
        </button>
        {buttons.map((_, k) => (
          <span key={k}>{_}</span>
        ))}
      </div>
      {active && <div className="">{children}</div>}
    </div>
  );
};

export type ToolbarItemProps = {
  label?: string;
  labelPrefix?: string;
  labelSuffix?: string;
  labelHide?: boolean;
  full?: boolean;
  propKey?: string;
  index?: number;
  children?: React.ReactNode;
  type: string;
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
};
