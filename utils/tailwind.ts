import { BaseSelectorProps, RootClassGenProps } from "components/selectors";
import parse from "style-to-object";
import colors from "tailwindcss/lib/public/colors";
import { toCSSVarName } from "./designSystemVars";
import { getFontFromComp, loadCombinedFonts } from "./lib";

/**
 * Legacy font list for backward compatibility
 * For new implementations, use googleFonts.ts utilities
 */
const legacyFonts = [
  // Popular fonts
  ["Roboto"],
  ["Open Sans"],
  ["Lato"],
  ["Montserrat"],
  ["Oswald"],
  ["Raleway"],
  ["PT Sans"],
  ["Source Sans Pro"],
  ["Noto Sans"],
  ["Merriweather"],
  ["Playfair Display"],
  ["Nunito"],
  ["Inter"],
  ["Rubik"],
  ["Fira Sans"],
  ["Poppins"],
  ["Work Sans"],
  ["Ubuntu"],
  ["Mukta"],
  ["Quicksand"],
  ["Karla"],
  ["Titillium Web"],
  ["Bitter"],
  ["Hind"],
  ["Cabin"],
  ["Crimson Text"],
  ["Inconsolata"],
  ["Oxygen"],
  ["Droid Sans"],
  ["Josefin Sans"],
  ["EB Garamond"],
  ["Abel"],
  ["Lora"],
  ["Noto Serif"],
  ["Archivo Narrow"],
  // Funky fonts
  ["Pacifico"],
  ["Orbitron"],
  ["Press Start 2P"],
  ["Permanent Marker"],
  ["Bebas Neue"],
  ["Russo One"],
  ["Fredoka One"],
  ["Lobster"],
  ["Righteous"],
  ["Indie Flower"],
];

/**
 * @deprecated Use googleFonts.ts utilities for full Google Fonts support
 * This is kept for backward compatibility only
 */
export const fonts = legacyFonts;

const numbers = [
  "auto",
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
];

const borderRadiusClasses = [
  "rounded-none",
  "rounded-sm",
  "rounded",
  "rounded-lg",
  "rounded-full",
  "rounded-t-none",
  "rounded-r-none",
  "rounded-b-none",
  "rounded-l-none",
  "rounded-t-sm",
  "rounded-r-sm",
  "rounded-b-sm",
  "rounded-l-sm",
  "rounded-t",
  "rounded-r",
  "rounded-b",
  "rounded-l",
  "rounded-t-lg",
  "rounded-r-lg",
  "rounded-b-lg",
  "rounded-l-lg",
  "rounded-t-full",
  "rounded-r-full",
  "rounded-b-full",
  "rounded-l-full",
];

const exclude = ["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"];

export function getColorPallet() {
  return Object.keys(colors)
    .filter((_) => !exclude.includes(_))
    .map((key) => {
      const color =
        typeof colors[key] === "object"
          ? Object.keys(colors[key]).map((_) => ({
              key: _,
              color: colors[key][_],
            }))
          : null;

      if (!color) {
        return null;
      }

      return {
        key,
        color,
      };
    })
    .filter((_) => _);
}

export function getColors() {
  const results = [];

  Object.keys(colors)
    .filter((_) => !exclude.includes(_))
    .map((key) => {
      const color = colors[key];

      if (typeof color === "string") {
        results.push(key);
        return;
      }

      Object.keys(color).map((option) => {
        results.push(`${key}-${option}`);
      });
    });

  return results;
}

/*
background?: string;
  backgroundImage?: string;
  color?: string;
  flexDirection?: string;
  alignItems?: string;
  fontFamily?: string;
  justifyContent?: string;
  fillSpace?: string;
  width?: string;
  height?: string;
  px?: string;
  py?: string;
  mx?: string;
  my?: string;
  shadow?: string;
  radius?: string;
  className?: string;
  style?: string;
  display?: string;
  gap?: string;
  animation?: string;
  fontSize?: string;
  fontWeight?: string;
  objectFit?: string;
  */

