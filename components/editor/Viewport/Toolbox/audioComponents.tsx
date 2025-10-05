import { TbMusic } from "react-icons/tb";
import { Audio } from "../../../selectors/Audio";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderAudioComponent = ({ text, ...props }) => (
  <RenderToolComponent element={Audio} type="save" display={text} {...props} />
);

export const AudioToolbox = {
  title: "Audio",

  content: [
    <RenderAudioComponent
      key="1"
      mobile={{
        width: "w-full",
        display: "flex",
      }}
      text={<ToolboxItemDisplay icon={TbMusic} label="Audio" />}
      custom={{ displayName: "Audio" }}
    />,
  ],
};

