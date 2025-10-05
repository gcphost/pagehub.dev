import { Button } from "components/selectors/Button";
import { RxButton } from "react-icons/rx";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

// Default icon SVG for star icon
const defaultIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;

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
      display={<ToolboxItemDisplay icon={RxButton} label={text} />}
      iconPosition={props.iconPosition || "left"}
      buttons={props.buttons || [
        {
          text,
        },
      ]}
      root={root}
      mobile={mobile}
      element={Button}
      custom={props.custom}
    />
  );
};

export const ButtonToolbox = {
  title: "Buttons",
  content: [
    <RenderButtonComponent
      text="Button"
      key="1"
      custom={{ displayName: "Button" }}
      root={{ border: "border", borderColor: "border-gray-500", radius: "rounded-lg" }}
    />,
    <RenderButtonComponent
      text="Icon"
      key="2"
      custom={{ displayName: "Icon" }}
      iconPosition="left"
      buttons={[
        {
          text: "Button",
          icon: defaultIconSvg,
          iconOnly: true,
        },
      ]}
    />,
  ],
  classes: {
    content: "p-3  grid grid-cols-2 gap-3",
  },
};
