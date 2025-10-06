import { useEditor, useNode } from "@craftjs/core";
import { InlineToolsRenderer } from "components/editor/InlineToolsRenderer";
import { DeleteNodeController } from "components/editor/NodeControllers/DeleteNodeController";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { TbCheck, TbPhoto } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getMedialUrl, motionIt } from "utils/lib";
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

  // Look up metadata from media library at render time
  let mediaMetadata = null;
  if (videoId && type === "cdn") {
    try {
      const backgroundNode = query.node("ROOT").get();
      if (backgroundNode) {
        const pageMedia = backgroundNode.data.props.pageMedia || [];
        const media = pageMedia.find((m: any) => m.id === videoId);
        if (media?.metadata) {
          mediaMetadata = media.metadata;
        }
      }
    } catch (e) {
      // Silent fail - just use props if lookup fails
    }
  }

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
    className: `${ClassGenerator(
      props,
      view,
      enabled,
      ["objectFit", "ojectPosition"],
      [],
      preview
    )}`,
  };


  // Use metadata from media library, fallback to props
  const altText = mediaMetadata?.alt || props.alt || mediaMetadata?.title || props.title || "";
  const titleText = mediaMetadata?.title || props.title || "";

  const _imgProp: any = {
    loading: props.loading || "lazy",
    alt: altText,
    title: titleText,
    role: !altText && !titleText ? "presentation" : undefined,
    className: ClassGenerator(
      props,
      view,
      enabled,
      [],
      ["objectFit", "objectPosition", "radius"],
      preview
    ),
    // width: "100",
    // height: "100",
    // fill: true,
  };

  if (type === "svg" && content) {
    prop.dangerouslySetInnerHTML = { __html: content };
  } else {
    _imgProp.src = getMedialUrl(props);

    // Loading attribute is already set above with default fallback

    // Add fetchpriority attribute to the img element
    if (props.fetchPriority) {
      _imgProp.fetchpriority = props.fetchPriority;
    }

    // Add preload link to document head when priority is enabled
    if (props.priority && typeof document !== "undefined") {
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
  } else if (type === "svg") {
    tagName = "svg";
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

    if (type !== "svg" && !empty) {
      prop.children = (
        <>
          {Img}
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Image} props={props} />
        </>
      );
    } else {
      prop.children = (
        <>
          {prop.children}
          <InlineToolsRenderer key={`tools-${id}`} craftComponent={Image} props={props} />
        </>
      );
    }



    const ele = props.url ? Link : "div";
    return React.createElement(ele, {
      ...prop,
      "aria-label": props.url ? (altText || titleText || "Image link") : undefined,
    });
  }

  // Preview mode - simpler structure
  const Img = createImgElement(true); // Connect drag to img directly

  if (type !== "svg" && !empty) {
    prop.children = Img;
  }

  const ele = props.url ? Link : "div";

  if (props.url) {
    return React.createElement(ele, {
      ...prop,
      "aria-label": altText || titleText || "Image link",
    });
  }

  return Img;
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
        <NameNodeController
          position="top"
          align="end"
          placement="end"
          key="image-1"
        />,
        <DeleteNodeController key="imageDelete" />,
      ];

      return [...baseControls];
    },
  },
};
