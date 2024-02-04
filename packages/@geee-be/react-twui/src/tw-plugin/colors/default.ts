import type { ThemableColorScale } from './themable-colors.js';

export const defaultColors: ThemableColorScale = {
  // base
  'DEFAULT': 'hsl(0 0% 50%)',
  'content': ['hsl(0 0% 20%)', 'hsl(0 0% 80%)'],

  // soft
  'soft': ['hsl(0 0% 25% / 0.5)', 'hsl(0 0% 88% / 0.5)'],
  'soft-content': ['hsl(0 0% 88%)', 'hsl(0 0% 25%)'],

  // vivid
  'vivid': ['hsl(0 0% 88% / 0.5)', 'hsl(0 0% 25% / 0.5)'],
  'vivid-content': ['hsl(0 0% 25%)', 'hsl(0 0% 88%)'],

  // general, lines
  '100': ['hsl(0 0% 100%)', 'hsl(0 0% 0%)'],
  '200': ['hsl(0 0% 88%)', 'hsl(0 0% 13%)'],
  '300': ['hsl(0 0% 75%)', 'hsl(0 0% 25%)'],
  '400': ['hsl(0 0% 63%)', 'hsl(0 0% 38%)'],
  '500': ['hsl(0 0% 50%)', 'hsl(0 0% 50%)'],
  '600': ['hsl(0 0% 38%)', 'hsl(0 0% 63%)'],
  '700': ['hsl(0 0% 25%)', 'hsl(0 0% 75%)'],
  '800': ['hsl(0 0% 13%)', 'hsl(0 0% 88%)'],
  '900': ['hsl(0 0% 0%)', 'hsl(0 0% 100%)'],
};
