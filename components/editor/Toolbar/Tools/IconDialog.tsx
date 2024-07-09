import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { Dialog } from './Dialog';
import { IconLoader } from './IconLoader';

const iconList = require('utils/icons.json');

export const IconDialogAtom = atom({
  key: 'iconDialog',
  default: {
    enabled: false,
    prefix: '',
    changed: null,
    e: null,
  } as any,
});

export const IconDialogDialog = () => {
  const [dialog, setDialog] = useRecoilState(IconDialogAtom);
  const [svgDataUri, setSvgDataUri] = useState('');

  const changed = async (value) => {
    if (dialog.changed) {
      const response = await fetch(value);
      const svgText = await response.text();
      setSvgDataUri(svgText);

      setDialog({ ...dialog, value: svgText, enabled: false });
      dialog.changed(svgText);
    }
  };

  const _icons = [...iconList.regular, ...iconList.brands, ...iconList.solid];

  return (
    <Dialog
      dialogAtom={IconDialogAtom}
      dialogName="iconPicker"
      value={dialog.value}
      items={_icons}
      className="text-2xl grid grid-cols-4"
      callback={(_, k) => (
        <div
          id={`iconPicker-${_}`}
          className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md justify-center gap-3 items-center ${
            dialog.value === _ ? 'bg-gray-100' : ''
          }`}
          key={k}
          onClick={(e) => changed(_)}
        >
          <div className="pointer-events-none flex  jusitfy-center items-center">
            <IconLoader icon={_} />
          </div>
        </div>
      )}
    />
  );
};
