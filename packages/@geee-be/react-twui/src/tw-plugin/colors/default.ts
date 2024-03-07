import type { ThemableColorScale } from './themable-colors.js';

export const defaultColors: ThemableColorScale = {
  // base
  DEFAULT: 'hsl(0 0% 50%)',

  // soft
  soft: ['hsl(0 0% 50% / 0.5)', 'hsl(0 0% 50% / 0.5)'],
  'soft-fg': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],

  // vivid
  vivid: ['hsl(0 0% 88% / 0.5)', 'hsl(0 0% 25% / 0.5)'],
  'vivid-fg': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],
};
