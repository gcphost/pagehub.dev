import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getAltView } from 'utils/craft';
import { SideBarAtom, SideBarOpen } from 'utils/lib';
import { DeviceAtom, ViewAtom } from '../Viewport';

export const LargeviewChanger = () => {
  const [view, setView] = useRecoilState(ViewAtom);
  const setDevice = useSetRecoilState(DeviceAtom);
  const sideBarOpen = useRecoilValue(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);

  const altView = getAltView(view);

  // if (device) return null;

  return (
    <div
      className={`fixed bottom-4 w-auto ${
        sideBarLeft ? 'left-[360px]' : 'right-[360px]'
      } flex items-center justify-center z-10 cursor-pointer select-none`}
      onClick={() => {
        setView(altView);
        setDevice(false);
      }}
    >
      <div
        className={` ${
          view === 'mobile' ? 'bg-green-500' : 'bg-yellow-500'
        } p-3  rounded-md  text-gray-900 text-xs border border-gray-900/50 opacity-80 hover:opacity-100 inside-shadow-light`}
      >
        Editing: <span className="font-bold">{view}</span>
      </div>
    </div>
  );
};
