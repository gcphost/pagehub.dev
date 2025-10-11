import { Tooltip } from "components/layout/Tooltip";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { TabAtom } from "../Viewport";
import MenuItem from "./Helpers/MenuIcon";

export const Tab = ({ tabId, icon = null, title = "" }) => {
  const [activeTab, setActiveTab] = useRecoilState(TabAtom);

  const inactive =
    "flex items-center justify-center p-3 text-lg font-medium text-muted-foreground  hover:bg-card hover:text-muted-foreground cursor-pointer rounded-md";
  const active =
    "flex items-center justify-center p-3 text-lg font-medium text-accent-foreground   bg-background text-foreground border-accent-foreground cursor-pointer rounded-md";
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
        className={`scrollbar top-[ absolute bottom-[64px] flex w-full flex-col overflow-y-auto overflow-x-hidden${
          jumps.length ? "224px" : "190px"
        }] gap-3 divide-y divide-border px-2 py-1.5 pb-[400px]`}
      >
        {children}
      </div>
    </>
  );
};

export default Tab;
