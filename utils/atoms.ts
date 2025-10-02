import { atom } from "recoil";

export const SettingsAtom = atom({
  key: "settings",
  default: null,
});

export const SessionTokenAtom = atom({
  key: "sessionToken",
  default: null,
});
