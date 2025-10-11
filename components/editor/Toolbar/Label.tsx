import { useEditor, useNode } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";
import { TbTrash } from "react-icons/tb";
import { changeProp } from "../Viewport/lib";

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

  let bg = "bg-muted";
  let view = viewValue;

  if (viewValue === "mobile") {
    bg = "bg-secondary";
  }

  if (viewValue === "desktop") {
    bg = "bg-accent";
  }

  if (propType === "component" || propType === "root") {
    viewValue = "component";
    view = "component"; // Update view too!
    bg = "bg-primary";
  }

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Removing font:", {
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
            className={`flex w-[60px] items-center justify-center gap-1.5 truncate text-center text-[10px] ${bg} cursor-pointer rounded-md border border-border px-1 py-0 text-foreground hover:opacity-80`}
          >
            {icon ? (
              // If icon provided, show icon
              <span className="flex items-center">{icon}</span>
            ) : showDeleteIcon ? (
              // If showDeleteIcon is true, show delete icon
              <TbTrash className="size-3" />
            ) : (
              // Otherwise show text value
              <span className="truncate">
                {prefix}
                {lab}
                {suffix}
              </span>
            )}
          </div>
        </Tooltip>
      )}
    </div>
  );
};
