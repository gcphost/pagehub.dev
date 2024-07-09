import { atom } from "recoil";

export const TbActiveMenuAtom = atom({
  key: "TbActiveMenuAtom",
  default: null,
});

export const TbActiveItemAtom = atom({
  key: "TbActiveItemAtom",
  default: 0,
});

export const TbActiveSubItemAtom = atom({
  key: "TbActiveSubItemAtom",
  default: 0,
});
