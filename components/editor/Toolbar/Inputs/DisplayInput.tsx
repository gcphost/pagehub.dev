import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { CursorInput } from "./CursorInput";
import { OverflowInput } from "./OverflowInput";

export const DisplayInput = () => (
  <ToolbarSection title="Display">
    <ToolbarItem
      propKey="display"
      type="select"
      label="Display"
      labelHide={true}
    >
      <option value="">Default</option>
      {TailwindStyles.display.map((_, k) => (
        <option key={k}>{`${_}`}</option>
      ))}
    </ToolbarItem>

    <ToolbarItem
      propKey="position"
      type="select"
      label="Position"
      labelHide={true}
    >
      <option value="">Default</option>
      {TailwindStyles.position.map((_, k) => (
        <option key={k}>{`${_}`}</option>
      ))}
    </ToolbarItem>

    <CursorInput />

    <OverflowInput />
  </ToolbarSection>
);
