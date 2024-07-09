import { ROOT_NODE, useEditor, useNode } from '@craftjs/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { TbPlus } from 'react-icons/tb';
import { useSetRecoilState } from 'recoil';
import { ToolboxMenu } from '../RenderNode';
import RenderNodeControl from '../RenderNodeControl';
import { SelectedNodeAtom } from '../Viewport/Toolbox/lib';
import { TbActiveItemAtom, TbActiveMenuAtom } from '../Viewport/atoms';

export const AddSectionNodeController = (props: { position; align }) => {
  const { position, align } = props as any;

  const ref = useRef(null);

  const { id } = useNode();

  const setActiveMenu = useSetRecoilState(TbActiveMenuAtom);
  const setActiveItem = useSetRecoilState(TbActiveItemAtom);
  const setSelectedNode = useSetRecoilState(SelectedNodeAtom);

  const { parent } = useNode((node) => ({
    parent: node.data.parent,
  }));

  const { query } = useEditor();

  const parentNode = query.node(parent || ROOT_NODE).get();
  const propType = parentNode?.data?.props?.type;

  let type = null;
  if (propType === 'page') type = 'Section';
  if (propType === 'background') type = 'Page';

  const setMenu = useSetRecoilState(ToolboxMenu);

  return (
    <AnimatePresence>
      <RenderNodeControl
        position={position}
        placement="middle"
        align={align}
        className={'whitespace-nowrap fixed items-center justify-center select-none cursor-pointer pointer-events-auto'}
        animate={{
          initial: { opacity: 0, y: 2 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.2,
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 20,
              mass: 0.5,
            },
          },
          exit: {
            opacity: 0,
            y: 2,
            transition: {
              delay: 0.2,
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
              mass: 0.5,
            },
          },
          whileHover: { scale: 1.1, y: -5 },
          whileTap: { scale: 0.9 },
        }}
      >
        <motion.div
          ref={ref}
          className={'border btn text-white rounded-md flex flex-row px-3 py-1.5 gap-1.5 items-center cursor-pointer !text-xs !font-normal fontfamily-base'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenu({ enabled: true });

            setSelectedNode({
              id,
              position: position === 'bottom' ? 'afterParent' : 'beforeParent',
            });
            setActiveMenu(type === 'Section' ? 1 : 2);
            setActiveItem(0);
          }}
        >
          <TbPlus /> Add {type}
        </motion.div>
      </RenderNodeControl>
    </AnimatePresence>
  );
};
