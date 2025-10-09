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

export const ItemToggle = ({ items = [], children, selected, onChange, option = true }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find(item => item.id === selected) || items[0];

  if (option) {
    // Dropdown mode
    return (


      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs p-0.5 rounded-md flex items-center justify-center"
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

    );
  }

  // Single button toggle mode - cycles through options
  const handleToggle = () => {
    const currentIndex = items.findIndex(item => item.id === selected);
    const nextIndex = (currentIndex + 1) % items.length;
    onChange(items[nextIndex].id);
  };

  return (
    <div className="flex flex-row items-end gap-0.5">
      {children}

      <ItemSelector
        {...selectedItem}
        onClick={handleToggle}
        selected={true}
      />
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
      className={`text-xs  flex items-center justify-center ${selected ? "" : ""
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
        className="w-full text-center text-xxs mx-auto mt-2 px-2 py-0 flex items-center justify-center gap-1.5  rounded-md hover:text-underline"
        onClick={() => setShowAdvance(!showAdvance)}
      >{title}
      </button>

      {showAdvance ? <div className="mt-4">{children}</div> : null}
    </>
  );
};
