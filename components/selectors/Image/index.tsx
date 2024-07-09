import { useEditor, useNode } from "@craftjs/core";
import { NameNodeController } from "components/editor/NodeControllers/NameNodeController";
import {
  getClonedState,
  setClonedProps,
} from "components/editor/Toolbar/Helpers/CloneHelper";
import { PreviewAtom, TabAtom, ViewAtom } from "components/editor/Viewport";
import Link from "next/link";
import React, { useRef } from "react";
import { TbCheck, TbPhoto } from "react-icons/tb";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { getMedialUrl, motionIt } from "utils/lib";
import { CSStoObj, ClassGenerator, applyAnimation } from "utils/tailwind";
import { BaseSelectorProps } from "..";
import { ImageSettings } from "./ImageSettings";

const NextImage = require("next/image");

export const ImageDefault = ({ tab, props }) => {
  const setActiveTab = useSetRecoilState(TabAtom);
  // console.log("default image")

  return (
    <div
      onClick={() => {
        setActiveTab(tab);
        // setTimeout(() => document.getElementById("files")?.click(), 50);
      }}
    >
      {props.isLoading && <div>Loading...</div>}
      {!props.isLoading && !props.loaded && <TbPhoto />}
      {props.loaded && <TbCheck />}
    </div>
  );
};

interface ImageProps extends BaseSelectorProps {
  videoId?: string;
  type?: string;
  content?: string;
  url?: string;
  priority?: string;
  loading?: string;
}

const defaultProps: ImageProps = {
  type: "img",
  className: [],
  root: {},
  mobile: {},
  tablet: {},
  desktop: {},
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
  const { actions, query, enabled } = useEditor((state) =>
    getClonedState(props, state)
  );

  const view = useRecoilValue(ViewAtom);
  const preview = useRecoilValue(PreviewAtom);

  const { videoId, content, type } = props;

  props = setClonedProps(props, query);
  const ref = useRef(null);

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

  prop.style = { ...prop.style, position: "relative" };

  const _imgProp: any = {
    loading: "eager", // or lazy
    alt: "",
    title: "",
    className: ClassGenerator(
      props,
      view,
      enabled,
      [],
      ["objectFit", "ojectPosition", "radius", "width", "height"],
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

    if (props.loading) {
      _imgProp.loading = props.loading;
    }

    if (props.priority) {
      const link = document.createElement("link");

      link.rel = "preload";
      link.href = _imgProp.src;
      link.as = "image";

      const preloadLink = document.querySelector(
        `link[rel="preload"][href="${link.href}"][as="image"]`
      );
      if (!preloadLink) document.head.appendChild(link);
    }
  }

  const empty = !videoId && !content;

  console.log({ videoId, content, empty });
  if (enabled) {
    if (empty) {
      prop.children = <ImageDefault tab="Image" props={props} />;
    }
    prop["data-bounding-box"] = enabled;
    prop["data-empty-state"] = empty;
    prop["node-id"] = id;
  }

  const tagName = empty ? "div" : type === "svg" ? "svg" : "img";

  const Img = React.createElement(motionIt(props, tagName), {
    ...applyAnimation({ ..._imgProp, ...prop, key: id }, props),
    ref: (r) => {
      if (props.url) return;
      ref.current = r;
      connect(drag(r));
    },
  });

  if (type !== "svg" && !empty) {
    prop.children = Img;
  }

  const ele = props.url ? Link : "div";

  if (props.url) {
    return React.createElement(ele, {
      ...prop,
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
        <NameNodeController position="top" align="end" placement="end" />,
      ];

      return [...baseControls];
    },
  },
};