export const TailwindStyles = {
  m: [],
  p: [],
  mx: [],
  my: [],
  px: [],
  py: [],
  ml: [],
  mr: [],
  mb: [],
  mt: [],
  pl: [],
  pr: [],
  pb: [],
  pt: [],
  gap: [],
  background: [],
  text: [],
  backgroundRepeat: [
    "bg-repeat",
    "bg-no-repeat",
    "bg-repeat-x",
    "bg-repeat-y",
    "bg-repeat-round",
    "bg-repeat-space",
  ],
  backgroundSize: ["bg-auto", "bg-cover", "bg-contain"],
  backgroundAttachment: ["bg-fixed", "bg-local", "bg-scroll"],
  backgroundOrigin: [
    "bg-origin-border",
    "bg-origin-padding",
    "bg-origin-content",
  ],
  backgroundPosition: [
    "bg-bottom",
    "bg-center",
    "bg-left",
    "bg-left-bottom",
    "bg-left-top",
    "bg-right",
    "bg-right-bottom",
    "bg-right-top",
    "bg-top",
  ],
  gradients: [
    "bg-gradient-to-t",
    "bg-gradient-to-tr",
    "bg-gradient-to-r",
    "bg-gradient-to-br",
    "bg-gradient-to-b",
    "bg-gradient-to-bl",
    "bg-gradient-to-l",
    "bg-gradient-to-tl",
  ],
  fontSize: [
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7xl",
    "text-8xl",
    "text-9xl",
  ],
  fontWeight: [
    "font-thin",
    "font-extralight",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "font-extrabold",
    "font-black",
  ],
  dropShadows: [
    "drop-shadow-none",
    "drop-shadow-sm",
    "drop-shadow-md",
    "drop-shadow-xl",
    "drop-shadow-2xl",
  ],
  radius: [
    "rounded-none",
    "rounded-sm",
    "rounded",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "rounded-[30px]",
    "rounded-full",
  ],
  maxHeights: [
    "max-h-0",
    "max-h-px",
    "max-h-0.5",
    "max-h-1",
    "max-h-1.5",
    "max-h-2",
    "max-h-2.5",
    "max-h-3",
    "max-h-3.5",
    "max-h-4",
    "max-h-5",
    "max-h-6",
    "max-h-7",
    "max-h-8",
    "max-h-9",
    "max-h-10",
    "max-h-11",
    "max-h-12",
    "max-h-14",
    "max-h-16",
    "max-h-20",
    "max-h-24",
    "max-h-28",
    "max-h-32",
    "max-h-36",
    "max-h-40",
    "max-h-44",
    "max-h-48",
    "max-h-52",
    "max-h-56",
    "max-h-60",
    "max-h-64",
    "max-h-72",
    "max-h-80",
    "max-h-96",
    "max-h-none",
    "max-h-full",
    "max-h-screen",
    "max-h-min",
    "max-h-max",
    "max-h-fit",
  ],
  maxHeight: [
    "max-h-0",
    "max-h-px",
    "max-h-0.5",
    "max-h-1",
    "max-h-1.5",
    "max-h-2",
    "max-h-2.5",
    "max-h-3",
    "max-h-3.5",
    "max-h-4",
    "max-h-5",
    "max-h-6",
    "max-h-7",
    "max-h-8",
    "max-h-9",
    "max-h-10",
    "max-h-11",
    "max-h-12",
    "max-h-14",
    "max-h-16",
    "max-h-20",
    "max-h-24",
    "max-h-28",
    "max-h-32",
    "max-h-36",
    "max-h-40",
    "max-h-44",
    "max-h-48",
    "max-h-52",
    "max-h-56",
    "max-h-60",
    "max-h-64",
    "max-h-72",
    "max-h-80",
    "max-h-96",
    "max-h-none",
    "max-h-full",
    "max-h-screen",
    "max-h-min",
    "max-h-max",
    "max-h-fit",
  ],
  marginTop: [
    "mt-auto",
    "mt-0",
    "mt-px",
    "mt-0.5",
    "mt-1",
    "mt-1.5",
    "mt-2",
    "mt-2.5",
    "mt-3",
    "mt-3.5",
    "mt-4",
    "mt-5",
    "mt-6",
    "mt-7",
    "mt-8",
    "mt-9",
    "mt-10",
    "mt-11",
    "mt-12",
    "mt-14",
    "mt-16",
    "mt-20",
    "mt-24",
    "mt-28",
    "mt-32",
    "mt-36",
    "mt-40",
    "mt-44",
    "mt-48",
    "mt-52",
    "mt-56",
    "mt-60",
    "mt-64",
    "mt-72",
    "mt-80",
    "mt-96",
    "-mt-0",
    "-mt-px",
    "-mt-0.5",
    "-mt-1",
    "-mt-1.5",
    "-mt-2",
    "-mt-2.5",
    "-mt-3",
    "-mt-3.5",
    "-mt-4",
    "-mt-5",
    "-mt-6",
    "-mt-7",
    "-mt-8",
    "-mt-9",
    "-mt-10",
    "-mt-11",
    "-mt-12",
    "-mt-14",
    "-mt-16",
    "-mt-20",
    "-mt-24",
    "-mt-28",
    "-mt-32",
    "-mt-36",
    "-mt-40",
    "-mt-44",
    "-mt-48",
    "-mt-52",
    "-mt-56",
    "-mt-60",
    "-mt-64",
    "-mt-72",
    "-mt-80",
    "-mt-96",
  ],
  maxWidths: [
    "max-w-0",
    "max-w-none",
    "max-w-xs",
    "max-w-sm",
    "max-w-md",
    "max-w-lg",
    "max-w-xl",
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
    "max-w-7xl",
    "max-w-full",
    "max-w-min",
    "max-w-max",
    "max-w-fit",
    "max-w-prose",
    "max-w-screen-sm",
    "max-w-screen-md",
    "max-w-screen-lg",
    "max-w-screen-xl",
    "max-w-screen-2xl",
    "​",
  ],
  minHeights: [
    "min-h-0",
    "min-h-full",
    "min-h-screen",
    "min-h-min",
    "min-h-max",
    "min-h-fit",
  ],
  minWidths: ["min-w-0", "min-w-full", "min-w-min", "min-w-max", "min-w-fit"],
  minHeight: [
    "min-h-0",
    "min-h-full",
    "min-h-screen",
    "min-h-min",
    "min-h-max",
    "min-h-fit",
  ],
  allWidths: [
    "w-0",
    "w-px",
    "w-0.5",
    "w-1",
    "w-1.5",
    "w-2",
    "w-2.5",
    "w-3",
    "w-3.5",
    "w-4",
    "w-5",
    "w-6",
    "w-7",
    "w-8",
    "w-9",
    "w-10",
    "w-11",
    "w-12",
    "w-14",
    "w-16",
    "w-20",
    "w-24",
    "w-28",
    "w-32",
    "w-36",
    "w-40",
    "w-44",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
    "w-auto",
    "w-1/2",
    "w-1/3",
    "w-2/3",
    "w-1/4",
    "w-2/4",
    "w-3/4",
    "w-1/5",
    "w-2/5",
    "w-3/5",
    "w-4/5",
    "w-1/6",
    "w-2/6",
    "w-3/6",
    "w-4/6",
    "w-5/6",
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
    "w-full",
    "w-screen",
    "w-min",
    "w-max",
    "w-fit",
  ],

  width: [
    "w-auto",
    "w-min",
    "w-0",
    "w-px",
    "w-0.5",
    "w-1",
    "w-1.5",
    "w-2",
    "w-2.5",
    "w-3",
    "w-3.5",
    "w-4",
    "w-5",
    "w-6",
    "w-7",
    "w-8",
    "w-9",
    "w-10",
    "w-11",
    "w-12",
    "w-14",
    "w-16",
    "w-20",
    "w-24",
    "w-28",
    "w-32",
    "w-36",
    "w-40",
    "w-44",
    "w-48",
    "w-52",
    "w-56",
    "w-60",
    "w-64",
    "w-72",
    "w-80",
    "w-96",
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
    "w-full",
    "w-fit",
  ],

  height: [
    "h-auto",
    "h-0",
    "h-px",
    "h-0.5",
    "h-1",
    "h-1.5",
    "h-2",
    "h-2.5",
    "h-3",
    "h-3.5",
    "h-4",
    "h-5",
    "h-6",
    "h-7",
    "h-8",
    "h-9",
    "h-10",
    "h-11",
    "h-12",
    "h-14",
    "h-16",
    "h-20",
    "h-24",
    "h-28",
    "h-32",
    "h-36",
    "h-40",
    "h-44",
    "h-48",
    "h-52",
    "h-56",
    "h-60",
    "h-64",
    "h-72",
    "h-80",
    "h-96",
    "h-full",
    "h-screen",
    "h-min",
    "h-max",
    "h-fit",
  ],
  opacity: [
    "opacity-0",
    "opacity-5",
    "opacity-10",
    "opacity-20",
    "opacity-25",
    "opacity-30",
    "opacity-40",
    "opacity-50",
    "opacity-60",
    "opacity-70",
    "opacity-75",
    "opacity-80",
    "opacity-90",
    "opacity-95",
    "opacity-100",
  ],
  backgroundOpacity: [],
  display: [
    "hidden",
    "block",
    "inline-block",
    "inline",
    "flex",
    "inline-flex",
    "table",
    "inline-table",
    "table-caption	",
    "table-cell",
    "table-column",
    "table-column-group",
    "table-footer-group",
    "table-header-group",
    "table-row-group",
    "table-row",
    "flow-root",
    "grid",
    "inline-grid",
    "contents",
    "list-item",
  ],
  leading: [
    "leading-3",
    "leading-4",
    "leading-5",
    "leading-6",
    "leading-7",
    "leading-8",
    "leading-9",
    "leading-10",
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose",
  ],
  cursor: [
    "cursor-auto",
    "cursor-default",
    "cursor-pointer",
    "cursor-wait",
    "cursor-text",
    "cursor-move",
    "cursor-help",
    "cursor-not-allowed",
    "cursor-none",
    "cursor-context-menu",
    "cursor-progress",
    "cursor-cell",
    "cursor-crosshair",
    "cursor-vertical-text",
    "cursor-alias",
    "cursor-copy",
    "cursor-no-drop",
    "cursor-grab",
    "cursor-grabbing",
    "cursor-all-scroll",
    "cursor-col-resize",
    "cursor-row-resize",
    "cursor-n-resize",
    "cursor-e-resize",
    "cursor-s-resize",
    "cursor-w-resize",
    "cursor-ne-resize",
    "cursor-nw-resize",
    "cursor-se-resize",
    "cursor-sw-resize",
    "cursor-ew-resize",
    "cursor-ns-resize",
    "cursor-nesw-resize",
    "cursor-nwse-resize",
    "cursor-zoom-in",
    "cursor-zoom-out",
  ],
  overflow: [
    "overflow-auto",
    "overflow-hidden",
    "overflow-clip",
    "overflow-visible",
    "overflow-scroll",
    "overflow-x-auto",
    "overflow-y-auto",
    "overflow-x-hidden",
    "overflow-y-hidden",
    "overflow-x-clip",
    "overflow-y-clip",
    "overflow-x-visible",
    "overflow-y-visible",
    "overflow-x-scroll",
    "overflow-y-scroll",
  ],
  tracking: [
    "tracking-tighter",
    "tracking-tight",
    "tracking-normal",
    "tracking-wider",
    "tracking-wider",
    "tracking-widest",
  ],
  float: ["float-right", "float-left", "float-none"],
  flex: ["flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse"],
  flexBase: ["flex-1", "flex-auto", "flex-initial", "flex-none"],
  helpers: ["flex"],
  wrap: ["flex-wrap", "flex-wrap-reverse", "flex-nowrap"],
  grow: ["grow", "grow-0"],
  shrink: ["shrink", "shrink-0"],
  justifyItems: [
    "justify-items-start",
    "justify-items-end",
    "justify-items-center",
    "justify-items-stretch",
  ],
  alignItems: [
    "items-start",
    "items-end",
    "items-center",
    "items-baseline",
    "items-stretch",
  ],
  justifyContent: [
    "justify-start",
    "justify-end",
    "justify-center",
    "justify-between",
    "justify-around",
    "justify-evenly",
  ],
  justifySelf: [
    "justify-self-auto",
    "justify-self-start",
    "justify-self-end",
    "justify-self-center",
    "justify-self-stretch",
  ],
  alignSelf: [
    "self-auto",
    "self-start",
    "self-end",
    "self-center",
    "self-stretch",
    "self-baseline",
  ],
  fonts: legacyFonts,
  objectFit: [
    "object-contain",
    "object-cover",
    "object-fill",
    "object-none",
    "object-scale-down",
  ],
  objectPosition: [
    "object-bottom",
    "object-center",
    "object-left",
    "object-left-bottom",
    "object-left-top",
    "object-right",
    "object-right-bottom",
    "object-right-top",
    "object-top",
  ],
  aspectRatio: ["aspect-auto", "aspect-square", "aspect-video"],
  lineHeight: [
    "leading-3",
    "leading-4",
    "leading-5",
    "leading-6",
    "leading-7",
    "leading-8",
    "leading-9",
    "leading-10",
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose",
  ],
  fontSmoothing: ["antialiased", "subpixel-antialiased"],
  fontStyle: ["italic", "not-italic"],
  textDecoration: ["underline", "overline", "line-through", "no-underline"],
  decorationStyle: [
    "decoration-solid",
    "decoration-double",
    "decoration-dotted",
    "decoration-dashed",
    "decoration-wavy",
  ],
  decorationThickness: [
    "decoration-auto",
    "decoration-from-font",
    "decoration-0",
    "decoration-1",
    "decoration-2",
    "decoration-4",
    "decoration-8",
  ],
  whiteSpace: [
    "whitespace-normal",
    "whitespace-nowrap",
    "whitespace-pre",
    "whitespace-pre-line",
    "whitespace-pre-wrap",
  ],
  verticalAlign: [
    "align-baseline",
    "align-top",
    "align-middle",
    "align-bottom",
    "align-text-top",
    "align-text-bottom",
    "align-sub",
    "align-super",
  ],
  border: ["border", "border-2", "border-4", "border-8"],

  borderStyle: [
    "border-solid",
    "border-dashed",
    "border-dotted",
    "border-double",
    "border-hidden",
    "border-none",
  ],
  boxShadow: [
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
    "shadow-inner",
    "shadow-none",
  ],
  order: [
    "order-1",
    "order-2",
    "order-3",
    "order-4",
    "order-5",
    "order-6",
    "order-7",
    "order-8",
    "order-9",
    "order-10",
    "order-11",
    "order-12",
    "order-first",
    "order-last",
    "order-none",
  ],
  position: ["static", "fixed", "absolute", "relative", "sticky"],
  inset: [
    "inset-0",
    "inset-px",
    "inset-0.5",
    "inset-1",
    "inset-1.5",
    "inset-2",
    "inset-2.5",
    "inset-3",
    "inset-3.5",
    "inset-4",
    "inset-5",
    "inset-6",
    "inset-7",
    "inset-8",
    "inset-9",
    "inset-10",
    "inset-11",
    "inset-12",
    "inset-14",
    "inset-16",
    "inset-20",
    "inset-24",
    "inset-28",
    "inset-32",
    "inset-36",
    "inset-40",
    "inset-44",
    "inset-48",
    "inset-52",
    "inset-56",
    "inset-60",
    "inset-64",
    "inset-72",
    "inset-80",
    "inset-96",
    "inset-auto",
    "inset-1/2",
    "inset-1/3",
    "inset-2/3",
    "inset-1/4",
    "inset-2/4",
    "inset-3/4",
    "inset-full",
    "inset-x-0",
    "inset-x-px",
    "inset-x-0.5",
    "inset-x-1",
    "inset-x-1.5",
    "inset-x-2",
    "inset-x-2.5",
    "inset-x-3",
    "inset-x-3.5",
    "inset-x-4",
    "inset-x-5",
    "inset-x-6",
    "inset-x-7",
    "inset-x-8",
    "inset-x-9",
    "inset-x-10",
    "inset-x-11",
    "inset-x-12",
    "inset-x-14",
    "inset-x-16",
    "inset-x-20",
    "inset-x-24",
    "inset-x-28",
    "inset-x-32",
    "inset-x-36",
    "inset-x-40",
    "inset-x-44",
    "inset-x-48",
    "inset-x-52",
    "inset-x-56",
    "inset-x-60",
    "inset-x-64",
    "inset-x-72",
    "inset-x-80",
    "inset-x-96",
    "inset-x-auto",
    "inset-x-1/2",
    "inset-x-1/3",
    "inset-x-2/3",
    "inset-x-1/4",
    "inset-x-2/4",
    "inset-x-3/4",
    "inset-x-full",
    "inset-y-0",
    "inset-y-px",
    "inset-y-0.5",
    "inset-y-1",
    "inset-y-1.5",
    "inset-y-2",
    "inset-y-2.5",
    "inset-y-3",
    "inset-y-3.5",
    "inset-y-4",
    "inset-y-5",
    "inset-y-6",
    "inset-y-7",
    "inset-y-8",
    "inset-y-9",
    "inset-y-10",
    "inset-y-11",
    "inset-y-12",
    "inset-y-14",
    "inset-y-16",
    "inset-y-20",
    "inset-y-24",
    "inset-y-28",
    "inset-y-32",
    "inset-y-36",
    "inset-y-40",
    "inset-y-44",
    "inset-y-48",
    "inset-y-52",
    "inset-y-56",
    "inset-y-60",
    "inset-y-64",
    "inset-y-72",
    "inset-y-80",
    "inset-y-96",
    "inset-y-auto",
    "inset-y-1/2",
    "inset-y-1/3",
    "inset-y-2/3",
    "inset-y-1/4",
    "inset-y-2/4",
    "inset-y-3/4",
    "inset-y-full",
  ],
  top: [
    "top-0",
    "top-px",
    "top-0.5",
    "top-1",
    "top-1.5",
    "top-2",
    "top-2.5",
    "top-3",
    "top-3.5",
    "top-4",
    "top-5",
    "top-6",
    "top-7",
    "top-8",
    "top-9",
    "top-10",
    "top-11",
    "top-12",
    "top-14",
    "top-16",
    "top-20",
    "top-24",
    "top-28",
    "top-32",
    "top-36",
    "top-40",
    "top-44",
    "top-48",
    "top-52",
    "top-56",
    "top-60",
    "top-64",
    "top-72",
    "top-80",
    "top-96",
    "top-auto",
    "top-1/2",
    "top-1/3",
    "top-2/3",
    "top-1/4",
    "top-2/4",
    "top-3/4",
    "top-full",
  ],
  right: [
    "right-0",
    "right-px",
    "right-0.5",
    "right-1",
    "right-1.5",
    "right-2",
    "right-2.5",
    "right-3",
    "right-3.5",
    "right-4",
    "right-5",
    "right-6",
    "right-7",
    "right-8",
    "right-9",
    "right-10",
    "right-11",
    "right-12",
    "right-14",
    "right-16",
    "right-20",
    "right-24",
    "right-28",
    "right-32",
    "right-36",
    "right-40",
    "right-44",
    "right-48",
    "right-52",
    "right-56",
    "right-60",
    "right-64",
    "right-72",
    "right-80",
    "right-96",
    "right-auto",
    "right-1/2",
    "right-1/3",
    "right-2/3",
    "right-1/4",
    "right-2/4",
    "right-3/4",
    "right-full",
  ],
  bottom: [
    "bottom-0",
    "bottom-px",
    "bottom-0.5",
    "bottom-1",
    "bottom-1.5",
    "bottom-2",
    "bottom-2.5",
    "bottom-3",
    "bottom-3.5",
    "bottom-4",
    "bottom-5",
    "bottom-6",
    "bottom-7",
    "bottom-8",
    "bottom-9",
    "bottom-10",
    "bottom-11",
    "bottom-12",
    "bottom-14",
    "bottom-16",
    "bottom-20",
    "bottom-24",
    "bottom-28",
    "bottom-32",
    "bottom-36",
    "bottom-40",
    "bottom-44",
    "bottom-48",
    "bottom-52",
    "bottom-56",
    "bottom-60",
    "bottom-64",
    "bottom-72",
    "bottom-80",
    "bottom-96",
    "bottom-auto",
    "bottom-1/2",
    "bottom-1/3",
    "bottom-2/3",
    "bottom-1/4",
    "bottom-2/4",
    "bottom-3/4",
    "bottom-full",
  ],
  left: [
    "left-0",
    "left-px",
    "left-0.5",
    "left-1",
    "left-1.5",
    "left-2",
    "left-2.5",
    "left-3",
    "left-3.5",
    "left-4",
    "left-5",
    "left-6",
    "left-7",
    "left-8",
    "left-9",
    "left-10",
    "left-11",
    "left-12",
    "left-14",
    "left-16",
    "left-20",
    "left-24",
    "left-28",
    "left-32",
    "left-36",
    "left-40",
    "left-44",
    "left-48",
    "left-52",
    "left-56",
    "left-60",
    "left-64",
    "left-72",
    "left-80",
    "left-96",
    "left-auto",
    "left-1/2",
    "left-1/3",
    "left-2/3",
    "left-1/4",
    "left-2/4",
    "left-3/4",
    "left-full",
  ],
  zIndex: ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50", "z-auto"],
  transform: ["uppercase", "lowercase", "capitalize", "normal-case"],
  wordBreak: ["break-normal", "break-words", "break-all", "break-keep"],
  textOverflow: ["truncate", "text-ellipsis", "text-clip"],
  indent: [
    "indent-0",
    "indent-px",
    "indent-0.5",
    "indent-1",
    "indent-1.5",
    "indent-2",
    "indent-2.5",
    "indent-3",
    "indent-3.5",
    "indent-4",
    "indent-5",
    "indent-6",
    "indent-7",
    "indent-8",
    "indent-9",
    "indent-10",
    "indent-11",
    "indent-12",
    "indent-14",
    "indent-16",
    "indent-20",
    "indent-24",
    "indent-28",
    "indent-32",
    "indent-36",
    "indent-40",
    "indent-44",
    "indent-48",
    "indent-52",
    "indent-56",
    "indent-60",
    "indent-64",
    "indent-72",
    "indent-80",
    "indent-96",
  ],
};

