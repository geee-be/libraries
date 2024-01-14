import { defaultColors } from './default.js';
import { error } from './error.js';
import { info } from './info.js';
import { primary } from './primary.js';
import { secondary } from './secondary.js';
import { success } from './success.js';
import { warning } from './warning.js';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type ColorScale = {
  // 50: string | [string, string];
  '100': string | [string, string | [string, string]];
  '200': string | [string, string | [string, string]];
  '300': string | [string, string | [string, string]];
  '400': string | [string, string | [string, string]];
  '500': string | [string, string | [string, string]];
  '600': string | [string, string | [string, string]];
  '700': string | [string, string | [string, string]];
  '800': string | [string, string | [string, string]];
  '900': string | [string, string];
  'soft': string | [string, string];
  'soft-content': string | [string, string];
  'border': string | [string, string];
  'content': string | [string, string];
  'icon': string | [string, string];
  'DEFAULT': string | [string, string];
};

export type ThemableColorScale = Partial<ColorScale> | string;

export type ThemableColors = {
  background: string | [string, string];
  foreground: string | [string, string];
  default: ThemableColorScale;
  primary: ThemableColorScale;
  secondary: ThemableColorScale;
  info: ThemableColorScale;
  warning: ThemableColorScale;
  success: ThemableColorScale;
  error: ThemableColorScale;
  paper: ThemableColorScale;
  control: ThemableColorScale;
  surface: ThemableColorScale;
  destructive: ThemableColorScale;
};

/* -------------------------------------------------------------------------- */
const themableColorsVariable: ThemableColors = {
  background: ['hsl(255 0% 92%)', 'hsl(255 0% 10%)'],
  foreground: ['hsl(255 0% 10%)', 'hsl(255 0% 92%)'],

  default: defaultColors,
  primary,
  secondary,
  info,
  warning,
  success,
  error,
  paper: {
    DEFAULT: ['hsl(255, 0%, 100% / 0.5)', 'hsl(255 0% 20% / 0.35)'],
    border: ['hsl(255 0% 80% / 0.5)', 'hsl(255 0% 0% / 0.5)'],
    content: ['hsl(255 0% 28%)', 'hsl(255 0% 72%)'],
  },
  control: {
    DEFAULT: 'red', // TODO
    // border: 'hsl(var(--color-control-border))',
    // content: 'hsl(var(--color-control-content))',
    // error: 'hsl(var(--color-control-error))',
  },

  // primary: {
  //   ...palette.purple,
  //   DEFAULT: palette.purple[500],
  // },

  // secondary: {
  //   ...palette.gray,
  //   DEFAULT: palette.gray[900],
  // },

  surface: success,

  destructive: error,
};

// export const themableColorsDark: ThemableColors = {
//   background: palette.gray[900],
//   foreground: '#FFFFFF',

//   // primary: {
//   //   ...palette.purple,
//   //   DEFAULT: palette.purple[400],
//   //   600: palette.purple[500],
//   // },

//   // secondary: {
//   //   ...palette.white,
//   //   900: palette.gray[900],
//   //   DEFAULT: palette.white[900],
//   // },

//   surface: {
//     // 50: 'rgba(255,255,255, 0.1)',
//     100: 'rgba(255,255,255, 0.2)',
//     200: 'rgba(255,255,255, 0.3)',
//     300: 'rgba(255,255,255, 0.4)',
//     400: 'rgba(255,255,255, 0.5)',
//     500: 'rgba(255,255,255, 0.5)',
//     600: 'rgba(255,255,255, 0.7)',
//     700: 'rgba(255,255,255, 0.8)',
//     800: 'rgba(255,255,255, 0.9)',
//     900: '#FFFFFF',
//     DEFAULT: 'rgba(255,255,255, 0.1)',
//   },

//   destructive: {
//     ...palette.red,
//   },
// };

export const themableColors = {
  variable: themableColorsVariable,
} as const;
