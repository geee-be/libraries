import type { ThemableColorScale } from './themable-colors.js';

export const defaultColors: ThemableColorScale = {
  // base
  DEFAULT: ['hsl(0 0% 40%)', 'hsl(0 0% 60%)'],

  // muted
  muted: ['hsl(0 0% 60% / 0.5)', 'hsl(0 0% 40% / 0.5)'],
  'muted-fg': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],
};
