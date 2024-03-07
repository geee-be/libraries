import type { ThemableColorScale } from './themable-colors.js';

export const defaultColors: ThemableColorScale = {
  // base
  DEFAULT: 'hsl(0 0% 50%)',
  content: ['hsl(0 0% 90%)', 'hsl(0 0% 10%)'],

  // soft
  soft: ['hsl(0 0% 50% / 0.5)', 'hsl(0 0% 50% / 0.5)'],
  'soft-content': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],

  // vivid
  vivid: ['hsl(0 0% 88% / 0.5)', 'hsl(0 0% 25% / 0.5)'],
  'vivid-content': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],
};
