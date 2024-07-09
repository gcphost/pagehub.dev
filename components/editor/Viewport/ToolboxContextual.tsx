import { NodeTree, useEditor } from "@craftjs/core";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsInputCursorText } from "react-icons/bs";
import { FaFont } from "react-icons/fa";
import {
  TbBrandYoutube,
  TbCode,
  TbColumns,
  TbComponents,
  TbForms,
  TbId,
  TbLayout,
  TbLayoutColumns,
  TbLayoutRows,
  TbLine,
  TbPhoto,
  TbRectangle,
  TbTrash,
} from "react-icons/tb";
import { useRecoilState } from "recoil";
import { removeComponentFromStorage } from "utils/craft";
import { ComponentsAtom } from "utils/lib";
import { ToolboxMenu } from "../RenderNode";
import { AddElement, Tools } from "./Toolbox/lib";
import { addHandler, buildClonedTree } from "./lib";

const generate = require("boring-name-generator");

export const ulVariants = {
  open: {
    opacity: 1,
    display: "flex",
    // visibility: "visible",
    transition: {
      staggerChildren: 0.17,
      delayChildren: 0.1,
      staggerDirection: 1,
    },
  },
  closed: {
    opacity: 0,
    display: "none",
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
  transition: { type: "linear", duration: 0.4 },

  initial: { display: "none", opacity: 0 },
};

export const uloVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerDirection: 1,
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    opacity: 0,
    transition: {
      staggerDirection: -1,
      y: { stiffness: 1000 },
    },
  },
};

export const liVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      staggerDirection: 1,
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: "-100%",
    opacity: 0,
    transition: {
      staggerDirection: -1,
      y: { stiffness: 1000 },
    },
  },
};

const Item = ({ children }) => (
  <motion.a
    variants={liVariants}
    className={
      "flex w-full items-center gap-y-6  p-2  hover:text-gray-300 inner-shadow  rounded-md hover:bg-violet-500  cursor-pointer"
    }
  >
    {children}
  </motion.a>
);

