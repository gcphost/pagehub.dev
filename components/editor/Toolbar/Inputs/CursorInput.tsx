import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const CursorInput = () => (
  <ToolbarItem propKey="display" type="select" label="Cursor" labelHide={true}>
    <option value="">Default</option>
    {TailwindStyles.cursor.map((_, k) => (
      <option key={k}>{`${_}`}</option>
    ))}
  </ToolbarItem>
);
