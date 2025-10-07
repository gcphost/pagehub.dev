import { useEditor, useNode } from "@craftjs/core";
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

  // Handle both array access (navItems[0].icon) and direct access (icon)
  let value = "";
  if (index !== null && propItemKey) {
    value = nodeProps[propKey]?.[index]?.[propItemKey] || "";
  } else {
    value = nodeProps[propKey] || "";
  }

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <Wrap
      props={{ label, labelHide: true }}
      lab={value}
      propType={propType}
      propKey={propKey}
    >
      <div className="relative">
        <button
          ref={ref}
          title={value}
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
          <div className="pointer-events-none flex gap-3 items-center w-6 h-6 fill-white mx-auto">
            <ClientIconLoader value={value} />
          </div>
        </button>

        {/* Clear button - only show when icon is set */}
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changed("");
            }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
            title="Clear icon"
          >
            ×
          </button>
        )}
      </div>
    </Wrap>
  );
};
