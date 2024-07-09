import { useNode } from '@craftjs/core';
import { ViewAtom } from 'components/editor/Viewport';
import { changeProp, getProp } from 'components/editor/Viewport/lib';
import { getRect } from 'components/editor/Viewport/useRect';
import { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Wrap } from '../ToolbarStyle';
import { ColorPickerAtom } from '../Tools/ColorPickerDialog';
import { useDialog } from '../Tools/lib';

export const bgAndVal = ({ value, prefix }) => {
  let val = value ? value?.split(`${prefix}-`).filter((_) => _)[0] : null;
  let bg = val;

  if (
    val
    && !val.includes('-')
    && !val.includes('[')
    && (val.includes('#') || val.includes('rgba'))
  ) bg = `[${val}]`;

  if (bg?.includes('[')) val = bg.replace('[', '').replace(']', '');

  return [bg, val];
};

export const ColorInput = (__props: any) => {
  const {
    propKey,
    label = '',
    prefix = '',
    index = null,
    propItemKey = '',
    propType = 'class',
    showPallet = true,
    onChange = () => {},
    labelHide = false,
  } = __props;

  const [dialog, setDialog] = useRecoilState(ColorPickerAtom);
  const view = useRecoilValue(ViewAtom);

  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  const value = getProp(__props, view, nodeProps) || '';

  const [bg, cpVAl] = bgAndVal({ value, prefix });

  const changed = (data) => {
    let val = data.value;

    if (val) {
      if (data.type === 'hex') {
        val = prefix ? `${prefix}-[${val}]` : `${val}`;
      } else if (data.type === 'rgb') {
        val = `rgba(${val.r},${val.g},${val.b},${val.a})`;
        val = prefix ? `${prefix}-[${val}]` : val;
      } else {
        val = prefix ? `${prefix}-${val}` : val;
      }
    }

    changeProp({
      propKey,
      index,
      propItemKey,
      propType,
      value: val,
      setProp,
    });

    onChange(cpVAl, val);
  };

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <div ref={ref}>
      <Wrap
        props={{ label, labelHide }}
        index={index}
        lab={value}
        propType={propType}
        propKey={propKey}
        propItemKey={propItemKey}
      >
        <div
          className={`w-full h-12 rounded-md cursor-pointer border input-hover bg-${bg}`}
          onClick={(e) => {
            setDialog({
              enabled: !dialog.enabled,
              value: cpVAl,
              prefix,
              changed,
              showPallet,
              propKey,
              e: getRect(ref.current),
            });
          }}
        ></div>
      </Wrap>
    </div>
  );
};
