import { useMemo, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";

export const Tooltip = ({
  children = null,
  content,
  arrow = false,
  placement = "top" as any,
  className = "",
  tooltipClassName = "",
  tipStyle = {},
  onClick = (e?: React.MouseEvent) => { },
  key = "" as any,
}) => {
  const ref = useRef(null);

  // Generate a stable ID once using useMemo to avoid infinite loops
  const id = useMemo(() => uuidv4(), []);
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    setIsVisible(false);
    onClick(e);

    // Reset visibility after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  };

  return (
    <>
      <div
        ref={ref}
        className={className}
        onClick={handleClick}
        data-tooltip-id={id}
        data-tooltip-content={content}
        data-tooltip-place={placement}
        data-tooltip-offset={10}
      >
        {children}
      </div>
      {isVisible && (
        <ReactTooltip
          id={id}
          classNameArrow="hidden"
          className={`max-w-[220px] !text-primary-foreground !bg-primary !rounded-md !px-2 !py-1 !font-normal !shadow-lg !border !border-border ${tooltipClassName}`}
        />
      )}
    </>
  );
};
