import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import { useRecoilState } from "recoil";
import { getRect } from "../Viewport/useRect";

export const useGetRectLater = (localRef) => {
  const [rect, setRect] = useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!localRef?.current) return;
    const originalDisplay = localRef.current.style.display;

    localRef.current.style.display = "flex";
    const rect = getRect(localRef.current);

    localRef.current.style.display = originalDisplay;

    setRect(rect);

    localRef.current.style.display = "flex";
  }, [localRef]);

  return rect;
};

function Dialog({ children, target, state, opener }: any): any {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);

  const [isOpen, setIsOpen] = useRecoilState(state);

  const dialogRect = useGetRectLater(dialogRef);

  const setPosition = useCallback(
    (rect) => {
      if (!rect || !dialogRef.current) return;

      const dialog = dialogRef.current;

      dialog.style.top = `${rect.top}px`;
      dialog.style.left = `${rect.left}px`;
      dialog.style.right = `${rect.right}px`;
      dialog.style.width = `${rect.width}px`;
      dialog.style.height = `${rect.height}px`;
    },
    [dialogRef]
  );

  useEffect(() => {
    if (!target) return;

    const targetRect = target.getBoundingClientRect();
    const dialogContentRect = getRect(dialogContentRef.current);
    const viewportRect = getRect(document.getElementById("viewport"));
    const openerRect = getRect(opener.current);

    const dialogWidth = dialogContentRect.width;
    const dialogHeight = dialogContentRect.height;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;
    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;
    let top = 0;
    let left = 0;
    const right = 0;
    let alignRight = false;
    const gap = 10;

    // Vertically center the dialogContentRect element
    top = targetRect.top + targetHeight / 2 - dialogHeight / 2;
    // top = openerRect.bottom + gap;
    left = openerRect.left;

    // Check if there is enough space to align the dialogContentRect element to the left
    if (targetRect.left >= dialogWidth + gap) {
      left = targetRect.left - dialogWidth - gap;
    } else if (left + dialogWidth + gap > viewportWidth) {
      // Check if there is enough space to align the dialogContentRect element to the right
      alignRight = true;
      left = viewportWidth - dialogWidth - gap;
    } else {
      // No space to align left or right, so center the dialogContentRect element horizontally
      // left = 0;
    }

    // Check if the dialogContentRect element is out of the viewport
    if (left <= 0) {
      left = gap;
    } else if (left + dialogWidth > viewportWidth) {
      left = viewportWidth - dialogWidth;
    }

    // Check if the dialogContentRect element is out of the viewport vertically
    if (top < 0) {
      top = gap;
    } else if (top + dialogHeight + 50 > viewportHeight) {
      top = openerRect.top - dialogHeight - openerRect.height - gap;
    }

    // Update the position state with the calculated top and left values
    setPosition({ left, top, right });
  }, [isOpen, target, dialogRect, opener, setPosition]);

  function handleMouseDown(e) {
    setIsDragging(true);
    const dialogContentRect = getRect(dialogRef.current);

    setOffset({
      x: e.clientX - dialogContentRect.x,
      y: e.clientY - dialogContentRect.y,
    });
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (isDragging) {
        setPosition({
          left: e.clientX - offset.x,
          top: e.clientY - offset.y,
          right: "",
          bottom: "",
        });
      }
    }

    function handleMouseUp(e) {
      setIsDragging(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, setPosition]);

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [dialogRef]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="absolute w-[350px] h-[350px]" ref={dialogRef}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Settings dialog"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute select-none bg-gray-700  max-w-[320px] text-white  border-2 border-gray-900 flex-col gap- rounded-lg shadow-2xl overflow-hidden"
            style={{
              zIndex: 50,
            }}
          >
            <button
              onMouseDown={handleMouseDown}
              tabIndex={0}
              className="h-8 cursor-move"
              aria-label="Drag to move dialog"
            >
              <div className="w-2/3 h-4 inside-shadow bg-primary-500 hover:bg-primary-900 rounded-b-md mx-auto -mt-[2px]   border-gray-900 border-2 border-t-primary-500 hover:border-t-primary-900 drop-shadow-lg  px-3 py-1.5"></div>

              <div className="flex items-center justify-between ">
                <button
                  className="text-gray-500 absolute left-3 top-2.5"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close dialog"
                >
                  <span className="sr-only">Close</span>
                  <MdClose />
                </button>
              </div>
            </button>

            <div
              ref={dialogContentRef}
              className="max-h-[320px] overflow-y-auto overflow-x-hidden scrollbar  px-3 pb-1.5"
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.querySelector('[data-container="true"]')
  );
}

export default Dialog;
