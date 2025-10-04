import { TbInputSearch, TbSelect, TbTextCaption } from "react-icons/tb";
import { FormElement } from "../../../selectors/FormElement";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderFormElementComponent = ({ text, ...props }) => (
  <RenderToolComponent
    element={FormElement}
    type="save"
    text=""
    display={text}
    {...props}
  />
);

export const FormElementToolbox = {
  title: "Form Elements",
  content: [
    <RenderFormElementComponent
      key="1"
      type="text"
      placeholder="Placeholder"
      name="text"
      root={{ color: "text-black", background: "bg-white" }}
      text={<ToolboxItemDisplay icon={TbTextCaption} label="Textarea" />}
    />,
    <RenderFormElementComponent
      key="2"
      type="text"
      placeholder="Placeholder"
      name="text"
      root={{ color: "text-black", background: "bg-white" }}
      text={<ToolboxItemDisplay icon={TbInputSearch} label="Input" />}
    />,
    <RenderFormElementComponent
      key="3"
      type="text"
      placeholder="Placeholder"
      name="text"
      root={{ color: "text-black", background: "bg-white" }}
      text={<ToolboxItemDisplay icon={TbSelect} label="Select" />}
    />,
  ],
};
