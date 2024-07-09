import { BaseSelectorProps, RootClassGenProps } from 'components/selectors';
import parse from 'style-to-object';
import colors from 'tailwindcss/lib/public/colors';
import { getFontFromComp } from './lib';

const funkyFonts = [
  ['Orbitron'],
  ['Press Start 2P'],
  ['Permanent Marker'],
  ['Sigmar One'],
  ['Saira Stencil One'],
  ['Russo One'],
  ['Quicksand'],
  ['Fredoka One'],
  ['Black Ops One'],
  ['Monofett'],
];

const top30GoogleFonts = [
  ['Oxygen'],
  ['Pacifico'],
  ['Open Sans'],
  ['Archivo Black'],
  ['Babylonica'],
  ['Inter'],
  ['Rubik'],
  ['Fira Sans'],
  ['Armio'],
  ['Josefin Sans'],
  ['Roboto'],
  ['Lato'],
  ['Slabo 27px'],
  ['Oswald'],
  ['Montserrat'],
  ['Raleway'],
  ['PT Sans'],
  ['Source Sans Pro'],
  ['Noto Sans'],
  ['Muli'],
  ['Playfair Display'],
  ['Indie Flower'],
  ['Inconsolata'],
  ['Bitter'],
  ['Titillium Web'],
  ['Droid Sans'],
  ['Crimson Text'],
  ['Nunito'],
  ['Merriweather'],
  ['Bree Serif'],
  ['Vollkorn'],
  ['EB Garamond'],
  ['Abel'],
  ['Quicksand'],
  ['Lora'],
  ['Cabin'],
  ['Hind'],
  ['Archivo Narrow'],
  ['Noto Serif'],
  ['Karla'],
  ['Francois One'],
];

export const fonts = [...top30GoogleFonts, ...funkyFonts];

const numbers = [
  'auto',
  '0',
  'px',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
  '52',
  '56',
  '60',
  '64',
  '72',
  '80',
  '96',
];

const borderRadiusClasses = [
  'rounded-none',
  'rounded-sm',
  'rounded',
  'rounded-lg',
  'rounded-full',
  'rounded-t-none',
  'rounded-r-none',
  'rounded-b-none',
  'rounded-l-none',
  'rounded-t-sm',
  'rounded-r-sm',
  'rounded-b-sm',
  'rounded-l-sm',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-t-lg',
  'rounded-r-lg',
  'rounded-b-lg',
  'rounded-l-lg',
  'rounded-t-full',
  'rounded-r-full',
  'rounded-b-full',
  'rounded-l-full',
];

const exclude = ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'];

