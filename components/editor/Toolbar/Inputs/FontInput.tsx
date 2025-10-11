import { TailwindStyles } from "utils/tailwind";

import { AiOutlineAlignRight } from "react-icons/ai";
import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbClearAll,
  TbSettings
} from "react-icons/tb";
import { ItemAdvanceToggle } from "../Helpers/ItemSelector";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { FontFamilyInput } from "./FontFamilyInput";
import { TailwindInput } from "./TailwindInput";

export const FontInput = () => (
  <ToolbarSection title="Typography" footer={
    <ItemAdvanceToggle
      propKey="font"
      title={
        <>
          <TbSettings /> Transform, word break, overflow & more
        </>
      }
    >
      <ToolbarSection full={1} collapsible={false}>
        <ToolbarItem
          propKey="lineHeight"
          type="slider"
          label="Line Height"
          max={TailwindStyles.lineHeight.length - 1}
          min={0}
          valueLabels={TailwindStyles.lineHeight}
        />

        <ToolbarItem
          propKey="tracking"
          type="slider"
          label="Tracking"
          max={TailwindStyles.tracking.length - 1}
          min={0}
          valueLabels={TailwindStyles.tracking}
        />
        <TailwindInput
          propKey="transform"
          label="Transform"
          prop="transform"
          type="select"
        />

        <TailwindInput
          propKey="wordBreak"
          label="Word Break"
          prop="wordBreak"
          type="select"
        />

        <TailwindInput
          propKey="textOverflow"
          label="Text Overflow"
          prop="textOverflow"
          type="select"
        />
        <TailwindInput propKey="indent" label="Indent" prop="indent" />
        <TailwindInput
          propKey="textDecoration"
          label="Decoration"
          prop="textDecoration"
          type="select"
        />


      </ToolbarSection>
    </ItemAdvanceToggle>
  }>

    <ToolbarItem
      propKey="textAlign"
      type="radio"
      label=""
      cols={true}
      options={[
        { label: <TbClearAll />, value: "" },
        { value: "text-left", label: <TbAlignLeft /> },
        { value: "text-center", label: <TbAlignCenter /> },
        { value: "text-right", label: <AiOutlineAlignRight /> },
        { value: "text-justify", label: <TbAlignJustified /> },
        { value: "text-start", label: <TbAlignLeft /> },
        { value: "text-end", label: <TbAlignRight /> },
      ]}
    />

    <FontFamilyInput />

    <ToolbarItem
      propKey="fontSize"
      type="slider"
      label="Size"
      max={TailwindStyles.fontSize.length - 1}
      min={0}
      valueLabels={TailwindStyles.fontSize}
      showVarSelector={true}
      varSelectorPrefix="text"
    />

    <ToolbarItem
      propKey="fontWeight"
      type="select"
      label="Weight"
      max={TailwindStyles.fontWeight.length - 1}
      min={0}
      valueLabels={TailwindStyles.fontWeight}
      showVarSelector={true}
      varSelectorPrefix="font"
    />





  </ToolbarSection>
);
