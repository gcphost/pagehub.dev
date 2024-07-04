import { Button } from "components/selectors/Button";
import { RxButton } from "react-icons/rx";
import { RenderToolComponent } from "./lib";

export const RenderButtonComponent = ({ text = "Button", ...props }) => {
  const root = {
    ...(props.root || {}),
  };

  const mobile = {
    ...(props.mobile || {}),
    flexDirection: "flex-col",
    alignItems: "text-center",
    gap: "gap-8",
    px: "px-12",
    py: "py-6",
    width: "w-auto",
    display: "flex",
    cursor: "cursor-pointer",
  };

  return (
    <RenderToolComponent
      display={
        <div className="flex flex-row gap-3 items-center border p-3 rounded-md w-full hover:bg-gray-100">
          <RxButton /> {text}
        </div>
      }
      iconPosition={props.iconPosition || "left"}
      buttons={[
        {
          text,
        },
      ]}
      root={root}
      mobile={mobile}
      element={Button}
    />
  );
};

export const ButtonToolbox = {
  title: "Buttons",
  content: [
    <RenderButtonComponent
      text="Button"
      key="1"
      root={{ border: "border", borderColor: "border-gray-500" }}
    />,
  ],
  classes: {
    content: "p-3  grid grid-cols-2 gap-3",
  },
};
