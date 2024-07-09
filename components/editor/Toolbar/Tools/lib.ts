import { useEditor, useNode } from "@craftjs/core";
import { getRect } from "components/editor/Viewport/useRect";
import { useEffect } from "react";

import { ViewAtom } from "components/editor/Viewport";
import { getProp } from "components/editor/Viewport/lib";
import throttle from "lodash.throttle";
import { useRecoilValue } from "recoil";

export const useTypeProps = () => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
  }));

  return { setProp, nodeProps };
};

export const useGetTypeProp = (props = {}, nodeProps) => {
  const view = useRecoilValue(ViewAtom);

  return getProp(props, view, nodeProps);
};

export const useDialog = (dialog, setDialog, ref, propKey = "") => {
  const scroll = () => {
    if (!dialog.enabled || !dialog.propKey || dialog.propKey !== propKey)
      return;

    setDialog({ ...dialog, e: getRect(ref.current) });
  };

  useEffect(() => {
    document
      .querySelector('[data-toolbar="true"]')
      ?.addEventListener("scroll", throttle(scroll, 20));

    return () => {
      document
        .querySelector('[data-toolbar="true"]')
        ?.removeEventListener("scroll", scroll);
    };
  }, [ref.current, dialog.enabled]);
};

export const useGetNode = () => {
  const { id } = useNode();

  const { query } = useEditor();

  return query.node(id).get() || ({} as any);
};
