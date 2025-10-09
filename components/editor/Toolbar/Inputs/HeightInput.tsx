import { atom, useRecoilState } from "recoil";
import { TailwindStyles } from "utils/tailwind";
import { ItemToggle, sizingItems } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";

export const HeightInput = ({
  propKey = "height",
  propType = "class",
  propTag = "h",
  values = "height",
  sliderValues = "height",
  label = "Height",
}) => {
  const itemListState = atom({
    key: propKey,
    default: "slider",
  });

  const [state, setState] = useRecoilState(itemListState);

  const toggle = <ItemToggle
    selected={state}
    onChange={(value) => setState(value)}
    items={sizingItems}
    option={false}
  />


  return (
    <>
      {state === "slider" && (
        <ToolbarItem
          propKey={propKey}
          type="slider"
          label={label}
          propType={propType}
          max={TailwindStyles[sliderValues].length - 1}
          min={0}
          valueLabels={TailwindStyles[sliderValues]}
          showVarSelector={true}
          varSelectorPrefix={propTag}
          inline
          append={toggle}
        />
      )}

      {state === "px" && (
        <ToolbarItem
          propKey={propKey}
          propType={propType}
          propTag={propTag}
          type="custom"
          placeholder="Pixels"
          label={label}
          labelHide={true}
          inline
          append={toggle}
        />
      )}
    </>
  );
};