export const classNameToVar = (name) =>
  Object.keys(TailwindStyles)
    .filter((_) => !RootClassGenProps.includes(_))
    .filter((key) => TailwindStyles[key].includes(name))
    .find(() => true);

const genSizes = (size, input) => {
  const data = [];

  input.forEach((_) => data.push(`${size}-${_}`));

  return data;
};

export const genColor = (size) => {
  const data = [];

  getColors().forEach((_) => data.push(`${size}-${_}`));

  return data;
};

[
  "m",
  "p",
  "gap",
  "mx",
  "my",
  "px",
  "py",
  "ml",
  "mt",
  "mr",
  "mb",
  "pl",
  "pr",
  "pt",
  "pb",
].forEach((_) => {
  TailwindStyles[_] = genSizes(_, numbers);
});

TailwindStyles.background = genColor("bg");
TailwindStyles.text = genColor("text");

TailwindStyles.backgroundOpacity = genSizes("bg", TailwindStyles.opacity);

export const AllStyles = [];
Object.keys(TailwindStyles).map((_) => AllStyles.push(...TailwindStyles[_]));

// Add custom color classes (primary, secondary, accent) with all shades
const customColors = ["primary", "secondary", "accent"];
const shades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
  "DEFAULT",
];
customColors.forEach((color) => {
  shades.forEach((shade) => {
    const suffix = shade === "DEFAULT" ? "" : `-${shade}`;
    AllStyles.push(`bg-${color}${suffix}`);
    AllStyles.push(`text-${color}${suffix}`);
    AllStyles.push(`border-${color}${suffix}`);
  });
});

