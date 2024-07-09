import { TailwindStyles } from 'utils/tailwind';
import { ToolbarItem } from '../ToolbarItem';

export const GapInput = () => (
  <ToolbarItem
    propKey="gap"
    type="slider"
    label="Gap"
    max={TailwindStyles.gap.length - 1}
    min={0}
    valueLabels={TailwindStyles.gap}
  />
);
