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
  // default
  DEFAULT: string | [string, string];
  fg: string | [string, string];

  // soft
  soft: string | [string, string];
  'soft-fg': string | [string, string];

  // vivid
  vivid: string | [string, string];
  'vivid-fg': string | [string, string];
} & Record<string, string | [string, string]>;

type ControlColors = {
  focus: string | [string, string];
  DEFAULT: string | [string, string];
} & Record<string, string | [string, string]>;

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
  control: ControlColors;
  surface: ThemableColorScale;
  destructive: ThemableColorScale;
};

/* -------------------------------------------------------------------------- */
export const themableColors: ThemableColors = {
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
    DEFAULT: ['hsl(255, 0%, 98%)', 'hsl(255 0% 15%)'],
    nested: ['hsl(255, 0%, 90% / 0.35)', 'hsl(255 0% 10% / 0.35)'],
    border: ['hsl(255 0% 80% / 0.5)', 'hsl(255 0% 0% / 0.5)'],
    fg: ['hsl(255 0% 28%)', 'hsl(255 0% 72%)'],
  },
  control: {
    DEFAULT: ['hsl(255, 0%, 98%)', 'hsl(255 0% 15%)'],
    focus: '#EC740C',
  },

  surface: error,

  destructive: error,
};
