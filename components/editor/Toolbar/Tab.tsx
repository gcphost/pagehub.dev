import { AutoHideScrollbar } from "components/layout/AutoHideScrollbar";
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
        className={`flex cursor-pointer items-center justify-center rounded-md p-1.5 text-lg font-medium ${isActive
          ? "bg-primary text-primary-foreground"
          : "text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
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
    <div id="toolbarJumps" className="flex h-full flex-col">
      {jumps.length ? (
        <div className="flex shrink-0 flex-row justify-end gap-3 border-b border-border bg-muted px-3 py-0.5 text-muted-foreground drop-shadow-sm">
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

      <AutoHideScrollbar
        id="toolbarContents"
        className="flex min-h-0 flex-1 flex-col gap-3 divide-y divide-border overflow-y-auto overflow-x-hidden py-2 pb-[calc(100vh/2)] pl-2 pr-0"
        hideDelay={2000}
        showDelay={100}
      >
        {children}
      </AutoHideScrollbar>
    </div>
  );
};

export default Tab;
