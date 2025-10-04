import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { TabAtom } from "../Viewport";
import MenuItem from "./Helpers/MenuIcon";

export const Tab = ({ tabId, icon = null, title = "" }) => {
  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const inactive =
    "flex items-center justify-center p-3 text-lg font-medium text-gray-500 rounded-xl hover:bg-gray-900/30 hover:text-gray-200 cursor-pointer";
  const active =
    "flex items-center justify-center p-3 text-lg font-medium bg-gray-900/30 rounded-xl text-white cursor-pointer";
  const isActive = activeTab === tabId;

  if (!icon) return null;

  return (
    <Tooltip content={title} placement="bottom" arrow={false}>
      <motion.div
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
      </motion.div>
    </Tooltip>
  );
};

export const TabBody = ({ children = null, jumps = [] }) => {
  if (!children) return null;

  return (
    <>
      {jumps.length ? (
        <div className="bg-gray-600 border-b-gray-500 border-b flex flex-row gap-3 px-3 justify-end">
          {jumps.map((_) => (
            <MenuItem
              key={uuidv4()}
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
        className={`w-full flex flex-col p-3 scrollbar overflow-auto absolute bottom-[64px] top-[${jumps.length ? "246px" : "200px"
          }] pb-[400px] gap-6`}
      >
        {children}
      </div>
    </>
  );
};

export default Tab;
