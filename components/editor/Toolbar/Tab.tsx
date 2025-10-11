import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { TabAtom } from "../Viewport";
import MenuItem from "./Helpers/MenuIcon";

export const Tab = ({ tabId, icon = null, title = "" }) => {
  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const isActive = activeTab === tabId;

  if (!icon) return null;

  return (
    <Tooltip content={title} placement="bottom" arrow={false}>
      <motion.div
        className={`flex cursor-pointer items-center justify-center rounded-md p-3 text-lg font-medium ${isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        onClick={() => {
          setActiveTab(tabId);
        }}
        whileTap={{ scale: 0.9 }}
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
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
        <div className="flex flex-row justify-end gap-3 border-b border-border bg-muted px-3 text-muted-foreground">
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
        className={`top-[${jumps.length ? "224px" : "190px"}] scrollbar absolute bottom-[64px] flex w-full flex-col gap-3 divide-y divide-border overflow-y-auto overflow-x-hidden px-2 py-1.5 pb-[400px]`}
      >
        {children}
      </div>
    </>
  );
};

export default Tab;
