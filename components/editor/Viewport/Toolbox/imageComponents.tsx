import { RiImageAddLine } from "react-icons/ri";
import { TbPhoto, TbPhotoScan } from "react-icons/tb";
import { Image } from "../../../selectors/Image";
import { ImageList } from "../../../selectors/ImageList";
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

export const ImageToolbox = {
  title: "Images",
  content: [
    <RenderImageComponent
      key="image1"
      mobile={{
        objectFit: "object-cover",

        display: "flex",
        overflow: "overflow-hidden",
      }}
      desktop={{ height: "h-auto" }}
      display={<ToolboxItemDisplay icon={TbPhoto} label="Inline Image" />}
      custom={{ displayName: "Inline Image" }}
    />,
    <RenderToolComponent
      key="imageList"
      element={ImageList}
      mobile={{
        width: "w-full",
        p: "p-4",
        flexDirection: "flex-row",
        gap: "gap-4",
      }}
      display={<ToolboxItemDisplay icon={TbPhotoScan} label="Image Gallery" />}
      custom={{ displayName: "Image List" }}
    />,
    <RenderSectionComponent
      key="image2"
      text={<ToolboxItemDisplay icon={RiImageAddLine} label="Background Image" />}
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
      custom={{ displayName: "Background Image" }}
    />,
  ],
};
