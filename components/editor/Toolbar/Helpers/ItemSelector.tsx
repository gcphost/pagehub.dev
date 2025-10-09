import { Tooltip } from "components/layout/Tooltip";
import { useState } from "react";
import { RxSlider } from "react-icons/rx";
import { TbChevronDown, TbSelector, TbSettings } from "react-icons/tb";
import { atom, useRecoilState } from "recoil";

export const sizingItems = [
  {
    id: "slider",
    content: "Slider options",
    icon: <RxSlider />,
  },
  {
    id: "select",
    content: "List options",
    icon: <TbSelector />,
  },
  {
    id: "px",
    content: "Manual options",
    icon: "px",
  },
];

export const ItemToggle = ({ items = [], children, selected, onChange, option = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.id === selected) || items[0];

  if (option) {
    // Dropdown mode
    return (
      <div className="flex flex-row items-end gap-0.5 relative">
        {children}

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs p-2 rounded-md border border-gray-800 hover:bg-gray-600 w-8 h-8 flex items-center justify-center bg-gray-600"
          >
            <TbChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown menu */}
              <div className="absolute top-full right-0 mt-1 bg-gray-700 border border-gray-800 rounded-md shadow-lg z-20 overflow-hidden">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-600 w-full text-left whitespace-nowrap ${selected === item.id ? 'bg-gray-600' : ''
                      }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      {item.icon}
                    </span>
                    {item.content}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Original inline buttons mode
  return (
    <div className="flex flex-row items-end gap-0.5">
      {children}

      <div className="flex flex-row gap-0.5">
        {items.map((item) => (
          <ItemSelector
            {...item}
            key={item.id}
            onClick={() => onChange(item.id)}
            selected={selected === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export const ItemSelector = ({
  content = null,
  icon,
  onClick,
  selected = false,
}) => (
  <Tooltip
    content={content}
    className="cursor-pointer"
    onClick={onClick}
    placement="bottom"
  >
    <div
      className={`text-xs p-2 rounded-md border border-gray-800 hover:bg-gray-600 hover:text-lg w-8 h-8 flex items-center justify-center ${selected ? "bg-gray-600" : ""
        }`}
    >
      {icon}
    </div>
  </Tooltip>
);

export const ItemAdvanceToggle = ({
  children,
  propKey,
  title = (
    <>
      <TbSettings /> More settings are available
    </>
  ),
}) => {
  const itemListState = atom({
    key: `advancedToggle-${propKey}`,
    default: false,
  });

  const [showAdvance, setShowAdvance] = useRecoilState(itemListState);

  return (
    <>
      <button
        className="w-full text-center text-xxs mx-auto mt-2 px-2 py-0 flex items-center justify-center gap-1.5 border border-primary-500 rounded-md hover:bg-primary-500"
        onClick={() => setShowAdvance(!showAdvance)}
      >{title}
      </button>

      {showAdvance ? children : null}
    </>
  );
};