export const StyleGuide = [
  {
    prop: "fontSizes",
    title: "Font Sizes",
    styles: TailwindStyles.fontSize,
  },
  {
    prop: "width",
    title: "Widths",
    styles: TailwindStyles.width,
  },
  {
    prop: "dropShadows",
    title: "Drop Shadows",
    styles: TailwindStyles.dropShadows,
  },
  {
    prop: "colors",
    title: "Colors",
    styles: getColors(),
  },
];

// LRU Cache for ClassGenerator results
class LRUCache {
  private cache: Map<string, { value: string; timestamp: number }>;
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: string, value: string): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// Global cache instance
const classGeneratorCache = new LRUCache(1000);

// Clear cache when palette or style guide changes (called from Background component)
export const clearClassCache = () => {
  classGeneratorCache.clear();
};

// Helper to create a stable cache key
const createCacheKey = (
  props: any,
  view: string,
  enabled: boolean,
  exclude: string[],
  only: string[],
  preview: boolean,
  paletteHash: string,
): string => {
  // Create a minimal, stable representation
  const key = {
    // Only include props that affect class generation
    root: props.root,
    mobile: props.mobile,
    tablet: props.tablet,
    desktop: props.desktop,
    hover: props.hover,
    focus: props.focus,
    placeholder: props.placeholder,
    className: props.className,
    url: props.url,
    onClick: props.onClick,
    view,
    enabled,
    exclude: exclude.sort().join(","),
    only: only.sort().join(","),
    preview,
    palette: paletteHash,
  };

  return JSON.stringify(key);
};

