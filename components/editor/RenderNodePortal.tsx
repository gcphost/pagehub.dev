import { useNode } from "@craftjs/core";
import { useFindScrollingParent } from "components/selectors/lib";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { getRect } from "./Viewport/useRect";

export function RenderNodePortal({ children }) {
  const clonedElementRef = useRef(null);
  const originalElementRef = useRef(null);

  const { id } = useNode((node) => ({
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
    originalElementRef.current = document.querySelector(`[node-id="${id}"]`);
  }, [document.querySelector(`[node-id="${id}"]`)]);

  useEffect(() => {
    if (!originalElementRef.current) return;

    const observer = new MutationObserver(() => {
      setPosition(getRect(originalElementRef.current));
    });

    observer?.observe(originalElementRef.current, {
      attributes: true,
      childList: false,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
    };
  }, [originalElementRef.current]);

  useEffect(() => {
    if (!clonedElementRef.current || !originalElementRef.current) return;

    const clonedElement = clonedElementRef.current;
    const originalElement = originalElementRef.current;

    setPosition(getRect(originalElementRef.current));

    let animationFrameId;

    if (!scrollingParent) return;

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        const originalElement = originalElementRef.current;
        const rect = getRect(originalElement);
        clonedElement.style.top = `${rect.top}px`;
      });
    };

    scrollingParent.addEventListener("scroll", handleScroll);

    return () => {
      scrollingParent.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [originalElementRef, scrollingParent]);

  return (
    <div
      node-box={id}
      ref={clonedElementRef}
      className="absolute pointer-events-none"
      style={{ zIndex: 50 }}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
