/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * This Tailwind plugin is based and inspired on "tw-colors" and "NextUI".
 *
 * @see https://github.com/L-Blondy/tw-colors
 * @see https://github.com/nextui-org/nextui
 */

import deepMerge from 'deepmerge';
import omit from 'lodash.omit';
import plugin from 'tailwindcss/plugin.js';

import type { CSSRuleObject } from 'tailwindcss/types/config.js';
import { themableColors } from './colors/themable-colors.js';
import { resolveConfig } from './utils/resolve-config.js';
import type { ConfigTheme, ConfigThemes, TwuiOptions } from './utils/types.js';

const DEFAULT_PREFIX = 'color';

const switchDefaultColorCss = (): CSSRuleObject => {
  const colors = ['primary', 'info', 'warning', 'success', 'error'];
  const variants = ['', '-100', '-200', '-300', '-400', '-500', '-600', '-700', '-800', '-900'];
  const suffixes = ['', '-content', '-opacity'];
  return colors.reduce<CSSRuleObject>(
    (colorsAcc, color) => ({
      ...colorsAcc,
      [`.default-color-${color}`]: variants.reduce<CSSRuleObject>(
        (variantAcc, variant) =>
          suffixes.reduce<CSSRuleObject>(
            (suffixAcc, suffix) => ({
              ...suffixAcc,
              [`--color-default${variant}${suffix}`]: `var(--color-${color}${variant}${suffix})`,
            }),
            variantAcc,
          ),
        {},
      ),
    }),
    {},
  );
};

/**
 * twMerge with extended options.
 */
// export const twMerge = extendTailwindMerge({
//   extend: {
//     theme: {
//       padding: ['2px', '4px', '6px', '8px', '12px', '14px', '16px'],
//     },
//   },
// });

/**
 * The core plugin function.
 */
