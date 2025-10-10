import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { IconDialogInput } from "./IconDialogInput";

interface IconInputProps {
  propKey?: string;
  propType?: string;
  label?: string;
  labelWidth?: string;
  inputWidth?: string;
  showIconOnly?: boolean;
  showPosition?: boolean;
  iconOnlyLabel?: string;
  positionLabel?: string;
}

export const IconInput = ({
  propKey = "icon",
  propType = "component",
  label = "Icon",
  labelWidth = "w-full",
  inputWidth = "w-fit",
  showIconOnly = true,
  showPosition = true,
  iconOnlyLabel = "Only Show Icon",
  positionLabel = "Position",
}: IconInputProps) => {
  return (
    <ToolbarSection title={label}>
      <IconDialogInput
        propKey={propKey}
        propType={propType}
        label="Image"
        labelWidth={labelWidth}
        inputWidth={inputWidth}
      />

      {showIconOnly && (
        <ToolbarItem
          propKey="iconOnly"
          propType={propType}
          type="checkbox"
          label={iconOnlyLabel}
          on={true}
          labelHide
          labelWidth="w-full"
        />
      )}

      {showPosition && (
        <ToolbarItem
          propKey="iconPosition"
          propType={propType}
          type="select"
          label={positionLabel}
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </ToolbarItem>
      )}
    </ToolbarSection>
  );
};

export default IconInput;
