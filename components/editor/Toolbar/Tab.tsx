import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { TabAtom } from "../Viewport";
import MenuItem from "./Helpers/MenuIcon";

export const Tab = ({ tabId, icon = null, title = "" }) => {
  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const inactive =
    "flex items-center justify-center p-3 text-lg font-medium text-gray-500 rounded-xl hover:bg-gray-900/30 hover:text-gray-200";
  const active =
    "flex items-center justify-center p-3 text-lg font-medium bg-gray-900/30 rounded-xl text-white";
  const isActive = activeTab === tabId;

  if (!icon) return null;

  return (
    <Tooltip content={title} placement="bottom" arrow={false}>
      <motion.button
        type="button"
        className={isActive ? active : inactive}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        onClick={() => {
          setActiveTab(tabId);
        }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.button>
    </Tooltip>
  );
};

export const TabBody = ({ children = null, jumps = [] }) => {
  if (!children) return null;

  return (
    <>
      {jumps.length ? (
        <div className="bg-gray-600 border-b-gray-500 border-b flex flex-row gap-3 px-3 justify-end">
          {jumps.map((_, k) => (
            <MenuItem
              key={k}
              onClick={() => {
                document.getElementById("toolbarContents").scrollTo({
                  top: document.getElementById(_.title).offsetTop,
                });
              }}
              tooltip={`Jump to ${_.title}`}
            >
              {_.content}
            </MenuItem>
          ))}
        </div>
      ) : null}

      <div
        id="toolbarContents"
        className={`w-full flex flex-col p-3 scrollbar overflow-auto absolute bottom-[64px] top-[${
          jumps.length ? "188px" : "142px"
        }] pb-[400px] gap-6`}
      >
        {children}
      </div>
    </>
  );
};

export default Tab;
