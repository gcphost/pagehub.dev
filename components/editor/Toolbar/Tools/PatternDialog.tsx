import { atom, useRecoilState } from 'recoil';
import { generatePattern } from 'utils/lib';

import { useEffect, useState } from 'react';
import { Dialog } from './Dialog';

export const PatternDialogAtom = atom({
  key: 'patternDialog',
  default: {
    enabled: false,
    prefix: '',
    changed: null,
    e: null,
  } as any,
});

export const PatternDialog = () => {
  const [dialog, setDialog] = useRecoilState(PatternDialogAtom);
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    fetch('/api/patterns', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json().then((re) => {
        setPatterns(re);
      });
    });
  }, []);

  const changed = (value) => {
    if (dialog.changed) {
      setDialog({ ...dialog, value, enabled: false });
      dialog.changed(value);
    }
  };

  return (
    <Dialog
      dialogAtom={PatternDialogAtom}
      dialogName="pattern"
      value={dialog?.value?.slug}
      items={patterns}
      onSearch={(_, value) => _.title.search(
        new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      ) > -1
      }
      callback={(_, k) => {
        const patt = generatePattern({
          root: {
            pattern: _,
            patternVerticalPosition: 0,
            patternHorizontalPosition: 0,
            patternStroke: 1,
            patternZoom: 0,
            patternAngle: 0,
            patternSpacingX: 0,
            patternSpacingY: 0,
            patternColor1: 'rgba(0,0,0,100)',
            patternColor2: 'rgba(0,0,0,100)',
            patternColor3: 'rgba(0,0,0,100)',
            patternColor4: 'rgba(0,0,0,100)',
          },
        });

        return (
          <div
            id={`pattern-${_.slug}`}
            className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl ${
              dialog.value?.slug === _.slug ? 'bg-gray-100' : ''
            }`}
            key={k}
            onClick={(e) => changed(_)}
          >
            <div className="pointer-events-none flex gap-3 items-center h-6 w-full justify-between">
              <div className="w-1/2 truncate ... whitespace-nowrap">
                {_.title}
              </div>
              <div
                className="w-1/2 h-full border border-gray-500 bg-white/50 rounded-lg"
                style={{
                  backgroundImage: patt ? `url(${patt})` : null,
                }}
              ></div>
            </div>
          </div>
        );
      }}
    />
  );
};
