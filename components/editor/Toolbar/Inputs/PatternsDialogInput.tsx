import { useEditor, useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { getRect } from "components/editor/Viewport/useRect";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { generatePattern } from "utils/lib";
import { Wrap } from "../ToolbarStyle";
import { useDialog } from "../Tools/lib";
import { PatternDialogAtom } from "../Tools/PatternDialog";

export const PatternsDialogInput = ({
  propKey,
  label = "",
  prefix = "",
  index = null,
  propItemKey = "",
  propType = "class",
}) => {
  const [dialog, setDialog] = useRecoilState(PatternDialogAtom);
  const { actions, query } = useEditor();

  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
  }));

  const changed = (value) => {
    changeProp({
      propType,
      propKey,
      value,
      setProp,
      index,
      propItemKey,
      query,
      actions,
      nodeId: id,
    });
  };

  const value = nodeProps.root ? nodeProps.root[propKey] || "" : null;

  let patt;

  if (value) {
    patt = generatePattern({
      root: {
        pattern: value,
        patternVerticalPosition: 0,
        patternHorizontalPosition: 0,
        patternStroke: 1,
        patternZoom: 0,
        patternAngle: 0,
        patternSpacingX: 0,
        patternSpacingY: 0,
        patternColor1: "rgba(0,0,0,100)",
        patternColor2: "rgba(0,0,0,100)",
        patternColor3: "rgba(0,0,0,100)",
        patternColor4: "rgba(0,0,0,100)",
      },
    });
  }

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <div ref={ref}>
      <Wrap
        props={{ label, labelHide: true }}
        lab={value?.name}
        propType={propType}
        propKey={propKey}
      >
        <button
          title={value?.name}
          onClick={(e) => {
            setDialog({
              enabled: true,
              value,
              prefix,
              propKey,
              changed,
              e: getRect(ref.current),
            });
          }}
          className="input"
        >
          <div className="pointer-events-none flex h-6 items-center justify-between gap-3">
            <div className="... w-1/2 truncate whitespace-nowrap">
              {value?.title || null}
            </div>
            {patt && (
              <div
                className="h-full w-1/2 rounded-lg border border-border bg-background"
                style={{ backgroundImage: patt ? `url(${patt})` : null }}
              ></div>
            )}
          </div>
        </button>
      </Wrap>
    </div>
  );
};
