import { useEditor, useNode } from "@craftjs/core";
import { ToolboxMenu } from "components/editor/RenderNode";
import { TabAtom, ViewAtom } from "components/editor/Viewport";
import {
  TbActiveItemAtom,
  TbActiveMenuAtom,
} from "components/editor/Viewport/atoms";
import { motion } from "framer-motion";
import { TbLayoutColumns, TbLayoutRows, TbNote, TbPlus } from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { MenuItemState, MenuState } from "utils/lib";
import { ImageDefault } from "./Image";

export const EmptyState = ({ icon = null }) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { isHover } = useNode((node) => ({
    isHover: node.events.hovered,
  }));

  const view = useRecoilValue(ViewAtom);
  const setActiveTab = useSetRecoilState(TabAtom);
  const setShowMenu = useSetRecoilState(MenuState);
  const setShowMenuType = useSetRecoilState(MenuItemState);

  const { id } = useNode();

  const { isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const [menu, setMenu] = useRecoilState(ToolboxMenu);

  const { name, nodeProps } = useNode((node) => ({
    parent: node.data.parent,
    nodeProps: node.data.props,
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const props = nodeProps[view];

  const flex =
    props?.desktop?.flexDirection || nodeProps?.mobile?.flexDirection || "";

  if (["flex-row", "flex-row-reverse"].includes(flex)) icon = <TbLayoutRows />;

  if (["flex-col", "flex-col-reverse"].includes(flex))
    icon = <TbLayoutColumns />;

  if (nodeProps.type === "page") icon = <TbNote />;

  let addIcon = <TbPlus />;

  if (nodeProps.type === "imageContainer" && !nodeProps.backgroundImage) {
    const ico = <ImageDefault tab="Container" props={nodeProps} />;
    icon = ico;
    addIcon = ico;
  }

  const setActiveMenu = useSetRecoilState(TbActiveMenuAtom);
  const setActiveItem = useSetRecoilState(TbActiveItemAtom);

  if (!enabled) {
    return null;
  }

  return (
    <div className="w-auto flex justify-center items-center">
      {isActive || isHover ? (
        <motion.div
          id={`empty${id}`}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.9 }}
          className={`cursor-pointer add-button rounded-md text-3xl `}
          onClick={(e) => {
            setShowMenu(true);
            setShowMenuType("components");
          }}
        >
          <div className="cursor-pointer">{addIcon}</div>
        </motion.div>
      ) : null}

      {!isActive && !isHover && icon && (
        <div data-empty-state={true}>{icon}</div>
      )}
    </div>
  );
};
