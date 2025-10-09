import { TbDimensions } from "react-icons/tb";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarSection } from "../ToolbarSection";
import { HeightInput } from "./HeightInput";
import { WidthInput } from "./WidthInput";

export const SizeInput = () => (
  <>
    <ToolbarSection title="Size" full={1} footer={<ItemAdvanceToggle
      propKey="size"
      title={
        <>
          <TbDimensions /> Maximum & minimum sizes are also available.
        </>
      }
    >
      <ToolbarSection
        title="Max Size"
        subtitle={true}
        full={2}
        help="Maximum size this component can be."
      >
        <WidthInput
          propKey="maxWidth"
          values="maxWidths"
          sliderValues="maxWidths"
          propTag="max-w"
        />

        <HeightInput
          propKey="maxHeight"
          values="maxHeights"
          sliderValues="maxHeights"
          propTag="max-h"
        />
      </ToolbarSection>

      <ToolbarSection
        title="Min Size"
        subtitle={true}
        full={2}
        help="Minium size this component can be."
      >
        <WidthInput
          propKey="minWidth"
          values="minWidths"
          sliderValues="minWidths"
          propTag="min-w"
        />

        <HeightInput
          propKey="minHeight"
          values="minHeights"
          sliderValues="minHeights"
          propTag="min-h"
        />
      </ToolbarSection>
    </ItemAdvanceToggle>}>
      <WidthInput />

      <HeightInput />


    </ToolbarSection>


  </>
);
