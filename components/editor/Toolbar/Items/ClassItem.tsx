import { useEditor, useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp } from "components/editor/Viewport/lib";
import { RootClassGenProps } from "components/selectors";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { AllStyles, classNameToVar } from "utils/tailwind";

import { ToolbarItemProps } from "../ToolbarItem";
import { Card, CardLight, Wrap } from "../ToolbarStyle";

const Input = ({ value, changed, nodeProps, setProp }) => {
  const classes = Array.isArray(value) ? value : [];
  const [classInput, setClassInput] = useState("");

  const save = (input = null) => {
    const data = (input || classInput)
      .split(" ")
      .filter((_) => !classes.includes(_));

    if (!data.length) return;

    const cl = [...(classes || [])];

    cl.push(...data);

    setClassInput("");

    changed(cl);
  };

  const del = (key) => {
    const cl = [...(classes || [])];

    delete cl[key];

    changed(cl);
  };

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (classInput.length < 2) return;

    const matches = (
      classInput ? AllStyles.filter((s) => s?.includes(classInput)) : []
    ).filter((item) => !classes?.includes(item));

    setMatches(matches);
  }, [classInput, classes]);

  const searched = !!(classInput && matches.length);

  const _nodeProps = nodeProps ? { ...nodeProps } : {};

  const delNodeProp = (prop, view) => {
    Object.keys(nodeProps[view])
      .filter((_) => nodeProps[view][_] === prop)
      .forEach((_) =>
        changeProp({
          propKey: _,
          value: "",
          setProp,
          view,
          propType: view === "root" ? "root" : "class",
        })
      );
  };

  const propClasses = Object.keys(_nodeProps.root || {})
    .filter((_) => _ !== "style")
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .filter((_) => RootClassGenProps.includes(_))
    .map((_) => _nodeProps.root[_]);

  const mobileClasses = Object.keys(_nodeProps.mobile || {})
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .map((_) => _nodeProps.mobile[_]);

  const desktopClasses = Object.keys(_nodeProps.desktop || {})
    .filter((_) => !classes?.includes(_))
    .filter((_) => _ !== "hover")
    .map((_) => _nodeProps.desktop[_]);

  return (
    <div className="relative z-10 gap-6 flex flex-col">
      <label
        htmlFor="search"
        className="text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <input
          type="search"
          id="search"
          className="px-2 py-1 relative z-10 bg-transparent w-full text-sm rounded-md"
          placeholder="Class Search"
          required
          autoComplete="off"
          onChange={(event) => setClassInput(event.target.value)}
          onKeyDown={(e) => {
            // Tab completion
            if (e.key === "Tab" && matches.length > 0) {
              e.preventDefault();
              setClassInput(matches[0]);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              save();
            }
          }}
          value={classInput}
        />
        {/* Ghost text suggestion - behind input */}
        {classInput && matches.length > 0 && matches[0].startsWith(classInput) && (
          <div className="absolute inset-0 pointer-events-none flex items-center px-3 z-0">
            <span className="invisible">{classInput}</span>
            <span className="text-gray-500 font-mono">{matches[0].slice(classInput.length)}</span>
          </div>
        )}
        {/* Background for input */}
        <div className="absolute inset-0 h-7 -z-10 bg-gray-500/50 border border-gray-500 rounded-lg"></div>
        <button
          type="submit"
          className="btn-search"
          onClick={() => save()}
        >
          <TbSearch />
        </button>
      </div>

      {searched && (
        <div className="absolute top-16 bg-gray-700/80 rounded-md w-full p-3 overflow-auto scrollbar h-full space-y-3">
          {matches.map((mat, k) => (
            <div key={k} className={k === 0 ? "ring-2 ring-blue-500 rounded" : ""}>
              <CardLight value={mat} onClick={() => save(mat)} />
            </div>
          ))}
          {matches.length > 0 && (
            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
              Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-white">Tab</kbd> to complete with first result
            </p>
          )}
        </div>
      )}

      <p className="text-xs">Assigned Classes</p>
      <div className="space-y-3 -mt-6">
        {propClasses?.map((_, key) => (
          <Card key={key} value={_} onClick={() => delNodeProp(_, "root")} />
        ))}

        {classes?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => del(key)}
            bgColor="bg-white inside-shadow"
          />
        ))}

        {mobileClasses?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => delNodeProp(_, "mobile")}
            bgColor="bg-green-500 inside-shadow"
          />
        ))}

        {desktopClasses?.map((_, key) => (
          <Card
            key={key}
            value={_}
            onClick={() => delNodeProp(_, "desktop")}
            bgColor="bg-yellow-500 inside-shadow"
          />
        ))}
      </div>

      <p className="text-xs">Legend</p>

      <div className="space-y-3 space-x-1.5 text-black -mt-6">
        <div className="bg-primary-300 px-1 py-0.5 rounded inline-flex text-xxs inside-shadow">
          Component
        </div>
        <div className="bg-white text-black px-1 py-0.5 rounded inline-flex text-xxs inside-shadow">
          User
        </div>
        <div className="bg-green-500 px-1 py-0.5 rounded inline-flex text-xxs inside-shadow">
          Mobile
        </div>
        <div className="bg-yellow-500 px-1 py-0.5 rounded inline-flex text-xxs inside-shadow">
          Desktop
        </div>
      </div>
    </div>
  );
};

export const ClassItem = ({
  full = false,
  propKey,
  ...props
}: ToolbarItemProps) => {
  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props,
    id: node.id,
  }));

  const { query, actions } = useEditor();
  const propValue = (nodeProps || {})[propKey];
  const view = useRecoilValue(ViewAtom);

  const value = propValue;

  const changed = (va) => {
    const remaining = [];

    if (!va.filter((_) => _).length) {
      return changeProp({
        propKey: "className",
        value: [],
        setProp,
        propType: "component",
        query,
        actions,
        nodeId: id,
      });
    }

    va.forEach((value) => {
      const propKey = classNameToVar(value);

      if (propKey) {
        return changeProp({
          propKey,
          value,
          setProp,
          propType: "class",
          view,
          query,
          actions,
          nodeId: id,
        });
      }

      remaining.push(value);
    });

    if (remaining.length) {
      changeProp({
        propKey,
        value: remaining.filter((_) => _),
        setProp,
        propType: "component",
        query,
        actions,
        nodeId: id,
      });
    }
  };

  let lab = value;

  if (props.valueLabels && props.valueLabels[value]) {
    lab = props.valueLabels[value];
  }

  return (
    <Wrap props={props} lab={lab} propKey={propKey}>
      <Input
        nodeProps={{ ...nodeProps }}
        value={value}
        changed={changed}
        setProp={setProp}
      />
    </Wrap>
  );
};
