import { TailwindStyles } from "utils/tailwind";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { FlexDirectionInput } from "./FlexDirectionInput";
import { GapInput } from "./GapInput";
import { TailwindInput } from "./TailwindInput";

export const FlexInput = ({ propKey = "flex" }) => (
  <ToolbarSection
    title="Flex"
    help="Control the position of the components inside this one."
  >
    <ToolbarSection full={2}>
      <GapInput />

      <ToolbarItem
        propKey="alignItems"
        type="select"
        label="Item Alignment"
        labelHide={true}
        cols={true}
      >
        <option value="">None</option>
        {TailwindStyles.alignItems.map((_, k) => (
          <option key={_}>{_}</option>
        ))}
      </ToolbarItem>

      <ToolbarItem
        propKey="justifyContent"
        type="select"
        labelHide={true}
        label="Justify Content"
        cols={true}
      >
        <option value="">None</option>
        {TailwindStyles.justifyContent.map((_, k) => (
          <option key={_}>{_}</option>
        ))}
      </ToolbarItem>
    </ToolbarSection>

    <ItemAdvanceToggle propKey={propKey}>
      <ToolbarSection full={2}>
        <FlexDirectionInput />

        <ToolbarItem
          propKey="alignSelf"
          type="select"
          label="Self Alignment"
          labelHide={true}
          cols={true}
        >
          <option value="">None</option>
          {TailwindStyles.alignSelf.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>

        <ToolbarItem
          propKey="justifySelf"
          type="select"
          labelHide={true}
          label="Justify Self"
          cols={true}
        >
          <option value="">None</option>
          {TailwindStyles.justifySelf.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>

        <ToolbarItem
          propKey="justifyItems"
          type="select"
          labelHide={true}
          label="Justify Items"
          cols={true}
        >
          <option value="">None</option>
          {TailwindStyles.justifyItems.map((_, k) => (
            <option key={_}>{_}</option>
          ))}
        </ToolbarItem>

        <TailwindInput
          propKey="flexBase"
          label="Grow or Shrink"
          prop="flexBase"
        />
      </ToolbarSection>
    </ItemAdvanceToggle>
  </ToolbarSection>
);
