import { TbCode } from "react-icons/tb";
import { Embed } from "../../../selectors/Embed";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderEmbedComponent = ({ display, ...props }) => (
  <RenderToolComponent
    element={Embed}
    mobile={{ width: "w-full" }}
    display={display}
    {...props}
  />
);

export const EmbedToolbox = {
  title: "Embeds",
  content: [
    <RenderEmbedComponent
      key="1"
      display={<ToolboxItemDisplay icon={TbCode} label="Embedded Code" />}
      custom={{ displayName: "Embedded coded" }}
    />,
  ],
};
