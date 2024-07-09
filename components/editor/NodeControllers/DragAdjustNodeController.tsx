import { useEditor, useNode } from '@craftjs/core';
import { AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import RenderNodeControl from '../RenderNodeControl';
import { ViewAtom } from '../Viewport';
import DragAdjust from '../Viewport/Toolbox/DragAdjust';

export const DragAdjustNodeController = (props: {
  position;
  align;
  direction;
  propVar;
  icon;
  name;
  styleToUse;
  alt?: any;
}) => {
  const {
    position, align, direction, propVar, icon, name, styleToUse, alt
  } = props as any;

  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const dom = document.querySelector(`[node-id="${id}"]`);

  const {
    actions: { setProp },
  } = useNode();

  const view = useRecoilValue(ViewAtom);

  // const { basecolor, background } = getColors(dom, node.data.props);

  return (
    <AnimatePresence>
      {isActive && (
        <RenderNodeControl
          position={position}
          align={align}
          alt={alt}
          placement="middle"
          hPlacement="start"
          className={'whitespace-nowrap items-center justify-center select-none fixed pointer-events-auto'}
        >
          <DragAdjust
            // className={` ${basecolor} ${background}`}
            className="btn"
            targetElement={dom}
            direction={direction}
            styleToUse={styleToUse}
            onChange={(value) => {
              setProp((prop) => {
                prop[view] = prop[view] || {};
                prop[view][propVar] = `${propVar}-[${value}]`;
              }, 200);
            }}
          >
            {icon}

            <div className="hidden group-active:flex group-hover:flex group-hover:font-bold text-xs">
              {name}
            </div>
          </DragAdjust>
        </RenderNodeControl>
      )}
    </AnimatePresence>
  );
};
