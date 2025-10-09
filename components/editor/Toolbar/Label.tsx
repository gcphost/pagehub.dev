import { useEditor, useNode } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";
import { TbTrash } from "react-icons/tb";
import { changeProp } from "../Viewport/lib";
import { DesignVarSelector } from "./Inputs/DesignVarSelector";

export const ToolbarLabel = ({
  lab,
  prefix,
  suffix,
  viewValue = "mobile",
  propType = "class",
  propKey,
  index = null,
  propItemKey = null,
  icon = null,
  showDeleteIcon = false,
  showVarSelector = false,
  varSelectorPrefix = "",
}: {
  lab?: string;
  prefix?: string;
  suffix?: string;
  viewValue?: string;
  propType?: string;
  propKey: string;
  index?: string;
  propItemKey?: string;
  icon?: React.ReactNode;
  showDeleteIcon?: boolean;
  showVarSelector?: boolean;
  varSelectorPrefix?: string;
}) => {
  const {
    actions: { setProp },
    id,
  } = useNode((node) => ({
    id: node.id,
  }));

  const { query, actions } = useEditor();

  let bg = "bg-gray-500/50";
  let view = viewValue;

  if (viewValue === "mobile") {
    bg = "bg-green-500";
  }

  if (viewValue === "desktop") {
    bg = "bg-yellow-500";
  }

  if (propType === "component" || propType === "root") {
    viewValue = "component";
    view = "component"; // Update view too!
    bg = "bg-primary-300";
  }

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Removing font:', {
      propKey,
      propType,
      view,
      currentValue: lab,
    });

    changeProp({
      propKey,
      value: null, // Use null instead of empty string for root props
      setProp,
      propType,
      view,
      index,
      propItemKey,
      query,
      actions,
      nodeId: id,
    });
  };

  // If no label and no var selector, don't render anything
  if (!lab && !showDeleteIcon && !showVarSelector) return null;

  return (
    <div className="flex items-center gap-1.5">
      {/* Only show label badge if there's a value */}
      {lab && (
        <Tooltip
          content={`Remove ${lab} from ${viewValue}`}
          arrow={false}
          onClick={(e) => handleRemove(e)}
        >
          <div
            className={`flex items-center gap-1.5 truncate text-[10px] max-w-[100px] ${bg} rounded-md px-2 py-1 border border-gray-900 text-black cursor-pointer hover:opacity-80 inside-shadow-light overflow-ellipsis ...`}
          >
            {icon ? (
              // If icon provided, show icon
              <span className="flex items-center">{icon}</span>
            ) : showDeleteIcon ? (
              // If showDeleteIcon is true, show delete icon
              <TbTrash className="w-3 h-3" />
            ) : (
              // Otherwise show text value
              <>
                {prefix}
                {lab}
                {suffix}
              </>
            )}
          </div>
        </Tooltip>
      )}

      {/* Design Variable Selector - always show if enabled */}
      {showVarSelector && (
        <DesignVarSelector
          propKey={propKey}
          propType={propType}
          viewValue={viewValue}
          prefix={varSelectorPrefix}
        />
      )}
    </div>
  );
};
