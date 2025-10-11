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
    <div className={`w-full ${collapsible ? 'rounded border border-border shadow' : ''}`}>
      {title && (
        <button
          id={title}
          className={`flex w-full items-center justify-between gap-3 ${collapsible ? 'rounded-t bg-sidebar' : '-ml-2'} px-2 py-1 text-sm font-semibold text-sidebar-foreground transition-colors ${className}`}
          onClick={handleClick}
          aria-label={title}
        >
          <div className="flex items-center gap-3">
            {title}

            {propKey && <ToolbarLabel lab={propKey} propKey={propKey} />}

            {help && (
              <span
                className="relative inline-flex"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xxs peer z-10 inline-flex cursor-pointer rounded-full">
                  <TbQuestionMark />
                </span>
                <span className="invisible absolute -top-2 left-8 z-50 w-64 whitespace-normal rounded border border-border bg-card p-3 text-sm font-normal text-foreground shadow-lg peer-hover:visible">
                  {help}
                </span>
              </span>
            )}
          </div>

          {collapsible && (
            <span className="text-base text-sidebar-foreground">
              {isOpen ? <TbChevronUp /> : <TbChevronDown />}
            </span>
          )}
        </button>
      )}

      {enabled && isOpen && (
        <>
          <div
            className={`grid-cols-${full} grid items-end gap-4 ${collapsible ? 'rounded bg-card p-2 text-card-foreground' : ''} ${bodyClassName}`}
            role="group"
            aria-labelledby={title}
          >
            {children}

            {footer}
          </div>


        </>
      )}
    </div>
  );
};
