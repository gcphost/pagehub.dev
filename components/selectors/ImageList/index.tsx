import { useEditor, useNode, UserComponent } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { HoverNodeController } from "components/editor/NodeControllers/HoverNodeController";
import { SelectImageListTool } from "components/editor/NodeControllers/Tools/SelectImageListTool";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";
import React, { useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight, TbPhoto } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { motionIt } from "utils/lib";
import { usePalette } from "utils/PaletteContext";
import {
  applyAnimation,
  ClassGenerator,
  CSStoObj,
} from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { useScrollToSelected } from "../lib";
import { ImageListSettings } from "./ImageListSettings";

interface ImageListProps extends BaseSelectorProps {
  mode: "grid" | "carousel" | "hero" | "masonry" | "infinite" | "flex";
  itemsPerView: number;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  autoScroll: boolean | string;
  autoScrollInterval: number;
  infiniteSpeed: number;
  infiniteDirection: "left" | "right";
  animationEnabled: boolean | string;
  previewInEditor: boolean | string;
  showNavigation: boolean | string;
  showDots: boolean | string;
}

const defaultProps: ImageListProps = {
  className: [],
  root: {},
  mobile: {
    flexDirection: "flex-col",
  },
  tablet: {},
  desktop: {
    flexDirection: "flex-row",
  },
  mode: "flex",
  itemsPerView: 3,
  alignItems: "items-center",
  justifyContent: "justify-start",
  gap: "gap-2",
  autoScroll: false,
  autoScrollInterval: 3000,
  infiniteSpeed: 30,
  infiniteDirection: "left",
  animationEnabled: true,
  previewInEditor: false,
  showNavigation: true,
  showDots: true,
};

