import { useEditor } from "@craftjs/core";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SideBarAtom, SideBarOpen } from "utils/lib";
import { PreviewAtom } from "../Viewport";
import { Header } from "../Viewport/Header";
import { EditorEmptyState } from "./EditorEmptyState";

export * from "./ToolbarDropdown";
export * from "./ToolbarItem";
export * from "./ToolbarSection";

export const Toolbar = () => {
  const [sideBarOpen, setSideBarOpen] = useRecoilState(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      // setSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  const variants = {
    open: { opacity: 1, x: 0, width: "360px" },
    closed: { opacity: 0, x: sideBarLeft ? "-100%" : "100%", width: "0" },
    exit: {
      width: "0",
    },
    transition: { type: "linear", duration: 0.2 },
  };

  const preview = useRecoilValue(PreviewAtom);

  const { related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();

    return {
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  const tool = related?.toolbar ? (
    React.createElement(related.toolbar)
  ) : (
    <EditorEmptyState />
  );

  const style: any = {
    left: 0,
    zIndex: 999,
  };

  if (!sideBarLeft) {
    delete style.left;
    style.right = 0;
  }

  return (
    <motion.aside
      role="complementary"
      aria-label="Component settings"
      animate={sideBarOpen && !preview ? "open" : "closed"}
      initial="closed"
      variants={variants}
      transition={variants.transition}
      key="sideMenu"
      id="toolbar"
      className={
        "absolute flex h-screen w-full shrink-0 grow-0 flex-col overflow-hidden border-x border-border bg-background text-foreground shadow-lg"
      }
      style={style}
      ref={ref}
    >
      <Header />
      <div
        className="z-0 flex w-full flex-1 flex-col select-none overflow-hidden bg-background text-foreground antialiased"
        aria-expanded={sideBarOpen && !preview ? "true" : "false"}
      >
        {tool}
      </div>
    </motion.aside>
  );
};