export const ToolboxContexual = ({ userStyle = null }) => {
  const [menu, setMenu] = useRecoilState(ToolboxMenu);
  const [components, setComponents] = useRecoilState(ComponentsAtom);

  const { actions, query } = useEditor();

  const { id } = menu;
  const active = id;
  const ref = useRef(null);
  const props: any = menu.parent.props;
  const name = menu?.parent?.name || "";

  const click = (ele, nodeTree = null) => {
    const nss = query.node(active).get();
    const { position, y } = menu;
    if (!nss) return;

    // data for the node i clicked
    const { data, id } = nss;

    let theNode = nss;
    let indexToAdd = y > window.innerHeight / 2 ? nss.data.nodes.length : 0;

    if (data.parent) {
      theNode = query.node(data.parent).get();

      // while (!["Container", "Background"].includes(theNode.data.name)) {
      //   if (!data.parent) break;
      theNode = query.node(data.parent).get();
      // }

      // the node is now my parent node

      indexToAdd = theNode.data.nodes.indexOf(active);
    }

    let index = -1;

    if (position === "inside") {
      index = indexToAdd;
    }

    if (position === "after") {
      index = indexToAdd + 1;
    }

    if (position === "before") {
      index = indexToAdd;
    }

    const newElement = AddElement({
      element: ele,
      addTo: position === "inside" ? id : theNode.id,
      index,
      actions,
      query,
    });

    if (newElement) {
      setMenu({ ...menu, enabled: false });
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setMenu({ ...menu, enabled: false });
    }
  };

  const getCloneTree = useCallback(
    (tree: NodeTree) =>
      buildClonedTree({ tree, query, setProp: actions.setProp }),
    [query]
  );

  const handleAdd = useCallback(
    (data = null) => {
      addHandler({
        actions,
        query,
        getCloneTree,
        id,
        data,
        setProp: actions.setProp,
      });
    },
    [actions, getCloneTree, query]
  );

  const comps = components
    .map((_, k) => {
      const nodes = JSON.parse(_.nodes);
      const node = nodes[Object.keys(nodes)[0]];

      if (
        (menu?.parent?.displayName === "Background" &&
          node.props?.type !== "page") ||
        (menu?.parent?.displayName !== "Background" &&
          node.props?.type === "page")
      ) {
        return;
      }

      return { id: _, node };
    })
    .filter((_) => _);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [menu.enabled, ref]);

  const height = name === "Background" ? 100 : 300;
  const width = comps.length ? 500 : 240;

  const [style, setStyle] = useState({} as any);

  useEffect(() => {
    const winH = window.innerHeight;
    const winW = window.innerWidth;
    const { x, y } = menu;
    const sty = { left: x, top: y } as any;

    if (y + height > winH) {
      delete sty.top;
      sty.bottom = 0;
    }

    if (x + width > winW) {
      delete sty.left;
      sty.right = 0;
    }

    setStyle(sty);
  }, [menu]);

  const Tool = ({ element, icon, title }) => (
    <button onClick={() => click(element)}>
      <Item>
        <div className="text-2xl w-12">{icon}</div> {title}
      </Item>
    </button>
  );

  const containerTools = (
    <>
      <Tool
        element={Tools.rowContainer}
        icon={<TbLayoutRows />}
        title="Row Container"
      />
      <Tool
        element={Tools.columnContainer}
        icon={<TbLayoutColumns />}
        title="Column Container"
      />
      <Tool
        element={Tools.twoColumnContainer}
        icon={<TbColumns />}
        title="Two Column Layout"
      />
      <Tool
        element={Tools.imageContainer}
        icon={<TbId />}
        title="Image Container"
      />
    </>
  );

  return (
    <AnimatePresence>
      {menu.enabled && (
        <motion.div
          animate={menu.enabled ? "open" : "closed"}
          variants={ulVariants}
          exit="closed"
          initial="closed"
          key="toolbox"
          id="toolbox"
          ref={ref}
          style={style}
          className="fixed z-50  p-3 rounded-md drop-shadow-lg  gap-3  flex-col md:flex-row   justify-between text-gray-300 max-h-[330px] select-none"
        >
          <motion.div
            variants={uloVariants}
            className="overflow-auto scrollbar rounded-md  bg-gray-800/80 flex flex-col gap-1.5"
          >
            <div className="p-3 rounded-xl">
              {name === "Background" && (
                <>
                  <Tool element={Tools.page} icon={<TbLayout />} title="Page" />

                  {containerTools}
                </>
              )}
              {!["Background"].includes(name) && (
                <>
                  {name === "FormDrop" && (
                    <>
                      <Tool
                        element={Tools.formElement}
                        icon={<BsInputCursorText />}
                        title="Form Input"
                      />
                      <Tool
                        element={Tools.text}
                        icon={<FaFont />}
                        title="Text"
                      />
                    </>
                  )}

                  <Tool
                    element={Tools.image}
                    icon={<TbPhoto />}
                    title="Image"
                  />

                  <Tool element={Tools.text} icon={<FaFont />} title="Text" />

                  <Tool
                    element={Tools.button}
                    icon={<TbRectangle />}
                    title="Buttons"
                  />
                  <Tool
                    element={Tools.video}
                    icon={<TbBrandYoutube />}
                    title="Video"
                  />

                  <Tool
                    element={Tools.embed}
                    icon={<TbCode />}
                    title="Embed Code"
                  />

                  <Tool
                    element={Tools.divider}
                    icon={<TbLine />}
                    title="Divider"
                  />

                  <Tool element={Tools.form} icon={<TbForms />} title="Form" />

                  {containerTools}
                </>
              )}
            </div>
          </motion.div>

          {!["Form", "FormDrop"].includes(name) && comps.length ? (
            <motion.div
              variants={uloVariants}
              className="overflow-auto scrollbar flex flex-col bg-gray-800/80  p-3 rounded-md"
            >
              {comps.map((a, k) => {
                if (!a.id || !a.node) return null;

                const _ = a.id;
                const node = a.node;

                const title = node.custom.displayName || node.displayName;

                return (
                  <button
                    key={k}
                    onClick={() => {
                      handleAdd(_);
                      setMenu({ ...menu, enabled: false });
                    }}
                    className="flex items-center gap-y-3"
                  >
                    <Item>
                      <div className="flex items-center justify-between w-full gap-8">
                        <div className="flex items-center gap-y-3 whitespace-no-wrap">
                          <div className="text-2xl w-12">
                            <TbComponents />
                          </div>
                          {title}
                        </div>
                        <button
                          className="text-white hover:text-gray-200 text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            removeComponentFromStorage(
                              _.rootNodeId,
                              components,
                              setComponents
                            );
                          }}
                        >
                          <TbTrash />
                        </button>
                      </div>
                    </Item>
                  </button>
                );
              })}
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
