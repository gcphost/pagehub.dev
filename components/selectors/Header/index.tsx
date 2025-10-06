import { UserComponent } from "@craftjs/core";
import { Container } from "../Container";
import { HeaderSettings } from "./HeaderSettings";

export const Header: UserComponent<any> = (props: any) => {
  return (<Container {...props} />);
};

Header.craft = {
  ...Container.craft,
  displayName: "Header",
  props: {
    canDelete: false,
    canEditName: false,
    type: "header",
    root: {},
    mobile: {
      display: "flex",
      width: "w-full",
    },
    desktop: {},
    custom: {
      displayName: "Header",
    },
  },
  rules: {
    canDrag: () => false,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    toolbar: HeaderSettings,
  },
};
