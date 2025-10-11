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
    <div className="w-full mb-4">
      {title && (
        <button id={title} className={`text-sm font-semibold text-foreground gap-3 flex items-center justify-between w-full py-2 px-1 rounded-md  transition-colors ${className}`} onClick={handleClick} aria-label={title}>
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
                <span className="invisible peer-hover:visible absolute text-sm w-64 left-8 -top-2 bg-card border border-border rounded p-3 font-normal text-foreground shadow-lg z-50 whitespace-normal">
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
        <>
          <div className={`grid-cols-${full} gap-4 grid items-end ${bodyClassName} pb-2`} role="group" aria-labelledby={title}>
            {children}
          </div>

          {footer && <div className="pt-2">{footer}</div>}
        </>
      )}


    </div>
  );
};
