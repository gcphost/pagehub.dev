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

// Base styles for all form elements - using style guide
const formElementBaseStyles = {
  root: {
    border: 'border',
    borderWidth: 'border-[var(--ph-input-border-width)]',
    borderStyle: 'border-solid',
    borderColor: 'border-[color:var(--ph-input-border-color)]',
    radius: 'rounded-[var(--ph-input-border-radius)]',
    background: 'bg-[var(--ph-input-bg-color)]',
    color: 'text-[color:var(--ph-input-text-color)]',
    placeholderColor: ':text-[color:var(--ph-input-placeholder-color)]',
    focus: {
      ring: 'focus:ring-[var(--ph-input-focus-ring)]',
      ringColor: 'focus:ring-[color:var(--ph-input-focus-ring-color)]',
      outline: 'focus:outline-none',
    },
  },
  mobile: {
    p: 'p-[var(--ph-input-padding)]',
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
