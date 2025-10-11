import { NodeTree, ROOT_NODE, useEditor, useNode } from "@craftjs/core";
import { checkIfAncestorLinked } from "components/editor/componentUtils";
import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import {
  TbCaretUp,
  TbComponents,
  TbComponentsOff,
  TbCopy,
  TbScaleOutline,
  TbScaleOutlineOff,
  TbTrash,
  TbTrashOff,
  TbX,
} from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import {
  ComponentsAtom,
  IsolateAtom,
  SideBarOpen,
  isolatePage,
} from "utils/lib";
import {
  addHandler,
  buildClonedTree,
  deleteNode,
  saveHandler,
} from "../Viewport/lib";
import { RenderChildren } from "./Helpers/CloneHelper";
import Tab from "./Tab";
import { ToolbarTitleEditor } from "./ToolbarTitleEditor";

// Anti-aliasing style for scale animations to prevent blurriness
const scaleAnimationStyle = {
  willChange: "transform" as const,
  backfaceVisibility: "hidden" as const,
  WebkitFontSmoothing: "antialiased" as const,
};

export const ToolbarWrapper = ({ children = null, head, foot = "" }) => {
  const { query, actions } = useEditor();
  const [components, setComponents] = useRecoilState(ComponentsAtom);

  const { parent, deletable, props, nodeData } = useNode((node) => ({
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
    nodeData: node.data,
  }));

  const {
    actions: { setProp },
  } = useEditor();

  const { id } = useNode();
  const active = id;

  const getCloneTree = useCallback(
    (tree: NodeTree) =>
      buildClonedTree({ tree, query, setProp, createLinks: false }),
    [query, setProp],
  );

  const handleSaveTemplate = useCallback(
    (component = null) => saveHandler({ query, id, component, actions }),
    [id, query, actions],
  );

  const handleAdd = useCallback(() => {
    addHandler({
      actions,
      query,
      getCloneTree,
      id,
      setProp,
    });
  }, [actions, getCloneTree, id, query, setProp]);

  const handleClone = async (e) => {
    e.preventDefault();

    try {
      await handleSaveTemplate();
      handleAdd();
    } catch (e) {
      console.error(e);
    }
  };

  const [isolate, setIsolate] = useRecoilState(IsolateAtom);
  const setSideBarOpen = useSetRecoilState(SideBarOpen);
  const settings = useRecoilValue(SettingsAtom);

  useEffect(() => {
    const iso = localStorage.getItem("isolated");
    if (iso) setIsolate(iso);
  }, [setIsolate]);

  const ref = useRef();

  const canMake = !(components || []).find((_) => _.rootNodeId === id);

  // Check if this node or ANY ancestor is a fully linked component (not style mode)
  const isLinked = checkIfAncestorLinked(id, query);

  return (
    <div className="flex h-full flex-col">
      <h1 className="shrink-0 border-b border-border bg-card px-3 py-2 text-lg font-bold text-card-foreground">
        <ToolbarTitleEditor />
      </h1>

      {/* Hide settings tabs for fully linked components */}
      {!isLinked && (
        <div
          id="toolbarTabs"
          aria-label="Tabs"
          role="tablist"
          className="flex shrink-0 flex-wrap items-center justify-between gap-1.5 border-b border-border bg-secondary px-3 py-0.5 text-center font-semibold text-secondary-foreground"
        >
          <div className="ml-auto flex flex-row-reverse items-center justify-between gap-3">

            {head.map((_, key) => (
              <Tab key={key} title={_.title} tabId={_.title} icon={_.icon} />
            ))}
          </div>
        </div>
      )}

      <div
        id="toolbarItems"
        data-toolbar={true}
        className="flex min-h-0 flex-1 flex-col"
      >
        <RenderChildren props={props} query={query} actions={actions} id={id}>
          {children}
        </RenderChildren>
      </div>

      <div className="flex w-full shrink-0 flex-row items-center justify-between border-t border-t-border bg-muted p-0 px-6 text-xl">
        {foot}

        {id !== ROOT_NODE && (
          <Tooltip content="Select Parent">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-accent-foreground"
              style={scaleAnimationStyle}
              onClick={() => {
                actions.selectNode(parent);
              }}
            >
              <TbCaretUp />
            </motion.button>
          </Tooltip>
        )}

        {(props.type === "page" || isolate) && (
          <Tooltip
            content={!isolate ? "Isolate Page" : "Show All Pages"}
            onClick={() =>
              isolatePage(isolate, query, active, actions, setIsolate)
            }
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`cursor-pointer ${isolate ? "text-accent-foreground" : "text-muted-foreground"
                } rounded-md p-2 hover:text-accent-foreground`}
              style={scaleAnimationStyle}
            >
              {isolate ? <TbScaleOutlineOff /> : <TbScaleOutline />}
            </motion.div>
          </Tooltip>
        )}

        {deletable && (
          <>
            <Tooltip
              content={props.canDelete ? "Delete" : "Unable to delete"}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // Blur any active contentEditable element to exit edit mode
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                if (props.canDelete)
                  deleteNode(query, actions, active, settings);
              }}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-accent-foreground"
                style={scaleAnimationStyle}
              >
                {props.canDelete ? <TbTrash /> : <TbTrashOff />}
              </motion.div>
            </Tooltip>

            {/* Hide Clone and Create Component buttons for linked components */}
            {!isLinked && (
              <>
                <Tooltip
                  content="Clone"
                  onClick={(e: React.MouseEvent) => {
                    handleClone(e);
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-accent-foreground"
                    style={scaleAnimationStyle}
                  >
                    <TbCopy />
                  </motion.div>
                </Tooltip>

                <Tooltip
                  content={`${canMake ? "Create Component" : "Component Exists"}`}
                  onClick={async (e: React.MouseEvent) => {
                    const comp = await handleSaveTemplate("component");

                    setComponents([...components, comp]);
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    ref={ref}
                    className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-accent-foreground"
                    style={scaleAnimationStyle}
                  >
                    {canMake ? <TbComponents /> : <TbComponentsOff />}
                  </motion.div>
                </Tooltip>
              </>
            )}
          </>
        )}

        {id !== ROOT_NODE && (
          <Tooltip
            content="Close"
            onClick={() => {
              actions.selectNode(null);
              setSideBarOpen(false);
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer rounded-md p-2 text-muted-foreground hover:text-accent-foreground"
              style={scaleAnimationStyle}
            >
              <TbX />
            </motion.div>
          </Tooltip>
        )}

        {id === ROOT_NODE && (
          <button
            className="btn r text-foreground-muted w-full p-2 text-base font-medium"
            onClick={() => {
              actions.selectNode(null);
              setSideBarOpen(false);
            }}
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
