import { RiImageAddLine } from "react-icons/ri";
import { TbListNumbers } from "react-icons/tb";
import { Image } from "../../../selectors/Image";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";
import { RenderSectionComponent } from "./sectionComponents";

export const RenderImageComponent = ({ text = "", display, ...props }) => (
  <RenderToolComponent
    element={Image}
    type="cdn"
    display={display}
    text={text}
    {...props}
  />
);

export const ListToolbox = {
  title: "Lists",
  content: [
    <RenderImageComponent
      key="1"
      mobile={{
        objectFit: "object-cover",
        minHeight: "min-h-[120px]",
        height: "h-96",
        width: "w-full",
        display: "flex",
        overflow: "overflow-hidden",
      }}
      desktop={{ height: "h-auto" }}
      display={<ToolboxItemDisplay icon={TbListNumbers} label="Item List" />}
      custom={{ displayName: "Inline Image" }}
    />,
    <RenderSectionComponent
      key="image1"
      display={<ToolboxItemDisplay icon={RiImageAddLine} label="Background Image" />}
      mobile={{
        display: "flex",
        minHeight: "min-h-[120px]",
        justifyContent: "justify-center",
        flexDirection: "flex-col",
        width: "w-full",
        gap: "gap-8",
        backgroundSize: "bg-cover",
        backgroundPosition: "bg-center",
        alignItems: "items-center",
        height: "h-96",
      }}
      desktop={{ flexDirection: "flex-row", height: "h-full" }}
      type="imageContainer"
      custom={{ displayName: "Image Background" }}
    />,
  ],
};
