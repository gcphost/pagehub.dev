import { useNode } from "@craftjs/core";
import { useFindScrollingParent } from "components/selectors/lib";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { getRect } from "./Viewport/useRect";

export function RenderNodePortal({ children }) {
  const clonedElementRef = useRef(null);

  const { id, dom } = useNode((node) => ({
    dom: node.dom,
  }));

  const setPosition = useCallback(
    (rect) => {
      if (!rect || !clonedElementRef.current) return;

      const clonedElement = clonedElementRef.current;

      clonedElement.style.top = `${rect.top}px`;
      clonedElement.style.left = `${rect.left}px`;
      clonedElement.style.width = `${rect.width}px`;
      clonedElement.style.height = `${rect.height}px`;
    },
    [clonedElementRef]
  );

  const scrollingParent = useFindScrollingParent(id);

  useEffect(() => {
    if (!dom) return;

    const observer = new MutationObserver(() => {
      setPosition(getRect(dom));
    });

    observer?.observe(dom, {
      attributes: true,
      childList: false,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
    };
  }, [dom, setPosition]);

  useEffect(() => {
    if (!clonedElementRef.current || !dom) return;

    const clonedElement = clonedElementRef.current;

    setPosition(getRect(dom));

    let animationFrameId;

    if (!scrollingParent) return;

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const rect = getRect(dom);
        clonedElement.style.top = `${rect.top}px`;
      });
    };

    scrollingParent.addEventListener("scroll", handleScroll);

    return () => {
      scrollingParent.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [dom, scrollingParent, setPosition]);

  return (
    <div
      ref={clonedElementRef}
      className="absolute pointer-events-none"
      style={{ zIndex: 50 }}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
