import { Tooltip } from "components/layout/Tooltip";
import { TbClearAll, TbLayoutColumns, TbLayoutRows } from "react-icons/tb";
import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const FlexDirectionInput = ({ type = "radio", wrap = "" }) => (
  <ToolbarItem
    propKey="flexDirection"
    type={type}
    label=""
    cols={true}
    wrap={wrap}
    labelHide={true}
    options={[
      {
        label: (
          <Tooltip content="none">
            <TbClearAll />
          </Tooltip>
        ),
        value: "",
      },
      {
        label: (
          <Tooltip content="flex-row">
            <TbLayoutColumns />
          </Tooltip>
        ),
        value: "flex-row",
      },
      {
        label: (
          <Tooltip content="flex-col">
            <TbLayoutRows />
          </Tooltip>
        ),
        value: "flex-col",
      },
      {
        label: (
          <Tooltip content="flex-row-reverse">
            <TbLayoutColumns />
          </Tooltip>
        ),
        value: "flex-row-reverse",
      },
      {
        label: (
          <Tooltip content="flex-col-reverse">
            <TbLayoutRows />
          </Tooltip>
        ),
        value: "flex-col-reverse",
      },
    ]}
  >
    <option value="">None</option>
    {TailwindStyles.flex.map((_, k) => (
      <option key={_}>{_}</option>
    ))}
  </ToolbarItem>
);
