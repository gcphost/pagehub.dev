import { useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { getRect } from "components/editor/Viewport/useRect";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { Wrap } from "../ToolbarStyle";
import ClientIconLoader from "../Tools/ClientIconLoader";
import { IconDialogAtom } from "../Tools/IconDialog";
import { useDialog } from "../Tools/lib";

export const IconDialogInput = ({
  propKey,
  label = "",
  prefix = "",
  index = null,
  propItemKey = "",
  propType = "class",
}) => {
  const [dialog, setDialog] = useRecoilState(IconDialogAtom);

  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  const changed = (value) => {
    changeProp({
      propType,
      propKey,
      value,
      setProp,
      index,
      propItemKey,
    });
  };

  const value = nodeProps[propKey][index][propItemKey] || "";

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
        <div
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
          className="input "
        >
          <div className="pointer-events-none flex gap-3 items-center w-6 h-6 fill-white">
            <ClientIconLoader value={value} />
          </div>
        </div>
      </Wrap>
    </div>
  );
};
