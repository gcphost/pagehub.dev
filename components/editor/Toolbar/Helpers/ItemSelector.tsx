import { Tooltip } from "components/layout/Tooltip";
import { RxSlider } from "react-icons/rx";
import { TbSelector, TbSettings } from "react-icons/tb";
import { atom, useRecoilState } from "recoil";
import { MotionIcon, MotionInside } from "./MotionIcon";

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
  <div className="flex flex-col gap-3">
    {children}

    <div className="flex flex-row gap-1.5">
      {items.map((item, index) => (
        <ItemSelector
          {...item}
          key={index}
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
    <MotionInside
      className={`text-xs p-2 rounded-md border border-gray-800 hover:bg-gray-600 hover:text-lg w-8 h-8 flex items-center justify-center ${
        selected ? "bg-gray-600" : ""
      }`}
    >
      <MotionIcon>{icon}</MotionIcon>
    </MotionInside>
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
      <div
        className="text-xs flex items-center  gap-1.5 cursor-pointer"
        onClick={() => setShowAdvance(!showAdvance)}
      >
        <MotionIcon>{title}</MotionIcon>
      </div>

      {showAdvance ? children : null}
    </>
  );
};
