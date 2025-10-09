import { atom, useRecoilState } from "recoil";
import { TailwindStyles } from "utils/tailwind";
import { ItemToggle, sizingItems } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";

export const WidthInput = ({
  propType = "class",
  propKey = "width",
  propTag = "w",
  label = "Width",
  values = "allWidths",
  sliderValues = "width",
}) => {
  const itemListState = atom({
    key: propKey,
    default: "slider",
  });

  const [state, setState] = useRecoilState(itemListState);

  return (
    <ItemToggle
      selected={state}
      onChange={(value) => setState(value)}
      items={sizingItems}
    >
      {state === "slider" && (
        <ToolbarItem
          propKey={propKey}
          propType={propType}
          type="slider"
          label={label}
          max={TailwindStyles[sliderValues].length - 1}
          min={0}
          valueLabels={TailwindStyles[sliderValues]}
          showVarSelector={true}
          varSelectorPrefix={propTag}
        />
      )}

      {state === "select" && (
        <ToolbarItem
          propKey={propKey}
          propType={propType}
          type="select"
          label={label}
          showVarSelector={true}
          varSelectorPrefix={propTag}
        >
          <option value="">None</option>
          {TailwindStyles[values].map((_, k) => (
            <option key={k}>{_}</option>
          ))}
        </ToolbarItem>
      )}

      {state === "px" && (
        <ToolbarItem
          propKey={propKey}
          propType={propType}
          propTag={propTag}
          type="custom"
          label={label}
          placeholder="Pixels"
        />
      )}
    </ItemToggle>
  );
};
