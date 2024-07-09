import { ROOT_NODE } from "@craftjs/core";
import { BaseSelectorProps } from "components/selectors";
import { parse } from "css-tree";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { atom } from "recoil";
import { TailwindStyles } from "./tailwind";

export const enableContext = false;
export const enableAnimations = false;

export const siteTitle =
  "Pagehub (beta) - Create a fast landing page in seconds - Free!";
export const siteDescription =
  "Create stunning single page applications and components with TailwindCSS and OpenAI. No code going strong!";

function extractRGBA(rgbaString) {
  const regex = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)/;
  const matches = rgbaString.match(regex);

  if (!matches) {
    return null;
  }

  return {
    r: parseInt(matches[1]),
    g: parseInt(matches[2]),
    b: parseInt(matches[3]),
    a: parseFloat(matches[4]),
  };
}

function hexToHSL(H) {
  if (!H) return;

  const c = extractRGBA(H);

  if (!c) return;
  let { r, g, b, a } = c;

  let l = 0;
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsla(${h},${s}%,${l}%,${a})`;
}

export const IsolateAtom = atom({
  key: "isolate",
  default: "",
});

export const ComponentsAtom = atom({
  key: "components",
  default: [],
});

export const OnlineAtom = atom({
  key: "online",
  default: true,
});

export const ScreenshotAtom = atom({
  key: "ss",
  default: false,
});

export const SideBarAtom = atom({
  key: "sidebar",
  default: true,
});

export const SideBarOpen = atom({
  key: "sidebaropen",
  default: true,
});

export const PageCountAtom = atom({
  key: "pagecount",
  default: 0,
});

export const LastctiveAtom = atom({
  key: "lastActive",
  default: "",
});

export const ActiveAtom = atom({
  key: "active",
  default: "",
});

export const DialogOpen = atom({
  key: "dialoge",
  default: "",
});

export const MenuState = atom({
  key: "menustate",
  default: false,
});

export const MenuItemState = atom({
  key: "menuitemstate",
  default: "",
});

export const normalizePozition = (mouseX, mouseY, scope, contextMenu) => {
  // ? compute what is the mouse position relative to the container element (scope)
  const { left: scopeOffsetX, top: scopeOffsetY } =
    scope.getBoundingClientRect();

  const scopeX = mouseX - scopeOffsetX;
  const scopeY = mouseY - scopeOffsetY;

  // ? check if the element will go out of bounds
  const outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth;

  const outOfBoundsOnY = scopeY + contextMenu.clientHeight > scope.clientHeight;

  let normalizedX = mouseX;
  let normalizedY = mouseY;

  // ? normalzie on X
  if (outOfBoundsOnX) {
    normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
  }

  // ? normalize on Y
  if (outOfBoundsOnY) {
    normalizedY = scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
  }

  return { normalizedY, normalizedX };
};

export const fontFAmilies = () => {
  TailwindStyles.fonts
    .reduce((acc, font) => {
      const family = font[0].replace(/ +/g, "+");
      const weights = ([400] || []).join(",");

      return [...acc, family + (weights && `:${weights}`)];
    }, [])
    .join("|");
};

export const getStyleSheets = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const links = document.getElementsByTagName("link") || [];
  const filtered = [];
  let i = links.length;
  while (i--) {
    links[i].rel === "stylesheet" && filtered.push(links[i].href);
  }

  return filtered;
};

export const generatePattern = (props) => {
  const {
    pattern,
    patternVerticalPosition,
    patternHorizontalPosition,
    patternStroke,
    patternZoom,
    patternAngle,
    patternSpacingX,
    patternSpacingY,
  } = props.root;

  let {
    stroke,
    scale,
    spacing,
    angle,
    moveLeft,
    moveTop,
    vHeight,
    mode,
    path,
    width,
    height,
    colors: maxColors,
  } = pattern;

  const join = 1;
  stroke = patternStroke || 1;
  moveLeft = patternHorizontalPosition || 0;
  moveTop = patternVerticalPosition || 0;
  maxColors = maxColors || 0;
  scale = patternZoom || 1;
  angle = patternAngle || 0;

  const co = [
    "transparent",
    ...[...Array(maxColors - 1).keys()]
      .map((_) => hexToHSL(props.root[`patternColor${+_ + 1}`]))
      .filter((_) => _),
  ];

  spacing = spacing || [+patternSpacingX || 0, +patternSpacingY || 0];

  const svgPattern = (
    colors,
    colorCounts,
    stroke,
    scale,
    spacing,
    angle,
    join,
    moveLeft,
    moveTop
  ) => {
    function multiStroke(i) {
      let defColor = colors[i + 1];
      if (vHeight === 0 && maxColors > 2) {
        if (colorCounts === 3 && maxColors === 4 && i === 2)
          defColor = colors[1];
        else if (colorCounts === 4 && maxColors === 5 && i === 3)
          defColor = colors[1];
        else if (colorCounts === 3 && maxColors === 5 && i === 3)
          defColor = colors[1];
        else if (colorCounts === 3 && maxColors === 5 && i === 2)
          defColor = colors[1];
        else if (colorCounts === 2) defColor = colors[1];
      }
      if (mode === "stroke-join") {
        strokeFill = ` stroke='${defColor}' fill='none'`;
        joinMode =
          join == 2
            ? "stroke-linejoin='round' stroke-linecap='round' "
            : "stroke-linecap='square' ";
      } else if (mode === "stroke") {
        strokeFill = ` stroke='${defColor}' fill='none'`;
      } else strokeFill = ` stroke='none' fill='${defColor || "white"}'`;
      return path
        .split("~")
        [i].replace(
          "/>",
          ` transform='translate(${spacing[0] / 2},0)' ${
            joinMode
          }stroke-width='${stroke}'${strokeFill}/>`
        )
        .replace("transform='translate(0,0)' ", " ");
    }
    let strokeFill = "";
    let joinMode = "";
    let strokeGroup = "";
    if (vHeight === 0 && maxColors > 2) {
      for (let i = 0; i < maxColors - 1; i++) strokeGroup += multiStroke(i);
    } else {
      for (let i = 0; i < colorCounts - 1; i++) strokeGroup += multiStroke(i);
    }

    const patternNew =
      "<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs>" +
      `<pattern id='a' patternUnits='userSpaceOnUse' width='${
        width + spacing[0]
      }' height='${
        height - vHeight * (maxColors - colorCounts) + spacing[1]
      }' patternTransform='scale(${scale}) rotate(${
        angle
      })'><rect x='0' y='0' width='100%' height='100%' fill='${
        colors[0] || "white"
      }'/>${
        strokeGroup
      }</pattern></defs><rect width='800%' height='800%' transform='translate(${
        scale * moveLeft
      },${scale * moveTop})' fill='url(#a)'/></svg>`;
    return `"data:image/svg+xml,${patternNew.replace("#", "%23")}"`;
  };

  return svgPattern(
    co,
    maxColors,
    stroke,
    scale,
    spacing,
    angle,
    join,
    moveLeft,
    moveTop
  );
};

