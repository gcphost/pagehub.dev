import { TbInputSearch, TbSelect, TbTextCaption } from "react-icons/tb";
import { FormElement } from "../../../selectors/FormElement";
import { RenderToolComponent } from "./lib";

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
      text={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <TbTextCaption /> Textarea
          </div>
        </div>
      }
    />,
    <RenderFormElementComponent
      key="2"
      type="text"
      placeholder="Placeholder"
      name="text"
      root={{ color: "text-black", background: "bg-white" }}
      text={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <TbInputSearch /> Input
          </div>
        </div>
      }
    />,
    <RenderFormElementComponent
      key="2"
      type="text"
      placeholder="Placeholder"
      name="text"
      root={{ color: "text-black", background: "bg-white" }}
      text={
        <div className="flex flex-row gap-3 justify-between items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <div className="flex flex-row gap-3 items-center">
            <TbSelect /> Select
          </div>
        </div>
      }
    />,
  ],
};
