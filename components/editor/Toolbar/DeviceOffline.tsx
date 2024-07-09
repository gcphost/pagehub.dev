import { Tooltip } from "components/layout/Tooltip";
import { useSetRecoilState } from "recoil";
import { OnlineAtom } from "utils/lib";

export const DeviceOffline = () => {
  const setOnline = useSetRecoilState(OnlineAtom);

  return (
    <div className="z-50 fixed bottom-3 left-1/2 w-auto ml-6 flex items-center justify-center cursor-pointer select-none">
      <Tooltip content="You data is saved locally" arrow={false}>
        <button
          className={
            "p-3  rounded-md font-medium underline text-gray-900 text-xs border border-gray-900/50 opacity-100 hover:opacity-100 inside-shadow-light"
          }
          onClick={() => setOnline(window.navigator.onLine)}
        >
          No internet connection.
        </button>
      </Tooltip>
    </div>
  );
};
