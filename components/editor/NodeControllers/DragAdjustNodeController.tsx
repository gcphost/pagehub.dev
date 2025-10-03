import { useEditor, useNode } from "@craftjs/core";
import { AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import RenderNodeControl from "../RenderNodeControl";
import { ViewAtom } from "../Viewport";
import DragAdjust from "../Viewport/Toolbox/DragAdjust";

export const DragAdjustNodeController = (props: {
  position;
  align;
  direction;
  propVar;
  styleToUse;
  alt?: any;
  gridSnap?: number;
  tooltip?: string;
}) => {
  const { position, align, direction, propVar, styleToUse, alt, gridSnap, tooltip } =
    props as any;

  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const dom = document.querySelector(`[node-id="${id}"]`);

  const {
    actions: { setProp },
  } = useNode();

  const view = useRecoilValue(ViewAtom);

  return (
    <AnimatePresence>
      {isActive && (
        <RenderNodeControl
          position={position}
          align={align}
          alt={alt}
          placement="middle"
          hPlacement="start"
          className={
            "whitespace-nowrap items-center justify-center select-none fixed pointer-events-auto"
          }
        >
          <DragAdjust
            className="btn"
            targetElement={dom}
            direction={direction}
            styleToUse={styleToUse}
            tooltip={tooltip}
            onChange={(value) => {
              setProp((prop) => {
                prop[view] = prop[view] || {};

                if (gridSnap) {
                  // Convert pixel value to grid fraction
                  const parent = dom?.parentElement;
                  if (parent) {
                    const parentWidth = parent.offsetWidth;
                    const currentWidth = parseFloat(value);
                    const percentage = (currentWidth / parentWidth) * 100;

                    // Round to nearest grid fraction
                    const gridFraction = Math.max(1, Math.min(gridSnap, Math.round((percentage / 100) * gridSnap)));

                    prop[view][propVar] = `w-${gridFraction}/12`;
                  }
                } else {
                  // Round pixel value to whole number
                  const numericValue = parseFloat(value);
                  const roundedValue = Math.round(numericValue);
                  const unit = value.replace(/[0-9.-]/g, '');
                  prop[view][propVar] = `${propVar}-[${roundedValue}${unit}]`;
                }
              }, 200);
            }}
          />
        </RenderNodeControl>
      )}
    </AnimatePresence>
  );
};
