import { useEditor, useNode } from "@craftjs/core";
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
  inline = true,
  inputWidth = "",
  labelWidth = "",
}) => {
  const [dialog, setDialog] = useRecoilState(FontFamilyDialogAtom);
  const { actions, query } = useEditor();

  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
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
      query,
      actions,
      nodeId: id,
    });
  };

  const tw = require("utils/tailwind");

  // Load all font families with Google Fonts CSS2 API for better performance
  const families = tw.fonts
    .map((font) => {
      const family = font[0].replace(/ +/g, "+");
      return `family=${family}:wght@400`;
    })
    .join("&");

  const sheetrefs = getStyleSheets();

  let href = `https://fonts.googleapis.com/css2?${families}`;
  href += "&display=swap";

  if (!sheetrefs.includes(href)) {
    const head = document.getElementsByTagName("HEAD")[0];

    // Use preload pattern for faster font loading
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "style";
    preloadLink.href = href;

    // Convert to stylesheet after loading
    preloadLink.onload = function () {
      (this as HTMLLinkElement).onload = null;
      (this as HTMLLinkElement).rel = "stylesheet";
    };

    head.appendChild(preloadLink);
  }

  const ref = useRef(null);

  useDialog(dialog, setDialog, ref, propKey);

  return (
    <div ref={ref}>
      <Wrap
        props={{
          label,
          labelHide: false,
          showDeleteIcon: true, // Show X icon instead of font name
          showVarSelector: true, // Show design var selector
          varSelectorPrefix: "font", // For font-[var(--ph-...)]
        }}
        lab={value}
        viewValue="component" // Font is always stored in root
        propType="root" // Font is always stored in root, not class
        propKey={propKey}
        inline={inline}
        inputWidth={inputWidth}
        labelWidth={labelWidth}
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
          style={{ fontFamily: value ? (Array.isArray(value) ? value.join(", ") : value) : null }}
          className="input"
        >
          {value ? (Array.isArray(value) ? value.join(", ") : value) : "Default"}
        </button>
      </Wrap>
    </div>
  );
};
