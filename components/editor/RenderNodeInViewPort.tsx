import { useNode } from "@craftjs/core";
import { useFindScrollingParent } from "components/selectors/lib";
import { useCallback, useEffect, useRef, useState } from "react";

export const useIsInViewPort = (id) => {
  const [isInViewport, setIsInViewport] = useState(false);

  const originalElementRef = useRef(null);

  useEffect(() => {
    originalElementRef.current = document.querySelector(`[node-id="${id}"]`);
  }, [id]);

  const scrollingParent = useFindScrollingParent(id);

  const setInView = useCallback(() => {
    const originalElement = originalElementRef.current;
    if (!originalElement) return;

    const clonedElementRect = originalElement.getBoundingClientRect();
    const viewportRect = document
      .getElementById("viewport")
      .getBoundingClientRect();
    const margin = 140;
    const inViewport =
      clonedElementRect.bottom + margin >= viewportRect.top &&
      clonedElementRect.top - margin <= viewportRect.bottom &&
      clonedElementRect.right + margin >= viewportRect.left &&
      clonedElementRect.left - margin <= viewportRect.right;

    const dom = originalElementRef.current;

    if (!inViewport) {
      dom.removeAttribute("data-enabled");
    } else dom.setAttribute("data-enabled", true);

    setIsInViewport(inViewport);
  }, [originalElementRef]);

  useEffect(() => {
    setInView();
  }, [originalElementRef, setInView]);

  useEffect(() => {
    if (!scrollingParent || !originalElementRef.current) return;
    let animationFrameId;

    const handleScroll = () => {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        setInView();
      });
    };

    scrollingParent.addEventListener("scroll", handleScroll);

    return () => {
      scrollingParent.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [originalElementRef, scrollingParent, setInView]);

  return isInViewport;
};

export function RenderNodeInViewPort({ children }) {
  const { id } = useNode((node) => ({
    dom: node.dom,
  }));

  const isInViewport = useIsInViewPort(id);

  if (!isInViewport) return null;

  return children;
}
