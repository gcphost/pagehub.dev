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

export const ItemToggle = ({
  items = [],
  children,
  selected,
  onChange,
  option = true,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find((item) => item.id === selected) || items[0];

  if (option) {
    // Dropdown mode
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-md p-0.5 text-xs"
        >
          <TbChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-muted text-muted-foreground shadow-lg">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-xs hover:bg-muted ${
                    selected === item.id ? "bg-muted" : ""
                  }`}
                >
                  <span className="flex size-4 items-center justify-center">
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
    const currentIndex = items.findIndex((item) => item.id === selected);
    const nextIndex = (currentIndex + 1) % items.length;
    onChange(items[nextIndex].id);
  };

  return (
    <div className="flex flex-row items-end gap-0.5">
      {children}

      <ItemSelector {...selectedItem} onClick={handleToggle} selected={true} />
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
      className={`flex items-center justify-center text-xs ${
        selected ? "" : ""
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
        className="text-xxs hover:text-underline mx-auto mt-2 flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-0 text-center"
        onClick={() => setShowAdvance(!showAdvance)}
      >
        {title}
      </button>

      {showAdvance ? <div className="mt-4">{children}</div> : null}
    </>
  );
};