// Helper to create a hash of the palette for cache key
const hashPalette = (palette: any[]): string => {
  if (!palette || palette.length === 0) return "empty";
  // Create a simple hash of palette names and colors
  return palette.map((p) => `${p.name}:${p.color}`).join("|");
};

// Helper to convert palette array to Map for O(1) lookups
const createPaletteMap = (palette: any[]): Map<string, string> => {
  const map = new Map<string, string>();
  if (!palette) return map;

  for (const item of palette) {
    if (item && item.name && item.color) {
      map.set(item.name, item.color);
    }
  }

  return map;
};

// Helper to resolve style guide references
// For color values -> CSS variables: "style:inputBorderColor" -> "var(--ph-input-border-color)"
// For utility classes -> direct values: "style:borderRadius" -> "rounded-lg"
const resolveStyleGuide = (value: string, query: any): string => {
  if (typeof value === "string" && value.startsWith("style:")) {
    try {
      const { ROOT_NODE } = require("@craftjs/core");

      // If query is not provided, try to get it from the editor context
      let actualQuery = query;
      if (
        !actualQuery &&
        typeof window !== "undefined" &&
        (window as any).__CRAFT_EDITOR__
      ) {
        actualQuery = (window as any).__CRAFT_EDITOR__.query;
      }

      const root = actualQuery?.node(ROOT_NODE).get();
      if (root && root.data.props.styleGuide) {
        const styleProp = value.replace("style:", "").trim();
        const styleValue = root.data.props.styleGuide[styleProp];

        // Use CSS variables for actual CSS values (not Tailwind utility classes)
        const cssVarProps = [
          // Colors
          "inputBorderColor",
          "inputBgColor",
          "inputTextColor",
          "inputPlaceholderColor",
          "inputFocusRingColor",
          "linkColor",
          "linkHoverColor",
          // Sizes & measurements
          "inputBorderWidth",
          "inputBorderRadius",
          "inputPadding",
          "inputFocusRing",
        ];

        if (cssVarProps.includes(styleProp)) {
          // For colors, return CSS variable reference
          const varName = toCSSVarName(styleProp);
          return `var(--ph-${varName})`;
        }

        // For everything else (utility classes), return the actual value
        return styleValue || value;
      }
    } catch (e) {
      // Silently fail - return original value
    }
  }
  return value;
};

