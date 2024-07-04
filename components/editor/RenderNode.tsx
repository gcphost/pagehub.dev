import { atom } from "recoil";

export interface ToolboxMenuInterface {
  enabled?: boolean;
  position: string;
  x: number;
  y: number;
  name: string;
  id: string;
  parent: {
    name: string;
    displayName: string;
    props: any;
  };
}

export const ToolboxMenu = atom({
  key: "menu",
  default: {
    enabled: false,
    position: "after",
    x: 0,
    y: 0,
    name: "",
    components: [],
    id: "",
    parent: {
      name: "",
      displayName: "",
      props: {},
    },
  } as any,
});
