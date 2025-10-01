import { useNode } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";
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
}: {
  lab?: string;
  prefix?: string;
  suffix?: string;
  viewValue?: string;
  propType?: string;
  propKey: string;
  index?: string;
  propItemKey?: string;
}) => {
  const {
    actions: { setProp },
  } = useNode();

  let bg = "bg-gray-500/50";

  const view = viewValue;

  if (viewValue === "mobile") {
    bg = "bg-green-500";
  }

  if (viewValue === "desktop") {
    bg = "bg-yellow-500";
  }

  if (propType === "component" || propType === "root") {
    viewValue = "component";
    bg = "bg-primary-300";
  }
  if (!lab) return null;

  return (
    <Tooltip
      content={`Remove ${lab} from ${viewValue}`}
      arrow={false}
      onClick={() => {
        changeProp({
          propKey,
          value: "",
          setProp,
          propType,
          view,
          index,
          propItemKey,
        });
      }}
    >
      <div
        className={`truncate text-[10px] max-w-[100px] ${bg} rounded-md px-3 py-1 border border-gray-900 text-black cursor-pointer hover:opacity-80 inside-shadow-light overflow-ellipsis ...`}
      >
        {prefix}
        {lab}
        {suffix}
      </div>
    </Tooltip>
  );
};
