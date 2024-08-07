import { useNode } from "@craftjs/core";
import React from "react";
import { animationClasses } from "utils/animations";
import { motionIt } from "utils/lib";
import { applyAnimation } from "utils/tailwind";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";

export const AnimationsInput = () => {
  const { props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <>
      <ToolbarSection enabled={true}>
        <ToolbarItem
          propType="root"
          propKey={"animation"}
          type="select"
          label="Animation"
        >
          <option value="">None</option>
          <option value="spring">Spring</option>
          <option value="tween">Tween</option>
          <option value="hoverGrow">Grow on Hover</option>
          <option value="bounce">Bounce</option>

          {animationClasses.map((_) =>
            _.classes.map((a, k) => <option key={k}>{a}</option>)
          )}
        </ToolbarItem>

        {React.createElement(
          motionIt(props, "div"),
          {
            ...applyAnimation({}, props),
          },
          <div className="hidden rounded-2xl bg-gray-500 w-24 h-24  mx-auto  mt-6 items-center justify-center">
            Test
          </div>
        )}
      </ToolbarSection>
    </>
  );
};