export function getColorPallet() {
  return Object.keys(colors)
    .filter((_) => !exclude.includes(_))
    .map((key) => {
      const color = typeof colors[key] === 'object'
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

      if (typeof color === 'string') {
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
    'bg-repeat',
    'bg-no-repeat',
    'bg-repeat-x',
    'bg-repeat-y',
    'bg-repeat-round',
    'bg-repeat-space',
  ],
  backgroundSize: ['bg-auto', 'bg-cover', 'bg-contain'],
  backgroundAttachment: ['bg-fixed', 'bg-local', 'bg-scroll'],
  backgroundOrigin: [
    'bg-origin-border',
    'bg-origin-padding',
    'bg-origin-content',
  ],
  backgroundPosition: [
    'bg-bottom',
    'bg-center',
    'bg-left',
    'bg-left-bottom',
    'bg-left-top',
    'bg-right',
    'bg-right-bottom',
    'bg-right-top',
    'bg-top',
  ],
  gradients: [
    'bg-gradient-to-t',
    'bg-gradient-to-tr',
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    'bg-gradient-to-b',
    'bg-gradient-to-bl',
    'bg-gradient-to-l',
    'bg-gradient-to-tl',
  ],
  fontSize: [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
  ],
  fontWeight: [
    'font-thin',
    'font-extralight',
    'font-light',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'font-extrabold',
    'font-black',
  ],
  dropShadows: [
    'drop-shadow-none',
    'drop-shadow-sm',
    'drop-shadow-md',
    'drop-shadow-xl',
    'drop-shadow-2xl',
  ],
  radius: [
    'rounded-none',
    'rounded-sm',
    'rounded',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-[30px]',
    'rounded-full',
  ],
  maxHeights: [
    'max-h-0',
    'max-h-px',
    'max-h-0.5',
    'max-h-1',
    'max-h-1.5',
    'max-h-2',
    'max-h-2.5',
    'max-h-3',
    'max-h-3.5',
    'max-h-4',
    'max-h-5',
    'max-h-6',
    'max-h-7',
    'max-h-8',
    'max-h-9',
    'max-h-10',
    'max-h-11',
    'max-h-12',
    'max-h-14',
    'max-h-16',
    'max-h-20',
    'max-h-24',
    'max-h-28',
    'max-h-32',
    'max-h-36',
    'max-h-40',
    'max-h-44',
    'max-h-48',
    'max-h-52',
    'max-h-56',
    'max-h-60',
    'max-h-64',
    'max-h-72',
    'max-h-80',
    'max-h-96',
    'max-h-none',
    'max-h-full',
    'max-h-screen',
    'max-h-min',
    'max-h-max',
    'max-h-fit',
  ],
  maxWidths: [
    'max-w-0',
    'max-w-none',
    'max-w-xs',
    'max-w-sm',
    'max-w-md',
    'max-w-lg',
    'max-w-xl',
    'max-w-2xl',
    'max-w-3xl',
    'max-w-4xl',
    'max-w-5xl',
    'max-w-6xl',
    'max-w-7xl',
    'max-w-full',
    'max-w-min',
    'max-w-max',
    'max-w-fit',
    'max-w-prose',
    'max-w-screen-sm',
    'max-w-screen-md',
    'max-w-screen-lg',
    'max-w-screen-xl',
    'max-w-screen-2xl',
    '​',
  ],
  minHeights: [
    'min-h-0',
    'min-h-full',
    'min-h-screen',
    'min-h-min',
    'min-h-max',
    'min-h-fit',
  ],
  minWidths: ['min-w-0', 'min-w-full', 'min-w-min', 'min-w-max', 'min-w-fit'],
  allWidths: [
    'w-0',
    'w-px',
    'w-0.5',
    'w-1',
    'w-1.5',
    'w-2',
    'w-2.5',
    'w-3',
    'w-3.5',
    'w-4',
    'w-5',
    'w-6',
    'w-7',
    'w-8',
    'w-9',
    'w-10',
    'w-11',
    'w-12',
    'w-14',
    'w-16',
    'w-20',
    'w-24',
    'w-28',
    'w-32',
    'w-36',
    'w-40',
    'w-44',
    'w-48',
    'w-52',
    'w-56',
    'w-60',
    'w-64',
    'w-72',
    'w-80',
    'w-96',
    'w-auto',
    'w-1/2',
    'w-1/3',
    'w-2/3',
    'w-1/4',
    'w-2/4',
    'w-3/4',
    'w-1/5',
    'w-2/5',
    'w-3/5',
    'w-4/5',
    'w-1/6',
    'w-2/6',
    'w-3/6',
    'w-4/6',
    'w-5/6',
    'w-1/12',
    'w-2/12',
    'w-3/12',
    'w-4/12',
    'w-5/12',
    'w-6/12',
    'w-7/12',
    'w-8/12',
    'w-9/12',
    'w-10/12',
    'w-11/12',
    'w-full',
    'w-screen',
    'w-min',
    'w-max',
    'w-fit',
  ],

  width: [
    'w-auto',
    'w-min',
    'w-0',
    'w-px',
    'w-0.5',
    'w-1',
    'w-1.5',
    'w-2',
    'w-2.5',
    'w-3',
    'w-3.5',
    'w-4',
    'w-5',
    'w-6',
    'w-7',
    'w-8',
    'w-9',
    'w-10',
    'w-11',
    'w-12',
    'w-14',
    'w-16',
    'w-20',
    'w-24',
    'w-28',
    'w-32',
    'w-36',
    'w-40',
    'w-44',
    'w-48',
    'w-52',
    'w-56',
    'w-60',
    'w-64',
    'w-72',
    'w-80',
    'w-96',
    'w-1/12',
    'w-2/12',
    'w-3/12',
    'w-4/12',
    'w-5/12',
    'w-6/12',
    'w-7/12',
    'w-8/12',
    'w-9/12',
    'w-10/12',
    'w-11/12',
    'w-full',
    'w-fit',
  ],

  height: [
    'h-auto',
    'h-0',
    'h-px',
    'h-0.5',
    'h-1',
    'h-1.5',
    'h-2',
    'h-2.5',
    'h-3',
    'h-3.5',
    'h-4',
    'h-5',
    'h-6',
    'h-7',
    'h-8',
    'h-9',
    'h-10',
    'h-11',
    'h-12',
    'h-14',
    'h-16',
    'h-20',
    'h-24',
    'h-28',
    'h-32',
    'h-36',
    'h-40',
    'h-44',
    'h-48',
    'h-52',
    'h-56',
    'h-60',
    'h-64',
    'h-72',
    'h-80',
    'h-96',
    'h-full',
    'h-screen',
    'h-min',
    'h-max',
    'h-fit',
  ],
  opacity: [
    'opacity-0',
    'opacity-5',
    'opacity-10',
    'opacity-20',
    'opacity-25',
    'opacity-30',
    'opacity-40',
    'opacity-50',
    'opacity-60',
    'opacity-70',
    'opacity-75',
    'opacity-80',
    'opacity-90',
    'opacity-95',
    'opacity-100',
  ],
  backgroundOpacity: [],
  display: [
    'hidden',
    'block',
    'inline-block',
    'inline',
    'flex',
    'inline-flex',
    'table',
    'inline-table',
    'table-caption	',
    'table-cell',
    'table-column',
    'table-column-group',
    'table-footer-group',
    'table-header-group',
    'table-row-group',
    'table-row',
    'flow-root',
    'grid',
    'inline-grid',
    'contents',
    'list-item',
  ],
  leading: [
    'leading-3',
    'leading-4',
    'leading-5',
    'leading-6',
    'leading-7',
    'leading-8',
    'leading-9',
    'leading-10',
    'leading-none',
    'leading-tight',
    'leading-snug',
    'leading-normal',
    'leading-relaxed',
    'leading-loose',
  ],
  cursor: [
    'cursor-auto',
    'cursor-default',
    'cursor-pointer',
    'cursor-wait',
    'cursor-text',
    'cursor-move',
    'cursor-help',
    'cursor-not-allowed',
    'cursor-none',
    'cursor-context-menu',
    'cursor-progress',
    'cursor-cell',
    'cursor-crosshair',
    'cursor-vertical-text',
    'cursor-alias',
    'cursor-copy',
    'cursor-no-drop',
    'cursor-grab',
    'cursor-grabbing',
    'cursor-all-scroll',
    'cursor-col-resize',
    'cursor-row-resize',
    'cursor-n-resize',
    'cursor-e-resize',
    'cursor-s-resize',
    'cursor-w-resize',
    'cursor-ne-resize',
    'cursor-nw-resize',
    'cursor-se-resize',
    'cursor-sw-resize',
    'cursor-ew-resize',
    'cursor-ns-resize',
    'cursor-nesw-resize',
    'cursor-nwse-resize',
    'cursor-zoom-in',
    'cursor-zoom-out',
  ],
  overflow: [
    'overflow-auto',
    'overflow-hidden',
    'overflow-clip',
    'overflow-visible',
    'overflow-scroll',
    'overflow-x-auto',
    'overflow-y-auto',
    'overflow-x-hidden',
    'overflow-y-hidden',
    'overflow-x-clip',
    'overflow-y-clip',
    'overflow-x-visible',
    'overflow-y-visible',
    'overflow-x-scroll',
    'overflow-y-scroll',
  ],
  tracking: [
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wider',
    'tracking-wider',
    'tracking-widest',
  ],
  float: ['float-right', 'float-left', 'float-none'],
  flex: ['flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse'],
  flexBase: ['flex-1', 'flex-auto', 'flex-initial', 'flex-none'],
  helpers: ['flex'],
  wrap: ['flex-wrap', 'flex-wrap-reverse', 'flex-nowrap'],
  grow: ['grow', 'grow-0'],
  shrink: ['shrink', 'shrink-0'],
  justifyItems: [
    'justify-items-start',
    'justify-items-end',
    'justify-items-center',
    'justify-items-stretch',
  ],
  alignItems: [
    'items-start',
    'items-end',
    'items-center',
    'items-baseline',
    'items-stretch',
  ],
  justifyContent: [
    'justify-start',
    'justify-end',
    'justify-center',
    'justify-between',
    'justify-around',
    'justify-evenly',
  ],
  justifySelf: [
    'justify-self-auto',
    'justify-self-start',
    'justify-self-end',
    'justify-self-center',
    'justify-self-stretch',
  ],
  alignSelf: [
    'self-auto',
    'self-start',
    'self-end',
    'self-center',
    'self-stretch',
    'self-baseline',
  ],
  fonts: [...funkyFonts, ...top30GoogleFonts],
  objectFit: [
    'object-contain',
    'object-cover',
    'object-fill',
    'object-none',
    'object-scale-down',
  ],
  objectPosition: [
    'object-bottom',
    'object-center',
    'object-left',
    'object-left-bottom',
    'object-left-top',
    'object-right',
    'object-right-bottom',
    'object-right-top',
    'object-top',
  ],
  lineHeight: [
    'leading-3',
    'leading-4',
    'leading-5',
    'leading-6',
    'leading-7',
    'leading-8',
    'leading-9',
    'leading-10',
    'leading-none',
    'leading-tight',
    'leading-snug',
    'leading-normal',
    'leading-relaxed',
    'leading-loose',
  ],
  fontSmoothing: ['antialiased', 'subpixel-antialiased'],
  fontStyle: ['italic', 'not-italic'],
  textDecoration: ['underline', 'overline', 'line-through', 'no-underline'],
  decorationStyle: [
    'decoration-solid',
    'decoration-double',
    'decoration-dotted',
    'decoration-dashed',
    'decoration-wavy',
  ],
  decorationThickness: [
    'decoration-auto',
    'decoration-from-font',
    'decoration-0',
    'decoration-1',
    'decoration-2',
    'decoration-4',
    'decoration-8',
  ],
  whiteSpace: [
    'whitespace-normal',
    'whitespace-nowrap',
    'whitespace-pre',
    'whitespace-pre-line',
    'whitespace-pre-wrap',
  ],
  verticalAlign: [
    'align-baseline',
    'align-top',
    'align-middle',
    'align-bottom',
    'align-text-top',
    'align-text-bottom',
    'align-sub',
    'align-super',
  ],
  border: ['border', 'border-2', 'border-4', 'border-8'],

  borderStyle: [
    'border-solid',
    'border-dashed',
    'border-dotted',
    'border-double',
    'border-hidden',
    'border-none',
  ],
  boxShadow: [
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-inner',
    'shadow-none',
  ],
  order: [
    'order-1',
    'order-2',
    'order-3',
    'order-4',
    'order-5',
    'order-6',
    'order-7',
    'order-8',
    'order-9',
    'order-10',
    'order-11',
    'order-12',
    'order-first',
    'order-last',
    'order-none',
  ],
  position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
  transform: ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
  wordBreak: ['break-normal', 'break-words', 'break-all', 'break-keep'],
  textOverflow: ['truncate', 'text-ellipsis', 'text-clip'],
  indent: [
    'indent-0',
    'indent-px',
    'indent-0.5',
    'indent-1',
    'indent-1.5',
    'indent-2',
    'indent-2.5',
    'indent-3',
    'indent-3.5',
    'indent-4',
    'indent-5',
    'indent-6',
    'indent-7',
    'indent-8',
    'indent-9',
    'indent-10',
    'indent-11',
    'indent-12',
    'indent-14',
    'indent-16',
    'indent-20',
    'indent-24',
    'indent-28',
    'indent-32',
    'indent-36',
    'indent-40',
    'indent-44',
    'indent-48',
    'indent-52',
    'indent-56',
    'indent-60',
    'indent-64',
    'indent-72',
    'indent-80',
    'indent-96',
  ],
};

export const classNameToVar = (name) => Object.keys(TailwindStyles)
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
  'gap',
  'mx',
  'my',
  'px',
  'py',
  'ml',
  'mt',
  'mr',
  'mb',
  'pl',
  'pr',
  'pt',
  'pb',
].forEach((_) => {
  TailwindStyles[_] = genSizes(_, numbers);
});

TailwindStyles.background = genColor('bg');
TailwindStyles.text = genColor('text');

TailwindStyles.backgroundOpacity = genSizes('bg', TailwindStyles.opacity);

export const AllStyles = [];
Object.keys(TailwindStyles).map((_) => AllStyles.push(...TailwindStyles[_]));

export const StyleGuide = [
  {
    prop: 'fontSizes',
    title: 'Font Sizes',
    styles: TailwindStyles.fontSize,
  },
  {
    prop: 'width',
    title: 'Widths',
    styles: TailwindStyles.width,
  },
  {
    prop: 'dropShadows',
    title: 'Drop Shadows',
    styles: TailwindStyles.dropShadows,
  },
  {
    prop: 'colors',
    title: 'Colors',
    styles: getColors(),
  },
];

export const ClassGenerator = (
  props,
  view,
  enabled,
  exclude = [],
  only = [],
  preview = false,
  debug = false
): string => {
  const breakpoints = {
    sm: 'mobile',
    md: 'desktop',
  };

  if (view !== 'desktop') {
    delete breakpoints.md;
  }

  const rootProps = {};
  const results = [];

  if (props.root) {
    RootClassGenProps.forEach((_) => {
      if (_ === 'hover') return;
      rootProps[_] = props.root[_];
    });

    if (props.root.hover) {
      const hover = ClassGene(props.root.hover, exclude, only, 'hover:');
      results.push(...hover);
    }
  }

  if (props.hover) {
    const hover = ClassGene(props.hover, exclude, only, 'hover:');
    results.push(...hover);
  }

  if (props.className) {
    results.push(...props.className);
  }

  if (props.url || props.onClick) {
    results.push('cursor-pointer');
  }

  const bp = [];

  Object.keys(breakpoints).map((_) => bp.push(
    ...ClassGene(
      props[breakpoints[_]] || {},
      exclude,
      only,
      _ !== 'sm' ? `${_}:` : '',
      debug
    ).filter((_) => _ && _ !== ' ')
  ));

  const _p = props.desktop || {};

  const missingProps = only
    ? []
    : Object.keys(_p)
      .filter((key) => props?.mobile && !props?.mobile[key])
      .map((_) => _p[_]);

  let res = [
    ...ClassGene({ ...rootProps } || {}, exclude, only),
    ...bp,
    ...results,
    ...missingProps,
  ].join(' ');

  if (enabled) {
    if (res.includes('absolute') && res.includes('inset-0')) {
      res = res.replace('absolute', 'relative').replace('inset-0', '');
    }
  }

  return res;
};

export const classFilter = [
  'flexDirection',
  'flexBase',
  'alignItems',
  'alignSelf',
  'justifyContent',
  'justifySelf',
  'justifyItems',
  'flexGrow',
  'width',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight',
  'height',
  'px',
  'py',
  'mx',
  'my',
  'ml',
  'mt',
  'mr',
  'mb',
  'pl',
  'pr',
  'pt',
  'pb',

  'shadow',
  'transform',
  'wordBreak',
  'textOverflow',
  'indent',
  'textDecoration',

  'display',
  'gap',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'tracking',
  'textAlign',
  'objectFit',
  'objectPosition',

  'radius',
  'background',
  'color',
  'backgroundOpacity',
  'backgroundGradient',
  'backgroundGradientTo',
  'backgroundGradientFrom',

  'backgroundRepeat',
  'backgroundSize',
  'backgroundAttachment',
  'backgroundOrigin',
  'backgroundPosition',
  'borderColor',
  'bgOpacity',
  'borderStyle',
  'opacity',
  'order',
  'cursor',
  'overflow',
  'position',
];

export const ClassGene = (
  props,
  exclude = [],
  only = [],
  prefix = '',
  debug = false
) => {
  debug && console.log(exclude, only, props);
  const results = Object.keys(props)
    .filter((_) => classFilter.includes(_))
    .filter((_) => props[_] && !exclude.includes(_))
    .filter((_) => {
      if (!only.length) {
        return _;
      }

      const exists = only.includes(_);

      return exists;
    })
    .map((i) => props[i])
    .filter((_) => !['true', 'false', true, false].includes(_))
    .filter((_) => typeof _ === 'string')
    .filter((_) => _ && _ !== ' ')
    .filter((_) => _ && _ !== '')
    .map((_) => `${prefix}${_}`);

  if (only.length) return results;
  // .filter((_) => AllStyles.includes(_));

  if (props.border) {
    const split = props.border.split('-');
    let deleteBorder = false;

    const setBorder = (bord) => {
      results.push(bord);
      deleteBorder = true;
    };

    if (props.borderLeft) setBorder(`border-l-${split[1]}`);
    if (props.borderRight) setBorder(`border-r-${split[1]}`);
    if (props.borderTop) setBorder(`border-t-${split[1]}`);
    if (props.borderBottom) setBorder(`border-b-${split[1]}`);

    if (!deleteBorder) results.push(props.border);
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
    initial: 'hidden',
    whileInView: 'visible',
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
          type: 'spring',
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
    exit: {
      x: 1000,
      transition: {
        when: 'afterChildren',
        type: 'spring',
        duration: 0.5,
        ease: [0.61, 1, 0.88, 1],
        scale: {
          type: 'spring',
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
    prop.style.fontFamily = _root.fontFamily;
    getFontFromComp(props);
  }

  if (!_root?.animation || !animations[_root.animation]) {
    return prop;
  }

  prop = { ...prop, ...animations[_root.animation] };

  return prop;
};

export const fontWeightToNumber = {
  'font-thin': 100,
  'font-extralight': 200,
  'font-light': 300,
  'font-normal': 400,
  'font-medium': 500,
  'font-semibold': 600,
  'font-bold': 700,
  'font-extrabold': 800,
  'font-black': 900,
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
  height = 10
) => {
  function multiStroke(i) {
    let defColor = colors[i + 1];
    if (vHeight === 0 && maxColors > 2) {
      // if(colorCounts !== maxColors) defColor = colors[1];
      if (colorCounts === 3 && maxColors === 4 && i === 2) defColor = colors[1];
      else if (colorCounts === 4 && maxColors === 5 && i === 3) defColor = colors[1];
      else if (colorCounts === 3 && maxColors === 5 && i === 3) defColor = colors[1];
      else if (colorCounts === 3 && maxColors === 5 && i === 2) defColor = colors[1];
      else if (colorCounts === 2) defColor = colors[1];
    }
    if (mode === 'stroke-join') {
      strokeFill = ` stroke='${defColor}' fill='none'`;
      joinMode = join == 2
        ? "stroke-linejoin='round' stroke-linecap='round' "
        : "stroke-linecap='square' ";
    } else if (mode === 'stroke') {
      strokeFill = ` stroke='${defColor}' fill='none'`;
    } else strokeFill = ` stroke='none' fill='${defColor}'`;
    return path
      .split('~')
      [i].replace(
        '/>',
        ` transform='translate(${
          spacing[0] / 2
        },0)' ${
          joinMode
        }stroke-width='${
          stroke
        }'${
          strokeFill
        }/>`
      )
      .replace("transform='translate(0,0)' ", ' ');
  }
  let strokeFill = '';
  let joinMode = '';
  let strokeGroup = '';
  if (vHeight === 0 && maxColors > 2) {
    for (let i = 0; i < maxColors - 1; i++) strokeGroup += multiStroke(i);
  } else {
    for (let i = 0; i < colorCounts - 1; i++) strokeGroup += multiStroke(i);
  }
  const patternNew = '<svg id=\'patternId\' width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'><defs>'
    + `<pattern id='a' patternUnits='userSpaceOnUse' width='${
      width + spacing[0]
    }' height='${
    // (height * (colors.length - 1) + spacing[1] * ((colors.length - 1) * 0.5)) +
      height - vHeight * (maxColors - colorCounts) + spacing[1]
    }' patternTransform='scale(${
      scale
    }) rotate(${
      angle
    })'><rect x='0' y='0' width='100%' height='100%' fill='${
      colors[0]
    }'/>${
      strokeGroup
    }</pattern></defs><rect width='800%' height='800%' transform='translate(${
      scale * moveLeft
    },${
      scale * moveTop
    })' fill='url(#a)'/></svg>`;
  return patternNew.replace('#', '%23');
};
