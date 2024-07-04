import { useNode } from "@craftjs/core";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { ColorInput } from "./ColorInput";

import { PatternsDialogInput } from "./PatternsDialogInput";

export const PatternInput = () => {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }));

  const pattern = props.root?.pattern || {}; // ? patterns[props.root.pattern] : null;

  return (
    <>
      <ToolbarSection title="Pattern" subtitle={true}>
        <PatternsDialogInput propKey="pattern" propType="root" />

        {props.root?.pattern && (
          <>
            <ToolbarSection full={2}>
              {[...Array(+pattern.colors - 1).keys()].map((_) => (
                <ColorInput
                  key={_}
                  propKey={`patternColor${_ + 1}`}
                  label={`Color ${_ + 1}`}
                  prefix=""
                  propType="root"
                  showPallet={false}
                />
              ))}
            </ToolbarSection>

            <ToolbarItem
              propKey="patternZoom"
              propType="root"
              type="slider"
              label="Scale"
              max={pattern.maxScale}
              min={1}
            />
            <ToolbarSection full={2}>
              <ToolbarItem
                propKey="patternVerticalPosition"
                propType="root"
                type="slider"
                label="Vertical"
                max={0}
                min={-120}
              />
              <ToolbarItem
                propKey="patternHorizontalPosition"
                propType="root"
                type="slider"
                label="Horizontal"
                max={0}
                min={-120}
              />
            </ToolbarSection>

            <ToolbarSection full={2}>
              <ToolbarItem
                propKey="patternStroke"
                propType="root"
                type="slider"
                label="Stroke"
                max={pattern.maxStroke || 0}
                min={0.5}
                step={0.5}
              />

              <ToolbarItem
                propKey="patternAngle"
                propType="root"
                type="slider"
                label="Angle"
                max={180}
                min={0}
              />
            </ToolbarSection>

            <ToolbarSection full={2}>
              <ToolbarItem
                propKey="patternSpacingX"
                propType="root"
                type="slider"
                label="X Distance"
                max={pattern.maxSpacing[0]}
                min={0}
              />
              <ToolbarItem
                propKey="patternSpacingY"
                propType="root"
                type="slider"
                label="Y Distance"
                max={pattern.maxSpacing[1]}
                min={0}
              />
            </ToolbarSection>
          </>
        )}
      </ToolbarSection>
    </>
  );
};
