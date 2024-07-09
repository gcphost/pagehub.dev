import { useEffect, useRef, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { v4 as uuidv4 } from 'uuid';

export const Tooltip = ({
  children = null,
  content,
  arrow = false,
  placement = 'top' as any,
  className = '',
  tipStyle = {},
  onClick = () => {},
  key = '' as any,
}) => {
  const ref = useRef(null);

  const [id, setId] = useState(null);

  useEffect(() => {
    setId(uuidv4());
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={className}
        onClick={onClick}
        data-tooltip-id={id}
        data-tooltip-content={content}
        data-tooltip-place={placement}
        data-tooltip-offset={10}
      >
        {children}
      </div>
      <ReactTooltip id={id} classNameArrow="hidden" className="max-w-[220px]" />
    </>
  );
};
