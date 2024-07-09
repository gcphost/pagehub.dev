import { useGetRectLater } from 'components/editor/Tools/Dialog';
import { ulVariants } from 'components/editor/Viewport/ToolboxContextual';
import { getRect } from 'components/editor/Viewport/useRect';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { atom, useRecoilValue } from 'recoil';

export const ToolTipDialogAtom = atom({
  key: 'tooltip',
  default: {
    enabled: false,
    prefix: '',
    value: null,
    key: null,
    e: null,
    placement: 'bottom',
  } as any,
});

export const ToolTipDialog = () => {
  const dialog = useRecoilValue(ToolTipDialogAtom);
  const ref = useRef(null);
  const rect = getRect(dialog.e);
  const refRect = useGetRectLater(ref);

  const style = {
    top:
      dialog.placement === 'bottom'
        ? rect.bottom + 10
        : rect.top - refRect.height - 10,
    left: rect.left - refRect.width / 2,
    zIndex: 1000,
  } as any;

  return (
    <AnimatePresence>
      {dialog.enabled && (
        <motion.div
          animate={{ opacity: 1, width: 'unset', height: 'unset' }}
          variants={ulVariants}
          transition={ulVariants.transition}
          initial={{ opacity: 0, width: 0, height: 0 }}
          exit={{ opacity: 0, width: 0, height: 0 }}
          key={`tooltip-${dialog.key}`}
          id={`tooltip-${dialog.key}`}
          data-tooltip={true}
          style={style}
          className={'absolute z-20 flex pointer-events-none '}
        >
          <div
            ref={ref}
            key={`tooltip-${dialog.key}`}
            className="pointer-events-none absolute  bg-gray-600 border border-gray-700 text-white rounded-md px-3 py-1.5 whitespace-nowrap text-xs drop-shadow-2xl font-normal"
          >
            {dialog.value}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
