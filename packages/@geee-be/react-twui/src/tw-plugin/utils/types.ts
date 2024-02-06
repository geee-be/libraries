import { type ThemableColors } from '../colors/themable-colors.js';

export type ConfigTheme = {
  /**
   * Defines an extended colors object, providing a flexible foundation for theming or custom color configurations.
   *
   * Key Features:
   * 1. **Themable Colors**: Customize or extend existing themes by overriding values in the `palette`.
   * 2. **Custom Colors**: Introduce new color schemes by adding unique key-value pairs.
   * 3. **Nested Colors**: Allows for the grouping of color variations under a single key, facilitating organized and hierarchical color definitions.
   *
   * @example
   * colors: {
   *   'red': '#ff0000',
   *   customColor: {
   *     500: '#f0f0f0',
   *     600: '#0d0d0d',
   *   },
   * }
   */
  colors?: Partial<ThemableColors> | Record<string, string | Record<string, string>>;
};

type BaseThemes = 'variable';
// eslint-disable-next-line @typescript-eslint/ban-types
// export type DefaultThemeType = BaseThemes | (string & {});
export type ConfigThemes = { [key in BaseThemes]?: ConfigTheme } & Record<string, ConfigTheme>;

export type TwuiOptions = {
  /**
   * The prefix for CSS variables.
   * @default "color"
   */
  prefix?: string;

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
