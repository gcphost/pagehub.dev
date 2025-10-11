import { NodeTree, ROOT_NODE, useEditor } from "@craftjs/core";

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
      "inner-shadow flex w-full cursor-pointer items-center gap-y-6 rounded-md p-2 hover:bg-primary hover:text-muted-foreground"
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
    [query],
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
    [actions, getCloneTree, query],
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
        <div className="w-12 text-2xl">{icon}</div> {title}
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
          className="fixed z-50 max-h-[330px] select-none flex-col justify-between gap-3 rounded-md p-3 text-muted-foreground drop-shadow-lg md:flex-row"
        >
          <motion.div
            variants={uloVariants}
            className="scrollbar flex flex-col gap-1.5 overflow-auto rounded-md bg-background"
          >
            <div className="rounded-xl p-3">
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
              className="scrollbar flex flex-col overflow-auto rounded-md bg-background p-3"
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
                      <div className="flex w-full items-center justify-between gap-8">
                        <div className="whitespace-no-wrap flex items-center gap-y-3">
                          <div className="w-12 text-2xl">
                            <TbComponents />
                          </div>
                          {title}
                        </div>
                        <button
                          className="text-sm text-foreground hover:text-muted-foreground"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            // Remove from Background node
                            const rootNode = query.node(ROOT_NODE).get();
                            const backgroundId = rootNode?.data?.nodes?.[0];

                            if (backgroundId) {
                              actions.setProp(backgroundId, (prop) => {
                                prop.savedComponents = (
                                  prop.savedComponents || []
                                ).filter((c) => c.rootNodeId !== _.rootNodeId);
                              });

                              // Update the local state
                              setComponents((prev) =>
                                prev.filter(
                                  (c) => c.rootNodeId !== _.rootNodeId,
                                ),
                              );
                            }
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
