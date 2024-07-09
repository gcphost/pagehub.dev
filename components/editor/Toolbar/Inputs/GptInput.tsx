import { useEditor, useNode } from '@craftjs/core';
import { changeProp, SearchGpt } from 'components/editor/Viewport/lib';

import { PreviewAtom, ViewAtom } from 'components/editor/Viewport';
import { Tooltip } from 'components/layout/Tooltip';
import { useEffect, useRef, useState } from 'react';
import { SiOpenai } from 'react-icons/si';
import { TbX } from 'react-icons/tb';
import { atom, useRecoilValue } from 'recoil';
import { ClassGenerator, classNameToVar } from 'utils/tailwind';
import { Card, Wrap } from '../ToolbarStyle';

export const GPTAtom = atom({
  key: 'gpt',
  default: {
    enabled: true,
  },
});

export const GptInput = ({ autoFocus = false }) => {
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classInput, setClassInput] = useState('');
  const gpt = useRecoilValue(GPTAtom);
  const preview = useRecoilValue(PreviewAtom);
  const view = useRecoilValue(ViewAtom);

  const {
    actions: { setProp },
    propValues,
  } = useNode((node) => ({
    propValues: node.data.props,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const cs = ClassGenerator(propValues, view, enabled, [], [], preview);

  const save = async () => {
    setSearched(false);
    setClasses([]);
    setSearching(true);

    let results: any = {};

    try {
      results = await SearchGpt(classInput, cs);
    } catch (e) {
      console.error(e);
      setSearching(false);
    }

    const rest = results.result;

    const classes = saveclass(rest);
    setClasses(classes);
    setSearched(true);
    setSearching(false);
  };

  const saveclass = (rest) => {
    if (!rest) return [];

    const classes = rest
      .map((value) => {
        const propKey = classNameToVar(value);

        if (!propKey) return;

        changeProp({
          propKey,
          value,
          setProp,
          view,
          propType: 'root',
        });

        return value;
      })
      .filter((_) => _);

    return classes;
  };

  const del = (key) => {
    const cl = [...classes];
    delete cl[key];
    const re = cl.filter((_) => _);

    saveclass(re);

    if (!re.length) setSearched(false);

    setClasses(re);
  };

  const focusRef = useRef(null);

  useEffect(() => {
    if (!autoFocus) return;
    const time = setTimeout(() => focusRef?.current?.focus(), 50);

    return () => clearTimeout(time);
  }, [focusRef]);

  if (!gpt.enabled) return null;

  return (
    <Wrap
      props={{
        ...propValues,
        label: 'OpenAI Style Generator',
        labelHide: true,
      }}
    >
      <p className="mb-3"></p>

      {searching && (
        <div className="bg-gray-500/50 p-3 text-white border-gray-500 w-full rounded-lg active:border-violet-500 focus:border-violet-500">
          <strong>OpenAI</strong> is working on your styles.
        </div>
      )}

      {!searching && (
        <>
          <div className="flex gap-3">
            <input
              ref={focusRef}
              type="text"
              value={classInput}
              placeholder="white text black background"
              onChange={(event) => setClassInput(event.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  save();
                }
              }}
              className="input"
            />

            <button className="h-fill w-20 btn" onClick={() => save()}>
              <SiOpenai />
            </button>
          </div>

          <div>
            {searched && (
              <div className="mt-3 items-center input overflow-auto scrollbar max-h-64 gap-1.5 flex flex-row">
                <div
                  onClick={() => setSearched(false)}
                  className=" text-gray-400 cursor-pointer hover:text-white"
                >
                  <Tooltip content="Close" arrow={false}>
                    <TbX />
                  </Tooltip>
                </div>

                {!classes?.length ? (
                  <div className="text-sm">No results</div>
                ) : null}

                {classes?.map((_, key) => (
                  <Card key={key} value={_} onClick={() => del(key)} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Wrap>
  );
};
