import { ulVariants } from "components/editor/Viewport/ToolboxContextual";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SideBarAtom } from "utils/lib";

export const Dialog = ({
  dialogName,
  dialogAtom,
  items = [],
  height = 320,
  callback = null,
  value = "",
  children = null,
  width = null,
  className = "",
  onSearch = (_, value) =>
    _.search(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")) >
    -1,
  customOnSearch = null,
  customRenderer = null,
}) => {
  const [dialog, setDialog] = useRecoilState(dialogAtom) as any;
  const sideBarLeft = useRecoilValue(SideBarAtom);

  const ref = useRef(null);

  const rect = dialog.e;

  const [itemList, setItemList] = useState(items);
  const [searchValue, setSearchValue] = useState(null);

  let style = {
    top: 0,
    left: 0,
    zIndex: 1000,
  } as any;

  if (rect) {
    style = {
      top: rect.bottom + 6,
      left: rect.left,
      zIndex: 1000,
    };

    if (style.top + height > window.innerHeight) {
      style = {
        bottom: 65,
        left: rect.left,
        zIndex: 1000,
      };
    } else if (style.top < 100) {
      style = {
        top: 150,
        left: rect.left,
        zIndex: 1000,
      };
    }
  }

  width = width || rect?.width || 308;

  const closed = () => {
    setSearchValue(null);
    setItemList(items);
    setDialog({ ...dialog, enabled: false });
  };

  const changed = (value) => {
    if (!dialog.changed) return;

    setDialog({ ...dialog, value, enabled: false });
    dialog.changed(value);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closed();
    }
  };

  const search = (e) => {
    setSearchValue(e.target.value);

    if (customOnSearch) {
      // If custom onSearch is provided, call it directly
      customOnSearch(e.target.value);
    } else {
      // Use default filtering logic
      setItemList(items.filter((_) => onSearch(_, e.target.value)));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [dialog.enabled, handleClickOutside, ref]);

  const refIe = useRef(null);

  useEffect(() => {
    if (dialog.value) {
      const element = document.getElementById(`${dialogName}-${value}`);
      if (element && refIe.current)
        refIe.current.scrollTo({ top: element.offsetTop });
    }
  }, [dialog.enabled, dialog.value, dialogName, ref, value]);

  return (
    <AnimatePresence>
      {dialog.enabled && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dialogName || "Selection dialog"}
          animate={{ opacity: 1, width, height }}
          variants={ulVariants}
          transition={ulVariants.transition}
          initial={{ opacity: 1, width, height: 0 }}
          exit={{ opacity: 1, width, height: 0 }}
          key={dialogName}
          id={dialogName}
          ref={ref}
          style={style}
          className={"absolute z-20 flex pointer-events-none "}
        >
          <div
            className={
              "h-full w-full overflow-hidden my-auto bg-white rounded-lg  p-0 border-2 border-gray-800/60  pointer-events-auto  drop-shadow-2xl  "
            }
          >
            {children}

            {customRenderer && (
              <div className="rounded-lg w-full h-full overflow-hidden flex flex-col">
                <div className="px-3 pt-3 pb-2 flex-shrink-0">
                  <input
                    type="text"
                    className="input-base py-1 w-full"
                    placeholder="Search"
                    onKeyUp={(e) => search(e)}
                    autoFocus={true}
                    defaultValue={searchValue}
                    aria-label="Search"
                  />
                </div>
                <div className="px-3 pb-3 flex-1 min-h-0">
                  {customRenderer}
                </div>
              </div>
            )}

            {!children && !customRenderer && (
              <div
                ref={refIe}
                className={`rounded-lg max-h-[${height}px] w-full overflow-auto scrollbar p-3 flex flex-col gap-3`}
              >
                <input
                  type="text"
                  className="input-base py-1"
                  placeholder="Search"
                  onKeyUp={(e) => search(e)}
                  autoFocus={true}
                  defaultValue={searchValue}
                  aria-label="Search"
                />

                {!searchValue && (
                  <button
                    className="w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl"
                    onClick={(e) => changed(null)}
                  >
                    Default
                  </button>
                )}

                {!itemList.length && (
                  <div className="w-full flex flex-row cursor-pointer hover:bg-white p-3 rounded-md  md:text-xl">
                    No results.
                  </div>
                )}

                <div className={className}>
                  {itemList?.map((_, k) => {
                    if (callback) return callback(_, k);

                    return (
                      <button
                        id={`font-${_}`}
                        className={`w-full flex flex-row cursor-pointer hover:bg-gray-100 p-3 rounded-md  md:text-xl ${dialog.value === _ ? "bg-white" : ""
                          }`}
                        style={{ fontFamily: (_ || []).join(", ") }}
                        key={k}
                        onClick={(e) => changed(_)}
                      >
                        {_.join(", ")}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
