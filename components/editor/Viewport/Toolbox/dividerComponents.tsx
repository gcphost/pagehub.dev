import { HiOutlineMinus } from "react-icons/hi";

import { Divider } from "../../../selectors/Divider";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderDividerComponent = ({ text, ...props }) => (
  <RenderToolComponent element={Divider} display={text} {...props} />
);

export const DividerToolbox = {
  title: "Dividers",
  content: [
    <RenderDividerComponent
      root={{ background: "bg-current", border: "border-0" }}
      mobile={{ height: "h-2", py: "my-3", width: "w-full" }}
      key="1"
      text={<ToolboxItemDisplay icon={HiOutlineMinus} label="Line Divider" />}
    />,
  ],
};
