import { useState } from "react";
import { TbChevronDown, TbChevronUp, TbQuestionMark } from "react-icons/tb";
import { ToolbarLabel } from "./Label";

export const ToolbarSection = ({
  title,
  children,
  full = 1,
  enabled = true,
  onClick,
  propKey,
  tabClass = true,
  className = "",
  bodyClassName = "",
  subtitle = false,
  help = "",
  collapsible = true,
  defaultOpen = true,
  footer,
}: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);


  const handleClick = (e: React.MouseEvent) => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="w-full mb-2">
      {title && (
        <button id={title} className={`items-center flex text-sm  font-bold text-white gap-3 flex justify-between w-full my-2 ${className}`} onClick={handleClick} aria-label={title}>
          <div className="flex items-center gap-3">
            {title}

            {propKey && <ToolbarLabel lab={propKey} propKey={propKey} />}

            {help && (
              <span
                className="relative inline-flex"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xxs  cursor-pointer rounded-full peer inline-flex z-10">
                  <TbQuestionMark />
                </span>
                <span className="invisible peer-hover:visible absolute text-sm w-64 left-8 -top-2 bg-gray-900 border border-gray-700 rounded p-3 font-normal text-white shadow-lg z-50 whitespace-normal">
                  {help}
                </span>
              </span>
            )}
          </div>

          {collapsible && (
            <span className="text-base">
              {isOpen ? <TbChevronUp /> : <TbChevronDown />}
            </span>
          )}
        </button>
      )}

      {enabled && isOpen && (
        <><div className={`grid-cols-${full} gap-3 grid items-end ${bodyClassName}`} role="group" aria-labelledby={title}>
          {children}
        </div>

          {footer && <>{footer}</>}
        </>
      )}


    </div>
  );
};
