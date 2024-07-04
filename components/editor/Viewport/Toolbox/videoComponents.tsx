import { TbVideo } from "react-icons/tb";
import { Video } from "../../../selectors/Video";
import { RenderToolComponent } from "./lib";

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
      text={
        <div className="flex flex-row gap-3 items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <TbVideo /> Youtube Video
        </div>
      }
      custom={{ displayName: "Youtube Video" }}
    />,
  ],
};
