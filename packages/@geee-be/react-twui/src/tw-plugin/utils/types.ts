import { type ThemableColors } from '../colors/themable-colors.js';

export type DarkMode = 'media' | 'data-theme' | undefined;

export type TwuiOptions = {
  darkMode?: DarkMode;

  /**
   * The theme definitions.
   */
  theme?: ThemableColors;

  /**
   * Specifies whether or not to apply font anti-aliasing to components.
   *
   * If set to `antialiased` (default), components will have anti-aliasing applied to them.
   * If set to `inherit`, no specific styles will be set for text anti-aliasing.
   *
   * * @default "antialiased"
   */
  fontSmooth?: 'antialiased' | 'inherit';
};