export const ClassGenerator = (
  props,
  view,
  enabled,
  exclude = [],
  only = [],
  preview = false,
  debug = false,
  palette = [],
  query = null,
): string => {
  // Check cache first
  const paletteHash = hashPalette(palette);
  const cacheKey = createCacheKey(
    props,
    view,
    enabled,
    exclude,
    only,
    preview,
    paletteHash,
  );
  const cached = classGeneratorCache.get(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  // Cache miss - generate classes
  // Convert palette to Map for O(1) lookups
  const paletteMap = createPaletteMap(palette);
  const breakpoints = {
    sm: "mobile",
    md: "desktop",
  };

  if (view !== "desktop") {
    delete breakpoints.md;
  }

  const rootProps = {};
  const results = [];

  if (props.root) {
    RootClassGenProps.forEach((_) => {
      if (_ === "hover" || _ === "focus" || _ === "placeholderColor") return;
      rootProps[_] = props.root[_];
    });

    if (props.root.hover) {
      const hover = ClassGene(
        props.root.hover,
        exclude,
        only,
        "hover:",
        false,
        paletteMap,
        query,
      );
      results.push(...hover);
    }

    if (props.root.focus) {
      const focus = ClassGene(
        props.root.focus,
        exclude,
        only,
        "focus:",
        false,
        paletteMap,
        query,
      );
      results.push(...focus);
    }

    if (props.root.placeholderColor) {
      // Handle placeholder color specially - resolve palette and style guide references
      let placeholderValue = props.root.placeholderColor;

      // Strip any prefix from the value first (e.g., "placeholder-style:..." -> "style:...")
      const prefixMatch = placeholderValue.match(
        /^([a-z]+-)(style:|palette:)(.+)$/,
      );
      if (prefixMatch) {
        // Remove the prefix, we'll add "placeholder:" later
        placeholderValue = `${prefixMatch[2]}${prefixMatch[3]}`;
      }

      // Resolve style guide reference first
      if (
        typeof placeholderValue === "string" &&
        placeholderValue.includes("style:")
      ) {
        placeholderValue = resolveStyleGuide(placeholderValue, query);
      }

      // Resolve palette reference
      if (
        typeof placeholderValue === "string" &&
        placeholderValue.includes("palette:")
      ) {
        const match = placeholderValue.match(/^([a-z]+-)?palette:(.+)$/);
        if (match) {
          const prefixPart = match[1] || "";
          const paletteName = match[2];
          const paletteColor = paletteMap.get(paletteName);
          if (paletteColor) {
            let colorValue = paletteColor;
            const prefixesToStrip = [
              "bg-",
              "text-",
              "border-",
              "ring-",
              "placeholder-",
            ];
            for (const stripPrefix of prefixesToStrip) {
              if (colorValue.startsWith(stripPrefix)) {
                colorValue = colorValue.substring(stripPrefix.length);
                break;
              }
            }
            placeholderValue = colorValue;
          }
        }
      }

      results.push(`placeholder:${placeholderValue}`);
    }
  }

  if (props.hover) {
    const hover = ClassGene(
      props.hover,
      exclude,
      only,
      "hover:",
      false,
      paletteMap,
      query,
    );
    results.push(...hover);
  }

  if (props.focus) {
    const focus = ClassGene(
      props.focus,
      exclude,
      only,
      "focus:",
      false,
      paletteMap,
      query,
    );
    results.push(...focus);
  }

  if (props.placeholder) {
    const placeholder = ClassGene(
      props.placeholder,
      exclude,
      only,
      "placeholder:",
      false,
      paletteMap,
      query,
    );
    results.push(...placeholder);
  }

  if (props.className) {
    results.push(...props.className);
  }

  if (props.url || props.onClick) {
    results.push("cursor-pointer");
  }

  const bp = [];

  Object.keys(breakpoints).map((_) =>
    bp.push(
      ...ClassGene(
        props[breakpoints[_]] || {},
        exclude,
        only,
        _ !== "sm" ? `${_}:` : "",
        debug,
        paletteMap,
        query,
      ).filter((_) => _ && _ !== " "),
    ),
  );

  const _p = props.desktop || {};

  const missingProps = only
    ? []
    : Object.keys(_p)
        .filter((key) => props?.mobile && !props?.mobile[key])
        .map((_) => _p[_]);

  let res = [
    ...ClassGene({ ...rootProps }, exclude, only, "", false, paletteMap, query),
    ...bp,
    ...results,
    ...missingProps,
  ].join(" ");

  if (enabled) {
    if (res.includes("absolute") && res.includes("inset-0")) {
      res = res.replace("absolute", "relative").replace("inset-0", "");
    }
  }

  // Store in cache before returning
  classGeneratorCache.set(cacheKey, res);

  return res;
};

export const classFilter = [
  "flexDirection",
  "flexBase",
  "alignItems",
  "alignSelf",
  "justifyContent",
  "justifySelf",
  "justifyItems",
  "flexGrow",
  "width",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "height",
  "m",
  "p",
  "px",
  "py",
  "mx",
  "my",
  "ml",
  "mt",
  "mr",
  "mb",
  "marginTop",
  "pl",
  "pr",
  "pt",
  "pb",

  "shadow",
  "transform",
  "wordBreak",
  "textOverflow",
  "indent",
  "textDecoration",

  "display",
  "gap",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "tracking",
  "textAlign",
  "objectFit",
  "objectPosition",
  "aspectRatio",

  "radius",
  "background",
  "color",
  "backgroundOpacity",
  "backgroundGradient",
  "backgroundGradientTo",
  "backgroundGradientFrom",

  "backgroundRepeat",
  "backgroundSize",
  "backgroundAttachment",
  "backgroundOrigin",
  "backgroundPosition",
  "borderColor",
  "bgOpacity",
  "borderStyle",
  "opacity",
  "order",
  "cursor",
  "overflow",
  "position",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "ring",
  "ringColor",
  "outline",
];

export const ClassGene = (
  props,
  exclude = [],
  only = [],
  prefix = "",
  debug = false,
  paletteMap: Map<string, string> = new Map(),
  query = null,
) => {
  debug && console.log(exclude, only, props);

  // Pre-compiled regex patterns for better performance
  const STYLE_PALETTE_REGEX = /^([a-z]+-)?(?:(style|palette):)(.+)$/;
  const PALETTE_REGEX = /^([a-z]+-)?palette:(.+)$/;

  // Helper to resolve palette references to CSS variables
  // "bg-palette:Primary" -> "bg-[var(--ph-primary)]"
  // "palette:Primary" -> "var(--ph-primary)"
  const resolvePalette = (value: string) => {
    if (typeof value === "string" && value.includes("palette:")) {
      // Handle formats like "bg-palette:Brand" or "text-palette:Accent"
      const match = value.match(PALETTE_REGEX);
      if (match) {
        const prefixPart = match[1] || ""; // e.g., "bg-" or "text-"
        const paletteName = match[2]; // e.g., "Brand"

        // Convert palette name to CSS variable name
        const varName = toCSSVarName(paletteName);
        const cssVar = `var(--ph-${varName})`;

        // Return with Tailwind arbitrary value syntax if there's a prefix
        if (prefixPart) {
          return `${prefixPart}[${cssVar}]`;
        }

        return cssVar;
      }
    }
    return value;
  };

  // Optimized: Single-pass reduce instead of multiple filter/map chains
  const results = Object.keys(props).reduce((acc, key) => {
    // Early exits for performance
    if (!classFilter.includes(key)) return acc;
    if (!props[key] || exclude.includes(key)) return acc;
    if (only.length && !only.includes(key)) return acc;

    let value = props[key];

    // Type and value checks
    if (["true", "false", true, false].includes(value)) return acc;
    if (typeof value !== "string") return acc;
    if (!value || value === " " || value === "") return acc;

    // Handle style/palette references with pre-compiled regex
    if (value.includes("style:") || value.includes("palette:")) {
      const match = value.match(STYLE_PALETTE_REGEX);
      if (match) {
        const prefixPart = match[1] || "";
        const refType = match[2];
        const refName = match[3];

        let resolvedValue;

        if (refType === "palette") {
          resolvedValue = resolvePalette(`palette:${refName}`);
        } else {
          resolvedValue = resolveStyleGuide(`style:${refName}`, query);
          // Nested palette resolution
          if (resolvedValue.includes("palette:")) {
            resolvedValue = resolvePalette(resolvedValue);
          }
        }

        // If we have a prefix and the resolved value is a CSS variable, wrap in brackets
        if (prefixPart && resolvedValue.startsWith("var(--")) {
          value = `${prefixPart}[${resolvedValue}]`;
        } else {
          value = `${prefixPart}${resolvedValue}`;
        }
      }
    } else {
      // Resolve any remaining references
      value = resolvePalette(value);
      value = resolveStyleGuide(value, query);
    }

    // Add prefix and push to results
    acc.push(`${prefix}${value}`);
    return acc;
  }, []);

  if (only.length) return results;
  // .filter((_) => AllStyles.includes(_));

  if (props.border) {
    // Resolve style guide reference if present
    let borderValue = props.border;
    if (typeof borderValue === "string" && borderValue.includes("style:")) {
      borderValue = resolveStyleGuide(borderValue, query);
    }

    const split = borderValue.split("-");
    let deleteBorder = false;

    const setBorder = (bord) => {
      results.push(bord);
      deleteBorder = true;
    };

    if (props.borderLeft) setBorder(`border-l-${split[1]}`);
    if (props.borderRight) setBorder(`border-r-${split[1]}`);
    if (props.borderTop) setBorder(`border-t-${split[1]}`);
    if (props.borderBottom) setBorder(`border-b-${split[1]}`);

    if (!deleteBorder) results.push(borderValue);
  }

  // Handle radius - similar to border handling
  // This ensures radius values work even with CSS variables
  if (props.radius) {
    // Resolve style guide reference if present
    let radiusValue = props.radius;
    if (typeof radiusValue === "string" && radiusValue.includes("style:")) {
      radiusValue = resolveStyleGuide(radiusValue, query);
    }

    // Add the radius value (should already be in format like "rounded-lg" or "rounded-[var(--ph-border-radius)]")
    if (radiusValue && !results.some((r) => r && r.startsWith("rounded"))) {
      results.push(radiusValue);
    }
  }

  const res = results.filter((_) => _);

  return res;
};

export const CSStoObj = (pro) => {
  try {
    return parse(pro);
  } catch (e) {
    return null;
  }
};

const animations = {
  tween: {
    animate: { rotate: 360 },
    transition: { duration: 3 },
    exit: { rotate: 360 },
  },

  spring: {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true },
    transition: { duration: 0.5 },
    variants: {
      visible: { opacity: 1, scale: 1 },
      hidden: { opacity: 0, scale: 0 },
    },
  },
  hoverGrow: {
    whileHover: {
      scale: 1.1,
      transition: { duration: 1 },
    },
    whileTap: { scale: 0.9 },
  },
  abounce: {
    initial: { opacity: 0, delay: 2 },
    animate: { opacity: 1 },
    exit: { opacity: 0, left: -200 },
    transition: { duration: 2 },
  },
  bounce: {
    initial: {
      x: 0,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 2,
        duration: 0.5,
        ease: [0.61, 1, 0.88, 1],
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
    exit: {
      x: 1000,
      transition: {
        when: "afterChildren",
        type: "spring",
        duration: 0.5,
        ease: [0.61, 1, 0.88, 1],
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
  },
};

/*
const repeat = animate={{ rotate: 360 }}
transition={{ ease: "linear", duration: 2, repeat: Infinity }}
hoverscale
whileHover={{ scale: 0.8 }}
whileTap={{ rotate: 90, scale: 0.75 }}
*/

export const applyAnimation = (prop: any = {}, props: BaseSelectorProps) => {
  // _prop is what we send in and out
  // props is all components props

  const _root = props.root;
  const style = _root?.style ? CSStoObj(_root.style) || {} : {};

  prop.style = { ...prop.style, ...style };

  if (_root?.fontFamily) {
    // Resolve style guide reference if present (pass null for query, will be handled internally)
    const resolvedFontFamily = resolveStyleGuide(_root.fontFamily, null);
    prop.style.fontFamily = resolvedFontFamily;

    // Create a copy of props with resolved fontFamily for font loading
    const resolvedProps = {
      ...props,
      root: {
        ...props.root,
        fontFamily: resolvedFontFamily,
      },
    };
    getFontFromComp(resolvedProps);
  }

  if (!_root?.animation || !animations[_root.animation]) {
    return prop;
  }

  prop = { ...prop, ...animations[_root.animation] };

  // Load all collected fonts in a single request
  loadCombinedFonts();

  return prop;
};

export const fontWeightToNumber = {
  "font-thin": 100,
  "font-extralight": 200,
  "font-light": 300,
  "font-normal": 400,
  "font-medium": 500,
  "font-semibold": 600,
  "font-bold": 700,
  "font-extrabold": 800,
  "font-black": 900,
};

const svgPattern = (
  colors,
  colorCounts,
  stroke,
  scale,
  spacing,
  angle,
  join,
  moveLeft,
  moveTop,
  vHeight = 10,
  maxColors,
  mode,
  path,
  width,
  height = 10,
) => {
  function multiStroke(i) {
    let defColor = colors[i + 1];
    if (vHeight === 0 && maxColors > 2) {
      // if(colorCounts !== maxColors) defColor = colors[1];
      if (colorCounts === 3 && maxColors === 4 && i === 2) defColor = colors[1];
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
    } else strokeFill = ` stroke='none' fill='${defColor}'`;
    return path
      .split("~")
      [i].replace(
        "/>",
        ` transform='translate(${spacing[0] / 2},0)' ${joinMode}stroke-width='${
          stroke
        }'${strokeFill}/>`,
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
      // (height * (colors.length - 1) + spacing[1] * ((colors.length - 1) * 0.5)) +
      height - vHeight * (maxColors - colorCounts) + spacing[1]
    }' patternTransform='scale(${scale}) rotate(${
      angle
    })'><rect x='0' y='0' width='100%' height='100%' fill='${colors[0]}'/>${
      strokeGroup
    }</pattern></defs><rect width='800%' height='800%' transform='translate(${
      scale * moveLeft
    },${scale * moveTop})' fill='url(#a)'/></svg>`;
  return patternNew.replace("#", "%23");
};
