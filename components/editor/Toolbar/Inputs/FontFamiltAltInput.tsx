import { useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { getRect } from "components/editor/Viewport/useRect";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { getStyleSheets } from "utils/lib";
import { Wrap } from "../ToolbarStyle";
import { FontFamilyDialogAtom } from "../Tools/FontFamilyDialog";
import { useDialog } from "../Tools/lib";

export const FontFamiltAltInput = ({
  propKey,
  label = "",
  prefix = "",
  index = null,
  propItemKey = "",
  propType = "class",
}) => {
  const [dialog, setDialog] = useRecoilState(FontFamilyDialogAtom);

  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  const value = nodeProps.root ? nodeProps.root[propKey] || "" : null;

  const changed = (value) => {
    changeProp({
      propType: "root",
      propKey,
      value,
      setProp,
      index,
      propItemKey,
    });
  };

  const tw = require("utils/tailwind");

  const families = tw.fonts
    .reduce((acc, font) => {
      const family = font[0].replace(/ +/g, "+");
      const weights = [400].join(",");

      return [...acc, family + (weights && `:${weights}`)];
    }, [])
    .join("|");

  const sheetrefs = getStyleSheets();

  let href = `https://fonts.googleapis.com/css?family=${families}`;
  href += "&display=swap";
  if (!sheetrefs.includes(href)) {
    const head = document.getElementsByTagName("HEAD")[0];

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;

    head.appendChild(link);
  }

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <div ref={ref}>
      <Wrap
        props={{ label, labelHide: true }}
        lab={value}
        propType={propType}
        propKey={propKey}
      >
        <button
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
          style={{ fontFamily: value ? value.join(", ") : null }}
          className="input"
        >
          {value ? value.join(", ") : "Default"}
        </button>
      </Wrap>
    </div>
  );
};
