import { useEffect, useState } from "react";
import { applyPattern } from "utils/lib";
import { ClassGenerator } from "utils/tailwind";

export const RenderPattern = ({
  children,
  props,
  settings,
  view,
  enabled,
  properties,
  preview,
}) => {
  const inlayProps = applyPattern({}, props, settings);
  const inlayClass = props?.root?.backgroundGradient
    ? "flex w-full h-full"
    : `${ClassGenerator(
        props,
        view,
        enabled,
        [],
        properties,
        preview
      )} flex w-full h-full`;

  if (inlayProps?.style?.backgroundImage) {
    return (
      <div className={inlayClass} {...inlayProps}>
        {children}
      </div>
    );
  }

  return children;
};

export const RenderGradient = ({
  children,
  props,
  view,
  enabled,
  properties,
  preview,
}) => {
  if (props?.backgroundImage && props?.root?.backgroundGradient) {
    const inlayClass = `${ClassGenerator(
      props,
      view,
      enabled,
      [],
      properties,
      preview
    )} flex w-full h-full`;

    return <div className={inlayClass}>{children}</div>;
  }

  return children;
};

export const inlayProps = [
  "backgroundGradient",
  "backgroundGradientTo",
  "backgroundGradientFrom",
  "px",
  "py",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "flexGrow",
  "p",
  "gap",
];

export const hasInlay = (props) =>
  props.backgroundImage && props.root.backgroundGradient;

export const useFindScrollingParent = (id) => {
  const [scrollingParent, setScrollingParent] = useState<HTMLElement | null>(
    null
  );
  const element: HTMLElement = document.querySelector(`[node-id="${id}"]`);
  const classesToCheck = ["overflow-auto", "overflow-y-auto"];

  useEffect(() => {
    let currentElement = element?.parentElement;
    while (currentElement && currentElement !== null) {
      const hasClass = classesToCheck.some((className) =>
        currentElement.classList.contains(className)
      );

      if (
        currentElement.scrollHeight > currentElement.clientHeight &&
        hasClass
      ) {
        setScrollingParent(currentElement);
        break;
      }
      currentElement = currentElement.parentElement;
    }
  }, [element, classesToCheck]);

  return scrollingParent;
};

// Hook to check if an element is in the viewport of its parent scrolling container
export const useIsInViewport = (
  element: HTMLElement | null,
  scrollingParent: HTMLElement | null
) => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    if (element && scrollingParent) {
      const rect = element.getBoundingClientRect();
      setIsInViewport(
        rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= scrollingParent.clientHeight &&
          rect.right <= scrollingParent.clientWidth
      );
    }
  }, [element, scrollingParent]);

  return isInViewport;
};

export const useScrollToSelected = (id, enabled) =>
  useEffect(() => {
    const selected: HTMLElement = document.querySelector(`[node-id="${id}"]`);

    if (!id || !selected || !enabled) return;

    const classesToCheck = ["overflow-auto", "overflow-y-auto"];
    let scrollingDiv = null;
    let currentElement = selected.parentElement;
    while (currentElement !== null) {
      const hasClass = classesToCheck.some((className) =>
        currentElement.classList.contains(className)
      );

      if (
        currentElement.scrollHeight > currentElement.clientHeight &&
        hasClass
      ) {
        scrollingDiv = currentElement;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= scrollingDiv.clientHeight &&
        rect.right <= scrollingDiv.clientWidth
      );
    };

    if (scrollingDiv !== null && !isInViewport(selected)) {
      scrollingDiv.scroll({
        top: selected.offsetTop,
        behavior: "smooth",
      });
    }
  }, [id, enabled]);
