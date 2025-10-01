import { useEditor } from "@craftjs/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { TbContainer, TbNote, TbPlus } from "react-icons/tb";
import { useRecoilState, useRecoilValue } from "recoil";
import { ComponentsAtom, SideBarAtom, SideBarOpen } from "utils/lib";
import { PreviewAtom } from ".";
import { ToolboxMenu } from "../RenderNode";
import DelayedMouseEnter from "./Toolbox/DelayedMouseEnter";
import {
  activeMenuContainerVariants,
  containerVariants,
  iconVariants,
  subMenuItemVariants,
} from "./Toolbox/animations";
import { ButtonToolbox } from "./Toolbox/buttonComponents";
import { DividerToolbox } from "./Toolbox/dividerComponents";
import { EmbedToolbox } from "./Toolbox/embedComponents";
import { FormToolbox } from "./Toolbox/formComponents";
import { FormElementToolbox } from "./Toolbox/formElement";
import { ImageToolbox } from "./Toolbox/imageComponents";
import { pageToolboxItems } from "./Toolbox/pageComponents";
import { sectionToolboxItems } from "./Toolbox/sectionComponents";
import { textToolboxItems } from "./Toolbox/textComponents";
import { VideoToolbox } from "./Toolbox/videoComponents";
import {
  TbActiveItemAtom,
  TbActiveMenuAtom,
  TbActiveSubItemAtom,
} from "./atoms";

export const Toolbox = ({ userStyle = null }) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [menu, setMenu] = useRecoilState(ToolboxMenu);
  const [components, setComponents] = useRecoilState(ComponentsAtom);
  const sideBarOpen = useRecoilValue(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);
  const [preview, setPreview] = useRecoilState(PreviewAtom);

  // const { id } = menu;

  const [activeMenu, setActiveMenu] = useRecoilState(TbActiveMenuAtom);
  const [activeItem, setActiveItem] = useRecoilState(TbActiveItemAtom);
  const [activeSubItem, setActiveSubItem] = useRecoilState(TbActiveSubItemAtom);

  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [menu.enabled, ref]);

  const parent = menu.parent;

  const comps =
    components ||
    []
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

  const items = [
    {
      title: "Components",
      icon: <TbPlus />,
      items: [
        textToolboxItems,
        ButtonToolbox,
        ImageToolbox,
        VideoToolbox,
        FormToolbox,
        FormElementToolbox,
        DividerToolbox,
        EmbedToolbox,
      ],
    },
    {
      title: "Sections",
      icon: <TbContainer />,
      items: sectionToolboxItems,
    },
    {
      title: "Pages",
      icon: <TbNote />,
      items: pageToolboxItems,
    },
  ];

  //  if (!parent) delete items[0];

  //  let pos = "right-0";
  // let pos = "top-1/2 -mt-32";

  let pos = "left-0";

  if (!sideBarLeft) {
    pos = " right-0";
  }

  if (sideBarOpen) {
    if (!sideBarLeft) {
      pos += " right-[366px]";
    } else pos += " left-[366px]";
  }

  const iconList = Object.keys(items).map((_, k) => (
    <DelayedMouseEnter
      delayTime={300}
      key={`icon${k}`}
      variants={subMenuItemVariants}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      onDelayedMouseEnter={() => {
        setActiveMenu(k);
        setActiveItem(0);
      }}
      className={`btn text-2xl rounded-full bg-primary-500 text-white border  drop-shadow-2xl p-3 cursor-pointer ${activeMenu === k ? " bg-primary-800" : ""
        }`}
    >
      {items[_].icon}
    </DelayedMouseEnter>
  ));

  const getActiveItem = (item) => {
    if (!item) return;
    if (item?.items) {
      return (
        <div className="flex flex-row">
          {itemMenu(item, activeSubItem, setActiveSubItem, true)}
          {activeSubItem !== null && getActiveItem(item.items[activeSubItem])}
        </div>
      );
    }
    return (
      <div
        className={`bg-white h-full px-6 py-8 gap-3 flex flex-col min-w-[320px] w-full overflow-auto scrollbar ${item?.classes?.content}`}
      >
        {item.content}
      </div>
    );
  };

  const itemMenu = (item, getter, setter, col = false) => (
    <div
      className={` p-4 flex flex-col bg-gray-700/90  overflow-auto scrollbar min-w-[170px] ${col ? "bg-gray-100 text-black" : "bg-gray-700/90 text-white"
        }`}
    >
      <div
        className={`flex ${col ? "flex-col gap-3" : "flex-col gap-1.5"
          } "items-end" }`}
      >
        {itemMenuButton(item, getter, setter, col)}
      </div>
    </div>
  );

  const itemMenuButton = (item, getter, setter, col) => {
    if (!item?.items) return null;

    return item.items?.map((a, k) => (
      <DelayedMouseEnter
        delayTime={300}
        className={`px-3 py-1.5 w-min cursor-pointer rounded-md whitespace-nowrap ${getter === k ? (!col ? "font-bold underline" : "font-bold") : ""
          }`}
        key={`btn${k}`}
        onClick={() => {
          setter(k);
        }}
        onDelayedMouseEnter={() => {
          setter(k);
        }}
      >
        {a.title}
      </DelayedMouseEnter>
    ));
  };
  // if (!menu.enabled) return null;

  return (
    <AnimatePresence>
      {enabled && !preview && (
        <motion.div
          variants={containerVariants}
          ref={ref}
          key="wrapper"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`absolute z-40 ${pos} select-none flex flex-col md:flex-row h-screen items-center pointer-events-none`}
        >
          <button
            id="toolboxWrap"
            onMouseLeave={() => {
              setActiveMenu(null);
              setActiveItem(null);
            }}
            className={
              "flex flex-col md:flex-row gap-6 justify-center items-center pointer-events-auto"
            }
          >
            <motion.div
              variants={iconVariants}
              key="icons"
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={
                "flex flex-row md:flex-col gap-5 p-1.5 pointer-events-auto"
              }
            >
              {iconList}
            </motion.div>

            <AnimatePresence>
              {activeMenu !== null && (
                <motion.div
                  key="items"
                  className="overflow-hidden pointer-events-auto flex flex-row z-50 h-[420px]"
                  variants={activeMenuContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  id="toolbox"
                >
                  <div className="border bg-whit flex-row flex border-gray-500 shadow-10x rounded-md overflow-hidden h-full">
                    {activeMenu !== null &&
                      itemMenu(items[activeMenu], activeItem, setActiveItem)}
                    {activeMenu !== null &&
                      activeItem !== null &&
                      getActiveItem(items[activeMenu]?.items[activeItem])}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
