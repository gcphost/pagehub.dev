import { useNode } from "@craftjs/core";
import { useFindScrollingParent } from "components/selectors/lib";
import { useCallback, useEffect, useState } from "react";

export const useIsInViewPort = (id) => {
  const [isInViewport, setIsInViewport] = useState(false);

  // Get the DOM element directly from CraftJS
  const { dom } = useNode((node) => ({
    dom: node.dom,
  }));

  const scrollingParent = useFindScrollingParent(id);

  const setInView = useCallback(() => {
    if (!dom) return;

    const viewportElement = document.getElementById("viewport");
    if (!viewportElement) return;

    const clonedElementRect = dom.getBoundingClientRect();
    const viewportRect = viewportElement.getBoundingClientRect();
    const margin = 140;

    const inViewport =
      clonedElementRect.bottom + margin >= viewportRect.top &&
      clonedElementRect.top - margin <= viewportRect.bottom &&
      clonedElementRect.right + margin >= viewportRect.left &&
      clonedElementRect.left - margin <= viewportRect.right;

    if (!inViewport) {
      dom.removeAttribute("data-enabled");
    } else dom.setAttribute("data-enabled", true);

    setIsInViewport(inViewport);
  }, [id, dom]);

  useEffect(() => {
    if (dom) {
      setInView();
    }
  }, [dom, setInView]);

  useEffect(() => {
    if (!scrollingParent || !dom) return;
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
  }, [dom, scrollingParent, setInView]);

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
