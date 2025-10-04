import { TbVideo } from "react-icons/tb";
import { Video } from "../../../selectors/Video";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderVideoComponent = ({ text, ...props }) => (
  <RenderToolComponent element={Video} type="save" display={text} {...props} />
);

export const VideoToolbox = {
  title: "Videos",

  content: [
    <RenderVideoComponent
      key="1"
      mobile={{
        width: "w-full",
        height: "h-full",
        display: "flex",
        overflow: "overflow-hidden",
      }}
      text={<ToolboxItemDisplay icon={TbVideo} label="Youtube Video" />}
      custom={{ displayName: "Youtube Video" }}
    />,
  ],
};
