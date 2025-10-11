import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
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
  zIndex = 1000,
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
  const [isUpward, setIsUpward] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [style, setStyle] = useState({
    top: 0,
    left: 0,
    zIndex: zIndex,
  } as any);

  useEffect(() => {
    if (!rect || !isClient) return;

    const availableHeight = window.innerHeight - rect.bottom - 20; // Leave 20px margin
    const maxHeight = Math.min(
      height,
      availableHeight,
      window.innerHeight * 0.6,
    ); // Max 60% of screen height

    let newStyle: any = {
      top: rect.bottom + 6,
      left: rect.left,
      zIndex: zIndex,
      maxHeight: maxHeight,
    };

    // If dropdown would go off-screen, position it above the trigger
    if (availableHeight < 200) {
      setIsUpward(true);
      newStyle = {
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
        zIndex: zIndex,
        maxHeight: Math.min(height, rect.top - 20, window.innerHeight * 0.6),
      };
    } else {
      setIsUpward(false);
    }

    setStyle(newStyle);
  }, [rect, height, zIndex, isClient]);

  const dialogWidth = width || rect?.width || 308;

  const closed = () => {
    setSearchValue(null);
    setItemList(items);
    setSelectedIndex(-1);
    setDialog({ ...dialog, enabled: false });
  };

  const changed = (value) => {
    if (!dialog.changed) return;

    setDialog({ ...dialog, value, enabled: false });
    dialog.changed(value);
  };

  const search = (e) => {
    setSearchValue(e.target.value);
    setSelectedIndex(-1); // Reset selection when searching

    if (customOnSearch) {
      // If custom onSearch is provided, call it directly
      customOnSearch(e.target.value);
    } else {
      // Use default filtering logic
      setItemList(items.filter((_) => onSearch(_, e.target.value)));
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closed();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closed();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const totalItems = (!searchValue ? 1 : 0) + itemList.length;
        setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex === -1 && !searchValue) {
          changed(null); // Select "Default"
        } else if (selectedIndex >= 0 && itemList[selectedIndex]) {
          changed(itemList[selectedIndex]);
        }
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.enabled]);

  const refIe = useRef(null);

  useEffect(() => {
    if (dialog.value) {
      const element = document.getElementById(`${dialogName}-${value}`);
      if (element && refIe.current)
        refIe.current.scrollTo({ top: element.offsetTop });
    }
  }, [dialog.enabled, dialog.value, dialogName, ref, value]);

  // Don't render portal on server-side or before client hydration
  if (typeof document === "undefined" || !isClient) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {dialog.enabled && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dialogName || "Selection dialog"}
          key={dialogName}
          id={dialogName}
          ref={ref}
          style={{ ...style, width: dialogWidth }}
          className={"pointer-events-none absolute z-20 flex"}
        >
          <div
            className={
              "pointer-events-auto my-auto w-full overflow-hidden rounded-lg border border-border bg-background p-0 shadow-xl"
            }
            style={{ height: style.maxHeight || height }}
          >
            {children}

            {customRenderer && (
              <div className="flex size-full flex-col overflow-hidden rounded-lg">
                {!isUpward && (
                  <div className="shrink-0 border-b border-border bg-muted px-2 pb-1 pt-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Search fonts..."
                      onKeyUp={(e) => search(e)}
                      autoFocus={true}
                      defaultValue={searchValue}
                      aria-label="Search"
                    />
                  </div>
                )}
                <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-2">
                  {customRenderer}
                </div>
                {isUpward && (
                  <div className="shrink-0 border-t border-border bg-muted px-2 pb-2 pt-1">
                    <input
                      type="text"
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Search fonts..."
                      onKeyUp={(e) => search(e)}
                      autoFocus={true}
                      defaultValue={searchValue}
                      aria-label="Search"
                    />
                  </div>
                )}
              </div>
            )}

            {!children && !customRenderer && (
              <div className="flex size-full flex-col overflow-hidden rounded-lg">
                {!isUpward && (
                  <div className="shrink-0 border-b border-border bg-muted px-2 pb-1 pt-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Search fonts..."
                      onKeyUp={(e) => search(e)}
                      autoFocus={true}
                      defaultValue={searchValue}
                      aria-label="Search"
                    />
                  </div>
                )}

                <div
                  ref={refIe}
                  className="scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-1"
                >
                  {!searchValue && (
                    <button
                      className={`flex w-full cursor-pointer flex-row rounded p-1 text-xs text-muted-foreground transition-colors hover:bg-muted ${selectedIndex === -1 ? "bg-accent text-accent-foreground" : ""}`}
                      onClick={(e) => changed(null)}
                    >
                      Default
                    </button>
                  )}

                  {!itemList.length && searchValue && (
                    <div className="flex w-full cursor-pointer flex-row rounded p-1 text-xs text-muted-foreground hover:bg-muted">
                      No results.
                    </div>
                  )}

                  <div className={className}>
                    {itemList?.map((_, k) => {
                      if (callback) return callback(_, k);

                      return (
                        <button
                          id={`font-${_}`}
                          className={`flex w-full cursor-pointer flex-row rounded p-1 text-xs text-muted-foreground transition-colors hover:bg-muted ${dialog.value === _
                            ? "bg-accent text-accent-foreground"
                            : selectedIndex === k
                              ? "bg-muted"
                              : ""
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

                {isUpward && (
                  <div className="shrink-0 border-t border-border bg-muted px-2 pb-2 pt-1">
                    <input
                      type="text"
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Search fonts..."
                      onKeyUp={(e) => search(e)}
                      autoFocus={true}
                      defaultValue={searchValue}
                      aria-label="Search"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
};
