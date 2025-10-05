import { TbLayoutColumns, TbLayoutRows } from "react-icons/tb";
import { Container } from "../../../selectors/Container";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

export const RenderSectionComponent = ({
  text = <></>,
  display = <></>,
  ...props
}) => (
  <RenderToolComponent
    element={Container}
    renderer={text || display}
    {...props}
  />
);


export const sectionToolboxItems = [
  {
    title: "Layout",
    content: [
      <RenderSectionComponent
        key="row1"
        text={<ToolboxItemDisplay icon={TbLayoutRows} label="Row" />}
        mobile={{
          display: "flex",
          justifyContent: "justify-center",
          flexDirection: "flex-row",
          width: "w-full",
          gap: "gap-8",
          height: "h-auto",
          py: "py-6",
          px: "px-3",
        }}
        desktop={{}}
        custom={{ displayName: "Row" }}
      />,

      <RenderSectionComponent
        key="col"
        text={<ToolboxItemDisplay icon={TbLayoutColumns} label="Column" />}
        mobile={{
          display: "flex",
          justifyContent: "justify-center",
          flexDirection: "flex-col",
          width: "w-full",
          gap: "gap-8",
          height: "h-auto",
          py: "py-6",
          px: "px-3",
        }}
        desktop={{}}
        custom={{ displayName: "Column" }}
      />,
    ],
  },
];