const corePlugin = (
  themes: ConfigThemes = {},
  prefix: string,
  fontSmooth: TwuiOptions['fontSmooth'],
): ReturnType<typeof plugin> => {
  const resolved = resolveConfig(themes, prefix);
  // console.log('***', resolved);

  // const animationEasing = 'cubic-bezier(.2,1,.4,1)';

  const switchDefaults = switchDefaultColorCss();
  // console.log(
  //   '************\n\n',
  //   JSON.stringify(switchDefaults),
  //   '\n',
  //   JSON.stringify(switchDefaultColorCssConst),
  //   '\n\n',
  // );

  return plugin(
    ({ addBase, addComponents, addUtilities, addVariant }) => {
      addBase([
        {
          ':root': {
            '--font-smooth--webkit': fontSmooth === 'antialiased' ? 'antialiased' : 'unset',
            '--font-smooth--moz': fontSmooth === 'antialiased' ? 'grayscale' : 'unset',
          },

          'html, body': {
            color: `hsl(var(--${prefix}-foreground))`,
            backgroundColor: `hsl(var(--${prefix}-background))`,
          },
        },
      ]);

      addUtilities([
        {
          '.antialiased': {
            '-webkit-font-smoothing': 'var(--font-smooth--webkit)',
            '-moz-osx-font-smoothing': 'var(--font-smooth--moz)',
          },
        },
        switchDefaults,
      ]);

      addUtilities(resolved.utilities);
      addComponents(resolved.components);

      // // e.g. "[theme-name]:text-2xl"
      // resolved.variants.forEach(({ name, definition }) => addVariant(name, definition));
      // console.log('---$#$#$#$#$#', resolved.variants);
      // addVariant('foo', ['.foo&']);

      // matchVariant('dark', (value, { modifier }) => {
      //   console.log('$#$#$#$#$#', value, modifier);
      //   return '';
      // });

      // // Add 'wg-bg' utility
      // matchUtilities(
      //   {
      //     'wg-bg': (value: any) => {
      //       if (typeof value === 'function') {
      //         const res = value({ opacityValue: '1', opacityVariable: '1' });
      //         const match = res.match(/var\(([^)]+)\)/);

      //         if (match) {
      //           return {
      //             background: value('', ''),
      //             [`--${prefix}-background`]: `var(${match[1]})`,
      //           };
      //         }
      //       }

      //       try {
      //         const [h, s, l, defaultAlphaValue] = Color(value).hsl().round().array();

      //         const colorString = getColorString(
      //           `--${prefix}-background`,
      //           `--${prefix}-background-opacity`,
      //           defaultAlphaValue,
      //         );

      //         return {
      //           background: colorString,
      //           [`--${prefix}-background`]: `${h} ${s}% ${l}%`,
      //         };
      //       } catch (error: any) {
      //         const match = value.match(/var\(([^)]+)\)/);

      //         return {
      //           background: value,
      //           [`--${prefix}-background`]: match ? `var(${match[1]})` : value,
      //         };
      //       }
      //     },
      //   },
      //   {
      //     values: flattenThemeObject(theme('colors')),
      //     type: ['color'],
      //   },
      // );
    },

    // Extend the Tailwind config
    {
      darkMode: 'media',
      // darkMode: ['class', '[data-mode="dark"]'],
      theme: {
        extend: {
          colors: {
            ...{},
            ...resolved.colors,
          },
          //   minWidth: {
          //     ...minWidth,
          //   },
          //   minHeight: {
          //     ...minWidth,
          //   },
          //   fontSize: {
          //     ...fontSizes,
          //   },
          //   boxShadow: {
          //     ...prefixedBoxShadows,
          //   },
          //   padding: {
          //     '2px': 'calc(2px - var(--wg-border-width, 0px))',
          //     '4px': 'calc(4px - var(--wg-border-width, 0px))',
          //     '6px': 'calc(6px - var(--wg-border-width, 0px))',
          //     '8px': 'calc(8px - var(--wg-border-width, 0px))',
          //     '12px': 'calc(12px - var(--wg-border-width, 0px))',
          //     '14px': '14px',
          //     '16px': 'calc(16px - var(--wg-border-width, 0px))',
          //   },
          //   outlineOffset: {
          //     3: '3px',
          //   },
          //   textUnderlineOffset: {
          //     3: '3px',
          //   },
          //   animation: {
          //     'wg-fade-in-up': `fadeInUp 0.3s ${animationEasing}`,
          //     'wg-fade-in-down': `fadeInDown 0.3s ${animationEasing}`,
          //     'wg-fade-in-left': `fadeInLeft 0.3s ${animationEasing}`,
          //     'wg-fade-in-right': `fadeInRight 0.3s ${animationEasing}`,
          //     'wg-fade-out': `fadeOut 0.15s ${animationEasing}`,
          //   },
          //   keyframes: {
          //     fadeInUp: {
          //       '0%': {
          //         opacity: '0',
          //         transform: 'translateY(5px) scale(.97)',
          //       },
          //       '100%': {
          //         opacity: '1',
          //         transform: 'translateY(0px) scale(1)',
          //       },
          //     },
          //     fadeInDown: {
          //       '0%': {
          //         opacity: '0',
          //         transform: 'translateY(-5px) scale(.97)',
          //       },
          //       '100%': {
          //         opacity: '1',
          //         transform: 'translateY(0px) scale(1)',
          //       },
          //     },
          //     fadeInLeft: {
          //       '0%': {
          //         opacity: '0',
          //         transform: 'translateX(5px) scale(.97)',
          //       },
          //       '100%': {
          //         opacity: '1',
          //         transform: 'translateX(0px) scale(1)',
          //       },
          //     },
          //     fadeInRight: {
          //       '0%': {
          //         opacity: '0',
          //         transform: 'translateX(-5px) scale(.97)',
          //       },
          //       '100%': {
          //         opacity: '1',
          //         transform: 'translateX(0px) scale(1)',
          //       },
          //     },
          //     fadeOut: {
          //       '0%': {
          //         opacity: '1',
          //         transform: 'scale(1)',
          //       },
          //       '100%': {
          //         opacity: '0',
          //         transform: 'scale(.97)',
          //       },
          //     },
          //   },
        },
      },
    },
  );
};

/**
 * The actual plugin function.
 */
export const twui = (config: TwuiOptions = {}): ReturnType<typeof plugin> => {
  const { prefix: defaultPrefix = DEFAULT_PREFIX, fontSmooth = 'antialiased', themes: themeObject = {} } = config;

  const userColors = themeObject.variable?.colors ?? {};
  const otherUserThemes = omit(themeObject, ['variable']);

  Object.keys(otherUserThemes).forEach((themeName) => {
    const theme = (otherUserThemes[themeName] = { ...otherUserThemes[themeName] });
    const { colors }: ConfigTheme = theme;
    // const baseTheme = extend && isBaseTheme(extend) ? extend : defaultExtendTheme;

    if (colors && typeof colors === 'object') {
      theme.colors = deepMerge(themableColors.variable, colors);
    }
  });

  const theme: ConfigTheme = { colors: deepMerge(themableColors.variable, userColors) };
  // console.log('---', themableColors.light, userLightColors);

  const themes = {
    variable: theme,
    ...otherUserThemes,
  };

  // console.log('themes', themes);
  const tw = corePlugin(themes, defaultPrefix, fontSmooth);
  // console.log('tw.config', tw.config?.theme?.extend?.colors);
  return tw;
};
