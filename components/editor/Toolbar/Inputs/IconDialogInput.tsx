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
  inline = true,
  labelWidth = "",
  inputWidth = "",
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
      inline={inline}
      inputWidth={inputWidth}
      labelWidth={labelWidth}
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
          <div className="pointer-events-none mx-auto flex size-4 items-center gap-3 fill-white">
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
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground hover:bg-destructive/90"
            title="Clear icon"
          >
            ×
          </button>
        )}
      </div>
    </Wrap>
  );
};
