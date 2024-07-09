import {
  NodeTree, ROOT_NODE, useEditor, useNode
} from '@craftjs/core';
import { Tooltip } from 'components/layout/Tooltip';
import { motion } from 'framer-motion';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
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
} from 'react-icons/tb';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { SettingsAtom } from 'utils/atoms';
import {
  ComponentsAtom,
  IsolateAtom,
  SideBarOpen,
  isolatePage,
} from 'utils/lib';
import { Header } from '../Viewport/Header';
import {
  addHandler,
  buildClonedTree,
  deleteNode,
  saveHandler,
} from '../Viewport/lib';
import { RenderChildren } from './Helpers/CloneHelper';
import Tab from './Tab';
import { ToolbarTitleEditor } from './ToolbarTitleEditor';

export const ToolbarWrapper = ({ children = null, head, foot = '' }) => {
  const { query, actions } = useEditor();
  const [components, setComponents] = useRecoilState(ComponentsAtom);

  const {
    parent, deletable, props, nodeData
  } = useNode((node) => ({
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
    (tree: NodeTree) => buildClonedTree({ tree, query, setProp }),
    [query]
  );

  const handleSaveTemplate = useCallback(
    (component = null) => saveHandler({ query, id, component }),
    [id, query]
  );

  const handleAdd = useCallback(() => {
    addHandler({
      actions, query, getCloneTree, id, setProp
    });
  }, [actions, getCloneTree, query]);

  const handleClone = (e) => {
    e.preventDefault();

    try {
      handleSaveTemplate();
      handleAdd();
    } catch (e) {
      console.error(e);
    }
  };

  const [isolate, setIsolate] = useRecoilState(IsolateAtom);
  const setSideBarOpen = useSetRecoilState(SideBarOpen);
  const settings = useRecoilValue(SettingsAtom);

  useEffect(() => {
    const iso = localStorage.getItem('isolated');
    if (iso) setIsolate(iso);
  }, []);

  const ref = useRef();

  const canMake = !(components || [].find((_) => _.rootNodeId === id));

  const [showProps, setShowProps] = useState(false);

  return (
    <>
      <Header />

      <h1 className="font-bold text-2xl p-3  bg-gray-700 w-full z-50 border-gray-800 border-b">
        {<ToolbarTitleEditor />}
      </h1>

      <div className="border-b border-b-gray-800 font-semibold items-center flex justify-between">
        <div
          aria-label="Tabs"
          role="tablist"
          className="flex text-center flex-wrap gap-1.5"
        >
          {head.map((_, key) => (
            <Tab key={key} title={_.title} tabId={_.title} icon={_.icon} />
          ))}
        </div>
      </div>

      <div
        id="toolbarItems"
        data-toolbar={true}
        className="bg-gray-700/90 w-full top-[138px] h-screen grow basis-full z-20 flex flex-col"
      >
        <RenderChildren
          props={props}
          children={children}
          query={query}
          actions={actions}
          id={id}
        />
      </div>

      <div className="z-30 absolute bottom-0 left-0 right-0  w-full bg-gray-700 h-[64px] p-3 border-t border-t-gray-900 flex flex-row items-center justify-between text-xl">
        {foot}

        {id !== ROOT_NODE && (
          <Tooltip content="Select Parent">
            <motion.button
              whileHover={{
                scale: 1.3,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer text-gray-400 hover:text-white  rounded-md p-3"
              onClick={() => {
                actions.selectNode(parent);
              }}
            >
              <TbCaretUp />
            </motion.button>
          </Tooltip>
        )}

        {(props.type === 'page' || isolate) && (
          <Tooltip content={!isolate ? 'Isolate Page' : 'Show All Pages'}>
            <motion.div
              whileHover={{
                scale: 1.3,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              className={`cursor-pointer ${
                isolate ? 'text-white' : 'text-gray-400'
              } hover:text-white  rounded-md p-3`}
              onClick={() => isolatePage(isolate, query, active, actions, setIsolate)
              }
            >
              {isolate ? <TbScaleOutlineOff /> : <TbScaleOutline />}
            </motion.div>
          </Tooltip>
        )}

        {deletable && (
          <>
            <Tooltip content={props.canDelete ? 'Delete' : 'Unable to delete'}>
              <motion.button
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer text-gray-400 hover:text-white  rounded-md p-3"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!props.canDelete) return;
                  return deleteNode(query, actions, active, settings);
                }}
              >
                {props.canDelete ? <TbTrash /> : <TbTrashOff />}
              </motion.button>
            </Tooltip>

            <Tooltip content="Clone">
              <motion.button
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer text-gray-400 hover:text-white  rounded-md p-3"
                onClick={(e: React.MouseEvent) => {
                  handleClone(e);
                }}
              >
                <TbCopy />
              </motion.button>
            </Tooltip>

            <Tooltip
              content={`${canMake ? 'Create Component' : 'Component Exists'}`}
            >
              <motion.button
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                ref={ref}
                className="cursor-pointer text-gray-400 hover:text-white  rounded-md p-3"
                onClick={(e: React.MouseEvent) => {
                  const comp = handleSaveTemplate('component');

                  setComponents([...components, comp]);
                }}
              >
                {canMake ? <TbComponents /> : <TbComponentsOff />}
              </motion.button>
            </Tooltip>
          </>
        )}

        {id !== ROOT_NODE && (
          <Tooltip content="Close">
            <motion.button
              whileHover={{
                scale: 1.3,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer text-gray-400 hover:text-white  rounded-md p-3"
              onClick={() => {
                actions.selectNode(null);
                setSideBarOpen(false);
              }}
            >
              <TbX />
            </motion.button>
          </Tooltip>
        )}

        {id === ROOT_NODE && (
          <button
            className="w-full btn text-base font-medium r py-2"
            onClick={() => {
              actions.selectNode(null);
              setSideBarOpen(false);
            }}
          >
            Done
          </button>
        )}
      </div>
    </>
  );
};