export const getMedialUrl = (props) => {
  const { videoId, content, type } = props;

  if (type === "img" && videoId) return videoId;

  if (type === "cdn" && videoId)
    return `https://imagedelivery.net/8PYt12v3QMuDRiYrOftNUQ/${videoId}/public`;
};

export const getBackgroundUrl = (props) => {
  if (props.backgroundImage) {
    const type = props.backgroundImageType;
    const content = props.backgroundImage;

    if (type === "cdn" && content)
      return `https://imagedelivery.net/8PYt12v3QMuDRiYrOftNUQ/${content}/public`;

    return content;
  }

  return null;
};

export const applyPattern = (prop, props: BaseSelectorProps, settings) => {
  if (props.root?.pattern) {
    const patt = generatePattern(props);

    if (patt) {
      prop.style = prop.style || {};
      prop.style.backgroundImage = `url(${patt})`;
    }
  }

  return prop;
};

export const applyBackgroundImage = (
  prop,
  props: BaseSelectorProps,
  settings
) => {
  if (props.backgroundImage) {
    const _imgProp = { src: getBackgroundUrl(props) };

    if (_imgProp.src) {
      prop.style = prop.style || {};
      prop.style.backgroundImage = `url(${_imgProp.src})`;
    }
  }

  return prop;
};

