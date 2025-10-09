import { Tooltip } from "components/layout/Tooltip";
import { RxSlider } from "react-icons/rx";
import { TbSelector, TbSettings } from "react-icons/tb";
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

export const ItemToggle = ({ items = [], children, selected, onChange }) => (
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
