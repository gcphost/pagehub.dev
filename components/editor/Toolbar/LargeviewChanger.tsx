import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getAltView } from "utils/craft";
import { SideBarAtom, SideBarOpen } from "utils/lib";
import { DeviceAtom, ViewAtom } from "../Viewport";

export const LargeviewChanger = () => {
  const [view, setView] = useRecoilState(ViewAtom);
  const setDevice = useSetRecoilState(DeviceAtom);
  const sideBarOpen = useRecoilValue(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);

  const altView = getAltView(view);

  // if (device) return null;

  return (
    <button
      className={`fixed bottom-4 w-auto ${
        sideBarLeft ? "left-[360px]" : "right-[360px]"
      } z-10 flex cursor-pointer select-none items-center justify-center`}
      onClick={() => {
        setView(altView);
        setDevice(false);
      }}
    >
      <div
        className={` ${
          view === "mobile" ? "bg-secondary" : "bg-accent"
        } border-border/50 inside-shadow-light rounded-md border p-3 text-xs text-foreground opacity-80 hover:opacity-100`}
      >
        Editing: <span className="font-bold">{view}</span>
      </div>
    </button>
  );
};
