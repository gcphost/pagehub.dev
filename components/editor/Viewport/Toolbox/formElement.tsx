import { TbAt, TbChevronDown, TbInputSearch, TbTextCaption } from "react-icons/tb";
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

// Base styles for all form elements
const formElementBaseStyles = {
  root: {
    border: 'border',
    borderColor: 'border-gray-300',
    radius: 'rounded-md',
    background: 'bg-white',
    color: 'text-gray-900',
  },
  mobile: {
    px: 'px-4',
    py: 'py-2',
    width: 'w-full',
  },
};

export const FormElementToolbox = {
  title: "Form Elements",
  content: [
    <RenderFormElementComponent
      key="1"
      type="textarea"
      placeholder="Enter your message..."
      name="message"
      {...formElementBaseStyles}
      text={<ToolboxItemDisplay icon={TbTextCaption} label="Textarea" />}
    />,
    <RenderFormElementComponent
      key="2"
      type="text"
      placeholder="Enter text..."
      name="text"
      {...formElementBaseStyles}
      text={<ToolboxItemDisplay icon={TbInputSearch} label="Input" />}
    />,
    <RenderFormElementComponent
      key="3"
      type="email"
      placeholder="your@email.com"
      name="email"
      {...formElementBaseStyles}
      text={<ToolboxItemDisplay icon={TbAt} label="Email" />}
    />,
    <RenderFormElementComponent
      key="4"
      type="select"
      placeholder="Choose an option..."
      name="select"
      {...formElementBaseStyles}
      text={<ToolboxItemDisplay icon={TbChevronDown} label="Select" />}
    />,
  ],
};
