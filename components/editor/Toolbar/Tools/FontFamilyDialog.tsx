import { atom, useRecoilState } from "recoil";
import { fonts } from "utils/tailwind";
import { Dialog } from "./Dialog";

export const FontFamilyDialogAtom = atom({
  key: "fontFamily",
  default: {
    enabled: false,
    prefix: "",
    changed: null,
    e: null,
  } as any,
});

export const FontFamilyDialog = () => {
  const [dialog, setDialog] = useRecoilState(FontFamilyDialogAtom);

  const changed = (value) => {
    if (!dialog.changed) return;

    setDialog({ ...dialog, value, enabled: false });
    dialog.changed(value);
  };

  return (
    <Dialog
      dialogAtom={FontFamilyDialogAtom}
      dialogName="fontFamily"
      value={dialog.value}
      items={fonts}
      onSearch={(_, value) =>
        _[0].search(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        ) > -1
      }
      callback={(_, k) => (
        <button
          id={`fontFamily-${_}`}
          className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl ${
            dialog.value === _ ? "bg-gray-100" : ""
          }`}
          style={{ fontFamily: (_ || []).join(", ") }}
          key={k}
          onClick={(e) => changed(_)}
        >
          {_.join(", ")}
        </button>
      )}
    />
  );
};