export const ImageList: UserComponent<ImageListProps> = (props: ImageListProps) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);
  const palette = usePalette();

  props = setClonedProps(props, query);

  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get child Image nodes for gallery modes
  let childImages: any[] = [];
  if (isMounted) {
    try {
      const node = query.node(id).get();
      childImages = (node.data.nodes || [])
        .map((childId) => {
          try {
            const childNode = query.node(childId).get();
            if (childNode.data.name === "Image") {
              return {
                id: childId,
                src: childNode.data.props.src || "",
                alt: childNode.data.props.alt || "",
              };
            }
            return null;
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);
    } catch (e) {
      childImages = [];
    }
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!props.autoScroll || enabled || !isMounted || props.mode === "flex" || props.mode === "infinite") return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = childImages.length - props.itemsPerView;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, props.autoScrollInterval);

    return () => clearInterval(interval);
  }, [props.autoScroll, props.autoScrollInterval, childImages.length, props.itemsPerView, enabled, isMounted, props.mode]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : childImages.length - props.itemsPerView));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = childImages.length - props.itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  useScrollToSelected(id, enabled);



  const prop: any = {
    ref: (r) => {
      connect(drag(r));
    },
    style: props.root.style ? CSStoObj(props.root.style) || {} : {},
    className: ClassGenerator(
      props,
      view,
      enabled,
      [],
      [],
      preview,
      false,
      palette
    ),
  };

  if (enabled) {
    prop["data-bounding-box"] = enabled;
    prop["node-id"] = id;
  }

  const element = motionIt(props, "div");

  const { children } = props;

  // Apply mode-specific className and style adjustments
  let containerClasses = prop.className;
  let additionalStyles = {};

  if (props.mode === "grid") {
    containerClasses += ` grid ${props.gap || "gap-2"}`;
    additionalStyles = {
      gridTemplateColumns: `repeat(${props.itemsPerView || 3}, minmax(0, 1fr))`,
    };
  } else if (props.mode === "masonry") {
    containerClasses += ` ${props.gap || "gap-2"}`;
    additionalStyles = {
      columnCount: props.itemsPerView || 3,
    };
  } else if (props.mode === "carousel" || props.mode === "hero") {
    containerClasses += " relative overflow-hidden";
  } else if (props.mode === "infinite") {
    containerClasses += " relative overflow-hidden";
  }

  prop.className = containerClasses;
  prop.style = { ...prop.style, ...additionalStyles };

  // Check if there are Image children
  let hasActualImages = childImages.length > 0 || !!children;

  // Wrap children for carousel/hero modes
  let wrappedChildren = children;
  if ((props.mode === "carousel" || props.mode === "hero") && isMounted) {
    const isHero = props.mode === "hero";
    const imageWidth = isHero ? '100%' : `${100 / (props.itemsPerView || 3)}%`;

    wrappedChildren = (
      <>
        <style jsx>{`
          .carousel-container > * {
            flex-shrink: 0;
            width: ${imageWidth};
            padding: 0 0.5rem;
          }
        `}</style>
        <div
          className="flex transition-transform duration-500 ease-in-out carousel-container"
          style={{
            transform: `translateX(-${currentIndex * (100 / (isHero ? 1 : props.itemsPerView))}%)`,
          }}
        >
          {children}
        </div>
      </>
    );
  } else if (props.mode === "infinite" && isMounted) {
    const shouldAnimate = isMounted &&
      props.animationEnabled !== "" &&
      (!enabled || !!props.previewInEditor);

    // Calculate width for each image based on itemsPerView
    const imageWidth = `${100 / (props.itemsPerView || 3)}%`;

    // Determine animation direction
    const isScrollingLeft = props.infiniteDirection === "left";
    const animationName = isScrollingLeft ? "gallery-scroll-left" : "gallery-scroll-right";

    wrappedChildren = (
      <>
        <style jsx global>{`
          @keyframes gallery-scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes gallery-scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .gallery-infinite-scroll:hover {
            animation-play-state: paused !important;
          }
          .gallery-infinite-scroll > * {
            flex-shrink: 0;
            width: ${imageWidth};
          }
        `}</style>
        <div className="overflow-hidden w-full">
          <div
            className="flex gallery-infinite-scroll"
            style={{
              animation: shouldAnimate ? `${animationName} ${props.infiniteSpeed}s linear infinite` : 'none',
            }}
          >
            {children}

          </div>
        </div>
      </>
    );
  }

  const content = (
    <>
      {enabled && isMounted && (
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={ImageList} props={props} />
      )}

      {/* Render children with mode-specific wrapper */}
      {hasActualImages || !enabled ? (
        wrappedChildren
      ) : (
        enabled && (
          <div className="w-auto flex justify-center items-center p-4">
            <div data-empty-state={true} className="text-3xl">
              <TbPhoto />
            </div>
          </div>
        )
      )}

      {/* Navigation Arrows for carousel/hero */}
      {(props.mode === "carousel" || props.mode === "hero") &&
        props.showNavigation &&
        childImages.length > props.itemsPerView &&
        !enabled && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Previous"
            >
              <TbChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              aria-label="Next"
            >
              <TbChevronRight size={24} />
            </button>
          </>
        )}

      {/* Dots Indicator for carousel/hero */}
      {(props.mode === "carousel" || props.mode === "hero") &&
        props.showDots &&
        childImages.length > props.itemsPerView &&
        !enabled && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: childImages.length - props.itemsPerView + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? "bg-white w-8" : "bg-white/50"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
    </>
  );

  prop.children = content;

  return React.createElement(element, {
    ...applyAnimation(prop, props),
  });
};

ImageList.craft = {
  displayName: "Image List",
  rules: {
    canDrag: () => true,
    canMoveIn: (nodes) => nodes.every((node) => node.data?.name === "Image"),
  },
  related: {
    toolbar: ImageListSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [
        <HoverNodeController
          key="imageListHoverController"
          position="top"
          align="end"
          placement="end"
          alt={{
            position: "bottom",
            align: "start",
            placement: "start",
          }}
        />,
        <SelectImageListTool key="selectImageList" />,
        <DeleteNodeController key="imageListDelete" />,
      ];

      return [...baseControls];
    },
  },
};

