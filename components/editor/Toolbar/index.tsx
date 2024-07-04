import { useEditor } from "@craftjs/core";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SideBarAtom, SideBarOpen } from "utils/lib";
import { PreviewAtom } from "../Viewport";

export * from "./ToolbarDropdown";
export * from "./ToolbarItem";
export * from "./ToolbarSection";

export const Toolbar = () => {
  const [sideBarOpen, setSideBarOpen] = useRecoilState(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      //setSideBarOpen(false);
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
    <div className="bg-gray-700/50 scrollbar w-auto overflow-auto h-screen grow basis-full  pb-24 z-20 gap-12 flex flex-col text-center pt-32"></div>
  );

  const style: any = {
    left: 0,
  };

  if (!sideBarLeft) {
    delete style.left;
    style.right = 0;
  }

  return (
    <motion.div
      animate={sideBarOpen && !preview ? "open" : "closed"}
      initial="closed"
      variants={variants}
      transition={variants.transition}
      key="sideMenu"
      id="toolbar"
      className={`z-40 absolute overflow-hidden w-full grow-0 shrink-0 flex flex-col h-screen  text-white border-x border-violet-500 `}
      style={style}
      ref={ref}
    >
      <div
        className="overflow-hidden w-full antialiased bg-gray-800/90 select-none z-0"
        aria-expanded="false"
      >
        {tool}
      </div>
    </motion.div>
  );
};
