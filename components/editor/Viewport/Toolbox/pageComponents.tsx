import { TbBox } from "react-icons/tb";
import { Container } from "../../../selectors/Container";
import { RenderToolComponent } from "./lib";

const generate = require("boring-name-generator");

export const RenderPageComponent = ({ text }) => (
  <RenderToolComponent
    element={Container}
    type="page"
    mobile={{
      mx: "mx-auto",
      display: "flex",
      justifyContent: "items-center",
      flexDirection: "flex-col",
      width: "w-full",
      height: "h-full",
      gap: "gap-8",
      py: "py-6",
      px: "px-3",
    }}
    display={
      <div className="flex flex-row gap-3 items-center border p-3 rounded-md w-full hover:bg-gray-100">
        <TbBox /> Blank Page
      </div>
    }
    custom={{ displayName: generate().spaced }}
  />
);

export const pageToolboxItems = [
  {
    title: "Pages",
    content: [<RenderPageComponent key="1" text="Blank Page" />],
  },
];
