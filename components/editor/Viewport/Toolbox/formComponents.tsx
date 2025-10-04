import { TbForms } from "react-icons/tb";
import { Form } from "../../../selectors/Form";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderFormComponent = ({ text }) => (
  <RenderToolComponent
    element={Form}
    type="save"
    display={<ToolboxItemDisplay icon={TbForms} label={text} />}
  />
);

export const FormToolbox = {
  title: "Forms",
  content: [
    <RenderFormComponent key="1" text="Subscribe" />,
    <RenderFormComponent key="2" text="Contact" />,
  ],
};
