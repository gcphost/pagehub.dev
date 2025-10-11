// Backwards compatibility stub for deprecated ImageGallery
// Converts old ImageGallery to ImageList
import { UserComponent } from "@craftjs/core";
import { ImageList } from "../ImageList";

export const ImageGallery: UserComponent = (props: any) => {
  return <ImageList {...props} />;
};

ImageGallery.craft = {
  displayName: "Image Gallery (Legacy)",
  props: {},
};
