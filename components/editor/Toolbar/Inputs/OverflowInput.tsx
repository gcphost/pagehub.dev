import { TailwindStyles } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";

export const OverflowInput = () => (
  <ToolbarItem propKey="display" type="select" label="" labelHide={true}>
    <option value="">Default</option>
    {TailwindStyles.overflow.map((_, k) => (
      <option key={k}>{`${_}`}</option>
    ))}
  </ToolbarItem>
);