export const getFontFromComp = (props: BaseSelectorProps) => {
  if (!props.root.fontFamily) return;

  let href = `https://fonts.googleapis.com/css?family=${props.root.fontFamily[0].replace(
    / +/g,
    "+"
  )}`;

  const weights = [
    ...new Set(
      ["desktop", "mobile", "tablet"].map((_) => (props[_] || {}).fontWeight)
    ),
  ].filter((_) => _);

  if (!weights.length) {
    weights.push("font-normal");
  }

  href += `:400,${weights.join(",")}`;

  href += "&display=swap";

  const filtered = getStyleSheets();

  if (filtered.includes(href)) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const head = document.getElementsByTagName("HEAD")[0];

  const link = document.createElement("link");

  link.rel = "stylesheet";
  link.href = href;

  head.appendChild(link);
};

export const autoOpenMenu = (menu, setMenu, id, node) => {
  useEffect(() => {
    if (menu.id !== id) {
      setMenu({
        enabled: true,
        id,
        parent: node.data.parent,
      });
    }
  }, []);
};

export const useDefaultTab = (head, activeTab, setActiveTab) => {
  useEffect(() => {
    if (!head) return;
    if (!head.find((_) => _.title === activeTab)) {
      setActiveTab(head[0].title);
    }
  }, [head, activeTab]);
};

export const selectAfterAdding = (selectNode, setActiveTab, id, enabled) => {
  useEffect(() => {
    if (!id || !enabled) return;

    selectNode(id);
    setActiveTab("");
  }, [id, enabled]);
};

export const motionIt = (props, tagName) =>
  props.root?.animation ? motion(tagName) : tagName;

export const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

export const getPageCount = (query) => {
  const root = query.node(ROOT_NODE).get();

  const pageCount = !root
    ? []
    : root?.data?.nodes.filter(
        (_) => query.node(_).get().data.props.type === "page"
      ) || [];

  return pageCount;
};

export const isolatePage = (
  isolate,
  query,
  active,
  actions,
  setIsolate,
  select = true
) => {
  const root = query.node(ROOT_NODE).get();
  const _active = active ? active.valueOf() : null;

  root.data.nodes
    .map((_) => {
      const _props = query.node(_).get();

      if (!_props || _props?.data?.props?.type !== "page") return _;

      actions.setHidden(_, false);
      actions.setProp(_, (prop) => (prop.hidden = false));

      return _;
    })
    .filter((_) => _ !== _active)
    .forEach((_) => {
      const _props = query.node(_).get();

      if (!_props || _props?.data?.props?.type !== "page") return;

      actions.setHidden(_, !isolate);
      actions.setProp(_, (prop) => (prop.hidden = !isolate));
    });

  if (select) setTimeout(() => actions.selectNode(_active), 100);

  setIsolate(!isolate ? _active : "");
  localStorage.setItem("isolated", !isolate ? _active : "");
};

export const isolatePageAlt = (
  isolate,
  query,
  active,
  actions,
  setIsolate,
  select = true
) => {
  const root = query.node(ROOT_NODE).get();
  const _active = active ? active.valueOf() : null;

  root.data.nodes
    .map((_) => {
      const _props = query.node(_).get();

      if (!_props || _props?.data?.props?.type !== "page") return _;

      actions.setHidden(_, !!active);
      actions.setProp(_, (prop) => (prop.hidden = !!active));

      return _;
    })
    .filter((_) => _ === _active)
    .forEach((_) => {
      const _props = query.node(_).get();

      if (!_props || _props?.data?.props?.type !== "page") return;

      actions.setHidden(_, false);
      actions.setProp(_, (prop) => (prop.hidden = false));
    });

  if (select) setTimeout(() => actions.selectNode(_active), 100);

  setIsolate(active);
  localStorage.setItem("isolated", active);
};

export const isCssValid = (code: string): boolean => {
  try {
    parse(code);
    return true;
  } catch (err) {
    return false;
  }
};

export const isJsValid = (code: string): boolean => {
  const strippedCode = code.replace(/<script[^>]*>|<\/script>/gi, "");

  try {
    new Function(strippedCode);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const popupCenter = (url, title) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `width=${500 / systemZoom},height=${
      550 / systemZoom
    },top=${top},left=${left}`
  );

  newWindow?.focus();
};
