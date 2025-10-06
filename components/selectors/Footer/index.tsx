import { UserComponent } from "@craftjs/core";
import { Container } from "../Container";
import { FooterSettings } from "./FooterSettings";

export const Footer: UserComponent<any> = (props: any) => {
  return (<Container {...props} />);
};

Footer.craft = {
  ...Container.craft,
  displayName: "Footer",
  props: {
    canDelete: false,
    canEditName: false,
    type: "footer",
    root: {},
    mobile: {
      display: "flex",
      width: "w-full",
    },
    desktop: {},
    custom: {
      displayName: "Footer",
    },
  },
  rules: {
    canDrag: () => false,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    toolbar: FooterSettings,
  },
};
