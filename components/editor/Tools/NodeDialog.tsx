import { useNode } from "@craftjs/core";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { TbSettings } from "react-icons/tb";
import { atom, useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { AnimatedTooltipButton } from "./AnimatedButton";
import Dialog from "./Dialog";

const MemoizedAnimatedTooltipButton = React.memo(AnimatedTooltipButton);

export function NodeDialog({
  tooltip = "",
  button = <TbSettings />,
  children = null,
}) {
  const itemListState = atom({
    key: uuidv4(),
    default: false,
  });

  const setIsOpen = useSetRecoilState(itemListState);

  // const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const { id } = useNode();
  const dom = document.querySelector(`[node-id="${id}"]`);
  const ref = useRef(null);
  return (
    <div ref={ref}>
      <MemoizedAnimatedTooltipButton
        content={tooltip}
        placement="bottom"
        onClick={openDialog}
      >
        {button}
      </MemoizedAnimatedTooltipButton>

      <Dialog state={itemListState} target={dom} opener={ref}>
        <div className="flex flex-col gap-3">{children}</div>
      </Dialog>
    </div>
  );
}

export const NodeToolWrapper = ({
  children,
  className = "",
  animate = {},
  col = false,
}) => (
  <motion.div
    className={`flex items-center justify-center ${
      col ? "flex-col" : "flex-row"
    } z-50 gap-3 py-1.5 ${className}`}
    {...animate}
  >
    {children}
  </motion.div>
);

export default NodeDialog;
