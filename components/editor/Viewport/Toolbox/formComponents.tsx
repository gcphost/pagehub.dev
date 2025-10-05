import { TbForms, TbMail } from "react-icons/tb";
import { Form } from "../../../selectors/Form";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderFormComponent = ({ text, formType, ...props }) => (
  <RenderToolComponent
    element={Form}
    type="save"
    formType={formType}
    display={<ToolboxItemDisplay icon={formType === "subscribe" ? TbMail : TbForms} label={text} />}
    {...props}
  />
);

export const FormToolbox = {
  title: "Forms",
  content: [
    <RenderFormComponent key="1" text="Subscribe Form" formType="subscribe" />,
    <RenderFormComponent key="2" text="Contact Form" formType="contact" />,
  ],
};
