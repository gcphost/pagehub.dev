import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { TbCheck, TbPhoto } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getResponsiveImageAttrs, motionIt } from "utils/lib";
import { CSStoObj, ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { ImageSettings } from "./ImageSettings";

export const ImageDefault = ({ tab, props }) => {
  const setActiveTab = useSetRecoilState(TabAtom);

  return (
    <button
      onClick={() => {
        setActiveTab(tab);
        // setTimeout(() => document.getElementById("files")?.click(), 50);
      }}
      className="text-3xl w-full h-full flex items-center justify-center"
      aria-label="Add image"
    >
      {props.isLoading && <div role="status" aria-live="polite">Loading...</div>}
      {!props.isLoading && !props.loaded && <TbPhoto aria-label="Photo icon" />}
      {props.loaded && <TbCheck aria-label="Success" />}
    </button>
  );
};

interface ImageProps extends BaseSelectorProps {
  videoId?: string;
  type?: string;
  content?: string;
  url?: string;
  priority?: string;
  fetchPriority?: "high" | "low" | "auto" | "";
  loading?: string;
  alt?: string;
  title?: string;
}

const defaultProps: ImageProps = {
  type: "cdn",
  className: [],
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
  loading: "lazy",
  fetchPriority: "low",
};

export const Image = (props: ImageProps) => {
  props = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    id,
  } = useNode();
  const { query, enabled } = useEditor((state) => getClonedState(props, state));

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { videoId, content, type } = props;

  props = setClonedProps(props, query);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ref = useRef(null);

  // Look up media from media library at render time
  let mediaMetadata = null;
  let mediaObject = null;
  if (videoId) {
    try {
      const backgroundNode = query.node("ROOT").get();
      if (backgroundNode) {
        const pageMedia = backgroundNode.data.props.pageMedia || [];
        mediaObject = pageMedia.find((m: any) => m.id === videoId);
        if (mediaObject?.metadata) {
          mediaMetadata = mediaObject.metadata;
        }
      }
    } catch (e) {
      // Silent fail - just use props if lookup fails
    }
  }

  // Check if radius is set (for overflow-hidden)
  const hasRadius = props.root?.radius;

  const prop: any = {
    ref: (r) => {
      ref.current = r;
      connect(drag(r));
    },
    href: props.url,
    onClick: (e) => {
      enabled && e.preventDefault();
    },
    style: props.root.style ? CSStoObj(props.root.style) || {} : {},
    // Wrapper gets ALL layout classes (sizing, spacing, borders, shadows, radius, etc.)
    // EXCEPT image-specific rendering (object-fit, object-position)
    // Add overflow-hidden if radius is set to clip image corners properly
    className: `${hasRadius ? 'overflow-hidden' : ''} ${ClassGenerator(
      props,
      view,
      enabled,
      ["objectFit", "objectPosition"],
      [],
      preview
    )}`.trim(),
  };


  // Use metadata from media library, fallback to props
  const altText = mediaMetadata?.alt || props.alt || mediaMetadata?.title || props.title || "";
  const titleText = mediaMetadata?.title || props.title || "";

  // Check if objectFit is set in any view
  const hasObjectFit =
    props.mobile?.objectFit ||
    props.tablet?.objectFit ||
    props.desktop?.objectFit;

  const _imgProp: any = {
    loading: props.loading || "lazy",
    alt: altText,
    title: titleText,
    role: !altText && !titleText ? "presentation" : undefined,
    // Img always fills wrapper (w-full h-full) + gets image-specific rendering classes
    // Add default object-cover if not set (important for aspect-ratio to work on wrapper)
    // Radius stays on wrapper, not on img
    className: `w-full h-full ${!hasObjectFit ? 'object-cover' : ''} ${ClassGenerator(
      props,
      view,
      enabled,
      [],
      ["objectFit", "objectPosition"],
      preview
    )}`.trim(),
    // width: "100",
    // height: "100",
    // fill: true,
  };

  // Check if media is SVG type (either from props.type or media library)
  const isSvg = type === "svg" || mediaObject?.type === "svg";

  if (isSvg) {
    // Get SVG content from props or media library
    let svgContent = content; // Direct prop content (legacy)

    // If no direct content, try to get from media library
    if (!svgContent && videoId && mediaMetadata?.svg) {
      svgContent = mediaMetadata.svg;
    }

    if (svgContent) {
      _imgProp.dangerouslySetInnerHTML = { __html: svgContent };
      // Add classes and styles to ensure SVG fits within container
      // Use Tailwind arbitrary values for the nested SVG selector
      // Note: w-full h-full already applied to base className
      _imgProp.className = `${_imgProp.className} [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full`.trim();
      // Inline styles for flexbox centering
      _imgProp.style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    }
  } else {
    // Use responsive image system for CDN images
    if (videoId) {
      const responsiveAttrs = getResponsiveImageAttrs(query, videoId);

      _imgProp.src = responsiveAttrs.src;

      // Only add srcset/sizes if available (CDN images only)
      if (responsiveAttrs.srcset) {
        _imgProp.srcSet = responsiveAttrs.srcset;
        _imgProp.sizes = responsiveAttrs.sizes;
      }
    } else {
      _imgProp.src = null;
    }

    // Add fetchpriority attribute to the img element
    if (props.fetchPriority) {
      _imgProp.fetchpriority = props.fetchPriority;
    }

    // Add preload link to document head when priority is enabled
    if (props.priority && typeof document !== "undefined" && _imgProp.src) {
      const link = document.createElement("link");

      link.rel = "preload";
      link.href = _imgProp.src;
      link.as = "image";

      // Apply fetchPriority to preload link if set
      if (props.fetchPriority) {
        link.fetchPriority = props.fetchPriority as "high" | "low" | "auto";
      }

      const preloadLink = document.querySelector(
        `link[rel="preload"][href="${link.href}"][as="image"]`
      );
      if (!preloadLink) document.head.appendChild(link);
    }
  }

  const empty = !videoId && !content;

  if (enabled) {
    if (empty) {
      prop.children = <ImageDefault tab="Image" props={props} />;
    }
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = empty;
    prop["node-id"] = id;
  }

  let tagName;
  if (empty) {
    tagName = "div";
  } else if (isSvg) {
    // Use div wrapper for inline SVG to avoid nested svg tags
    tagName = "div";
  } else {
    tagName = "img";
  }

  // Create the actual img/svg/div element
  const createImgElement = (shouldConnectDrag: boolean) => {
    return React.createElement(motionIt(props, tagName), {
      ...applyAnimation({ ..._imgProp, key: `img-${id}` }, props),
      ref: shouldConnectDrag ? (r) => {
        if (props.url) return;
        ref.current = r;
        connect(drag(r));
      } : undefined,
    });
  };

  // If in edit mode with inline tools, wrap in container
  if (enabled && isMounted) {
    const Img = createImgElement(false); // Don't connect drag to img, connect to wrapper

    // For all cases, wrap the image with tools renderer
    // Don't use dangerouslySetInnerHTML on the wrapper - it's on the SVG element itself
    prop.children = (
      <>
        {empty ? prop.children : Img}
        <InlineToolsRenderer key={`tools-${id}`} craftComponent={Image} props={props} />
      </>
    );

    const ele = props.url ? Link : "div";
    return React.createElement(ele, {
      ...prop,
      "aria-label": props.url ? (altText || titleText || "Image link") : undefined,
    });
  }

  // Preview mode - simpler structure
  const Img = createImgElement(true); // Connect drag to img directly

  // For inline SVG or regular images, wrap in container if there's a URL
  if (!empty) {
    if (props.url) {
      prop.children = Img;
      const ele = Link;
      return React.createElement(ele, {
        ...prop,
        "aria-label": altText || titleText || "Image link",
      });
    }
    // No URL, just return the image/svg directly
    return Img;
  }

  // Empty state
  const ele = "div";
  return React.createElement(ele, prop);
};

Image.craft = {
  displayName: "Image",
  rules: {
    canDrag: () => true,
    canMoveIn: () => false,
  },
  related: {
    toolbar: ImageSettings,
  },
  props: {
    tools: (props) => {
      const baseControls = [

        <DeleteNodeController key="imageDelete" />,
      ];

      return [...baseControls];
    },
  },
};
