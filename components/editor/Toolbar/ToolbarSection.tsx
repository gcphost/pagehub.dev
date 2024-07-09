import { TbQuestionMark } from "react-icons/tb";
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
  subtitle = false,
  help = "",
}: any) => {
  const classNames = className
    ? "items-center flex text-lg text-white text-left font-medium text-dark-gray bg-gray-800 p-3 cursor-pointer border-y-gray-900 border-y border border-yellow-500"
    : `items-center flex text-${
        subtitle ? "lg" : "2xl"
      } mt-6 font-bold text-white gap-3 flex`;

  return (
    <>
      {title && (
        <h5 id={title} className={classNames} onClick={onClick}>
          {title}

          {propKey && <ToolbarLabel lab={propKey} propKey={propKey} />}

          {help && (
            <span className="text-xs p-0.5 bg-gray-500 hover:bg-gray-600 cursor-pointer group rounded-full">
              <TbQuestionMark />
            </span>
          )}
        </h5>
      )}

      {help && (
        <div className="hidden group-active:flex group-hover:flex ">{help}</div>
      )}

      {enabled && (
        <div className={`grid-cols-${full} gap-3 grid items-end`}>
          {children}
        </div>
      )}
    </>
  );
};
