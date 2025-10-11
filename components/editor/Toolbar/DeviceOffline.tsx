import { Tooltip } from "components/layout/Tooltip";
import { useSetRecoilState } from "recoil";
import { OnlineAtom } from "utils/lib";

export const DeviceOffline = () => {
  const setOnline = useSetRecoilState(OnlineAtom);

  return (
    <div className="fixed bottom-3 left-1/2 z-50 ml-6 flex w-auto cursor-pointer select-none items-center justify-center">
      <Tooltip content="You data is saved locally" arrow={false}>
        <button
          className={
            "border-border/50 inside-shadow-light rounded-md border p-3 text-xs font-medium text-foreground underline opacity-100 hover:opacity-100"
          }
          onClick={() => setOnline(window.navigator.onLine)}
        >
          No internet connection.
        </button>
      </Tooltip>
    </div>
  );
};
