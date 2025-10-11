import { useEditor, useNode } from "@craftjs/core";
import { MediaInput } from "components/editor/Toolbar/Inputs/MediaInput";
import { atom } from "recoil";

export const SelectedImageAtom = atom({
  key: "selectedimage",
  default: 0,
});

export const ImageGroupTools = () => {
  const { actions, query } = useEditor();
  const { id } = useNode();

  return (
    <>
      <MediaInput propKey="videoId" typeKey="type" title="Image" />
    </>
  );
};

export default ImageGroupTools;
