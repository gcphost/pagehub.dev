import { useEditor, useNode } from "@craftjs/core";
import { changeProp, SearchGpt } from "components/editor/Viewport/lib";

import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import { Tooltip } from "components/layout/Tooltip";
import { useEffect, useRef, useState } from "react";
import { SiOpenai } from "react-icons/si";
import { TbX } from "react-icons/tb";
import { atom, useRecoilValue } from "recoil";
import { ClassGenerator, classNameToVar } from "utils/tailwind";
import { Card, Wrap } from "../ToolbarStyle";

export const GPTAtom = atom({
  key: "gpt",
  default: {
    enabled: false,
  },
});

export const GptInput = ({ autoFocus = false }) => {
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classInput, setClassInput] = useState("");
  const gpt = useRecoilValue(GPTAtom);
  const preview = useRecoilValue(PreviewAtom);
  const view = useRecoilValue(ViewAtom);

  const {
    actions: { setProp },
    propValues,
    id,
  } = useNode((node) => ({
    propValues: node.data.props,
    id: node.id,
  }));

  const { enabled, query, actions } = useEditor((state, query) => ({
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

        console.log({
          propKey,
          value,
          setProp,
          view,
          propType: "root",
        });

        changeProp({
          propKey,
          value,
          setProp,
          view,
          propType: "root",
          query,
          actions,
          nodeId: id,
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
  }, [autoFocus, focusRef]);

  if (!gpt.enabled) return null;

  return (
    <Wrap
      props={{
        ...propValues,
        label: "OpenAI Style Generator",
        labelHide: true,
      }}
    >
      <p className="mb-3"></p>

      {searching && (
        <div className="w-full rounded-lg border-border bg-muted p-3 text-foreground focus:border-primary active:border-primary">
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
                if (e.key === "Enter") {
                  save();
                }
              }}
              className="input"
            />

            <button className="h-fill btn w-20" onClick={() => save()}>
              <SiOpenai />
            </button>
          </div>

          <div>
            {searched && (
              <div className="input scrollbar mt-3 flex max-h-64 flex-row items-center gap-1.5 overflow-auto">
                <button
                  onClick={() => setSearched(false)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <Tooltip content="Close" arrow={false}>
                    <TbX />
                  </Tooltip>
                </button>

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
