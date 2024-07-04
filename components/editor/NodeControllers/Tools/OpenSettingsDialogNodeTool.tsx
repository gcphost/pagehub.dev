import { AnimatedTooltipButton } from "components/editor/Tools/AnimatedButton";
import { TbSettings } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { SideBarOpen } from "utils/lib";

export const OpenSettingsDialogNodeTool = () => {
  const [isOpen, setSideBarOpen] = useRecoilState(SideBarOpen);

  if (isOpen) return null;

  return (
    <AnimatedTooltipButton
      content="All Settings"
      placement="bottom"
      onClick={() => setSideBarOpen(true)}
    >
      <TbSettings />
    </AnimatedTooltipButton>
  );
};

export default OpenSettingsDialogNodeTool;
