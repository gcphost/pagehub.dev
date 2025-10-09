export interface BaseStyleProps {
  flexDirection?: string;
  flexBase?: string;
  alignItems?: string;
  justifyContent?: string;
  flexGrow?: string;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  lineHeight?: string;
  tracking?: string;
  height?: string;
  p?: string;
  m?: string;
  px?: string;
  py?: string;
  mx?: string;
  my?: string;
  ml?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  marginTop?: string;
  pl?: string;
  pr?: string;
  pt?: string;
  pb?: string;
  display?: string;
  gap?: string;
  fontSize?: string;
  fontWeight?: string;
  objectFit?: string;
  aspectRatio?: string;
  transform?: string;
  wordBreak?: string;
  textOverflow?: string;
  indent?: string;
  textDecoration?: string;
  textAlign?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  backgroundAttachment?: string;
  backgroundOrigin?: string;
  backgroundPosition?: string;
  overflow?: string;
  cursor?: string;
  position?: string;
  inset?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
}

export const RootClassGenProps = [
  "background",
  "color",
  "bgOpacity",
  "backgroundGradient",
  "backgroundGradientTo",
  "backgroundGradientFrom",
  "radius",
  "shadow",
  "border",
  "borderColor",
  "borderTop",
  "borderBottom",
  "borderLeft",
  "borderRight",
  "order",
];

export interface RootStyleProps {
  fontFamily?: string;
  style?: string;
  background?: string;
  color?: string;
  bgOpacity?: string;
  backgroundGradient?: string;
  backgroundGradientTo?: string;
  backgroundGradientFrom?: string;
  border?: string;
  borderColor?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  radius?: string;
  shadow?: string;
  animation?: string;
  pattern?: any;
  patternVerticalPosition?: string;
  patternHorizontalPosition?: string;
  patternStroke?: string;
  patternZoom?: string;
  patternColorA?: string;
  patternAngle?: string;
  patternColorB?: string;
  patternSpacingX?: string;
  patternSpacingY?: string;
  preset?: string;
  presetPadding?: string;
  presetMaxWidth?: string;
  placeholderColor?: string;
  focus?: {
    ring?: string;
    ringColor?: string;
    outline?: string;
  };
  hover?: {
    border?: string;
    borderColor?: string;
    borderTop?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderRight?: string;
  };
}

export interface BaseSelectorProps {
  belongsTo?: string;
  hasMany?: string[];
  relationType?: string;
  url?: string;
  urlTarget?: string;
  className?: string[];
  tools?: any;

  root?: RootStyleProps;
  tablet?: BaseStyleProps;
  desktop?: BaseStyleProps;
  mobile?: BaseStyleProps;
  hover?: BaseStyleProps;
  activeTab?: number;
  children?: React.ReactNode;
  type?: string;
  custom?: object;
  displayName?: string;
  canDelete?: boolean;
  canEditName?: boolean;
  backgroundImage?: string;
  backgroundImageType?: string;
  backgroundPriority?: string;
  backgroundFetchPriority?: "high" | "low" | "auto" | "";

  isLoading?: boolean;
  loaded?: boolean;
}
