/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * This Tailwind plugin is based and inspired on "tw-colors" and "NextUI".
 *
 * @see https://github.com/L-Blondy/tw-colors
 * @see https://github.com/nextui-org/nextui
 */

import Color from 'color';

import omit from 'lodash.omit';
import type { CSSRuleObject } from 'tailwindcss/types/config.js';
import type { ThemableColors } from '../colors/themable-colors.js';
import { getColorString } from './color.js';
import { flattenThemeObject } from './object.js';
import type { ConfigThemes } from './types.js';

interface ResolvedConfig {
  variants: { name: string; definition: string[] }[];
  utilities: CSSRuleObject;
  components: CSSRuleObject;
  colors: Record<
    string,
    ({ opacityValue, opacityVariable }: { opacityValue: string; opacityVariable: string }) => string
  >;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

interface Hsla extends Hsl {
  alpha?: number;
}

const parseColorValue = (value: string | [string, string]): [Hsla, Hsla] | [undefined, undefined] => {
  if (!value) return [undefined, undefined];

  const tuple: [string, string] = typeof value === 'string' ? [value, value] : value;
  return tuple.map((v) => {
    const [h, s, l, alpha = 1] = Color(v).hsl().round().array();
    return { h, s, l, alpha };
  }) as [Hsla, Hsla];
};

const contentColor = (hsl: Hsl): Hsl => {
  const color = Color(hsl);
  const [h, s, l] = color
    .lightness(color.isDark() ? 90 : 10)
    .hsl()
    .round()
    .array();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { h: h!, s: s!, l: l! };
};

const switchDefaultColorCss = (themeColors: ThemableColors): CSSRuleObject => {
  // const flatColors = flattenThemeObject(themeColors);

  const colors: (keyof Omit<ThemableColors, 'background' | 'foreground'>)[] = [
    'primary',
    'info',
    'warning',
    'success',
    'error',
  ];
  // const variants: (keyof ColorScale)[] = ['DEFAULT', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  // const suffixes = ['', '-content', '-opacity'];
  return colors.reduce<CSSRuleObject>((colorsAcc, color) => {
    const themeColor = themeColors[color];
    const flatColors = flattenThemeObject(themeColor);

    return {
      ...colorsAcc,
      [`.default-color-${color}`]: Object.entries(flatColors).reduce<CSSRuleObject>(
        (variantAcc, [variant, colorValue]) => {
          if (!colorValue) {
            return variantAcc;
          }

          const [light, dark] = parseColorValue(colorValue);
          if (!light || !dark) return variantAcc;

          const lightContent = contentColor(light);
          // const darkContent = contentColor(dark);

          const colorVariable = `--color-default${variant !== 'DEFAULT' ? `-${variant}` : ''}`;
          const colorContentVariable = `--color-default${variant !== 'DEFAULT' ? `-${variant}` : ''}-content`;
          // const opacityVariable = `--color-default${variant !== 'DEFAULT' ? `-${variant}` : ''}-opacity`;

          // return variantAcc;

          return {
            ...variantAcc,
            [colorVariable]: `${light.h} ${light.s}% ${light.l}%`,
            [colorContentVariable]: `${lightContent.h} ${lightContent.s}% ${lightContent.l}%`,
            // [opacityVariable]: `${light.h} ${light.s}% ${light.l}%`,
          };
        },
        // suffixes.reduce<CSSRuleObject>(
        //   (suffixAcc, suffix) => ({
        //     ...suffixAcc,
        //     [`--color-default${variant}${suffix}`]: `var(--color-${color}${variant}${suffix})`,
        //   }),
        //   variantAcc,
        // ),
        {} as CSSRuleObject,
      ),
    };
  }, {});
};

export const resolveConfig = (themes: ConfigThemes = {}, prefix: string): ResolvedConfig => {
  const resolved: ResolvedConfig = {
    variants: [],
    components: {},
    utilities: {},
    colors: {},
  };

  const lightVariables: Record<string, string> = {};
  const darkVariables: Record<string, string> = {};

  Object.keys(themes).forEach((themeName) => {
    const themeConfig = themes[themeName] ?? {}; // fallback to {} if undefined or null
    const { colors = {} } = themeConfig;
    const baseColors = omit(colors, 'background', 'foreground', 'paper', 'control', 'surface', 'destructive');
    const flatColors = flattenThemeObject(colors);

    // console.log('*&*&*', baseColors, flattenThemeObject(baseColors.default));

    // console.log('flatColors', flatColors);

    // let cssSelector = `.${themeName},[data-theme="${themeName}"]`;

    // // if the theme is the default theme, add the selector to the root element
    // if (themeName === 'variable') {
    //   cssSelector = `:where(:root)`; // add :where to prevent specificity issues when theme is set on the html element
    // }

    // resolved.utilities[cssSelector] = { 'color-scheme': 'variable' };

    // Set variants
    // resolved.variants.push({
    //   name: themeName,
    //   definition: [
    //     `.${themeName}&`,
    //     `:is(.${themeName} > &:not([data-theme]))`,
    //     `:is(.${themeName} &:not(.${themeName} [data-theme]:not(.${themeName}) * ))`,
    //     `:is(.${themeName}:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
    //     `[data-theme='${themeName}']&`,
    //     `:is([data-theme='${themeName}'] > &:not([data-theme]))`,
    //     `:is([data-theme='${themeName}'] &:not([data-theme='${themeName}'] [data-theme]:not([data-theme='${themeName}']) * ))`,
    //     `:is([data-theme='${themeName}']:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
    //   ],
    // });

    /* --------------------------------- Colors --------------------------------- */
    Object.keys(flatColors).forEach((colorName) => {
      const colorValue = flatColors[colorName as keyof typeof flatColors] as string | [string, string];

      if (!colorValue) {
        return;
      }

      try {
        // const [h, s, l, defaultAlphaValue = 1] = Color(colorValue).hsl().round().array(); // fallback defaultAlphaValue to 1 if undefined
        const [light, dark] = parseColorValue(colorValue);
        if (!light || !dark) return;

        const lightContent = contentColor(light);
        const darkContent = contentColor(dark);

        const colorVariable = `--${prefix}-${colorName}`;
        const opacityVariable = `--${prefix}-${colorName}-opacity`;

        // Set the css variable in "@layer utilities"
        lightVariables[colorVariable] = `${light.h} ${light.s}% ${light.l}%`;
        darkVariables[colorVariable] = `${dark.h} ${dark.s}% ${dark.l}%`;

        // Set the dynamic color in tailwind config theme.colors
        resolved.colors[colorName] = ({ opacityVariable: twOpacityVariable, opacityValue: twOpacityValue }) =>
          getColorString(colorVariable, opacityVariable, twOpacityValue, twOpacityVariable);

        if (!colorName.endsWith('content')) {
          const colorContentVariable = `--${prefix}-${colorName}-content`;

          lightVariables[colorContentVariable] = `${lightContent.h} ${lightContent.s}% ${lightContent.l}%`;
          darkVariables[colorContentVariable] = `${darkContent.h} ${darkContent.s}% ${darkContent.l}%`;

          // If an alpha value was provided in the color definition, store it in a css variable
          if (typeof light.alpha === 'number') {
            lightVariables[opacityVariable] = light.alpha.toFixed(2);
            // resolved.utilities[cssSelector]![opacityVariable] = defaultAlphaValue.toFixed(2);
          }
          if (typeof dark.alpha === 'number') {
            darkVariables[opacityVariable] = dark.alpha.toFixed(2);
          }

          // Set the dynamic color in tailwind config theme.colors
          resolved.colors[`${colorName}-content`] = ({
            opacityVariable: twOpacityVariable,
            opacityValue: twOpacityValue,
          }) => getColorString(colorContentVariable, opacityVariable, twOpacityValue, twOpacityVariable);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          // eslint-disable-next-line no-console
          console.warn('tw-plugin-build-error:', error.message);
        } else {
          // eslint-disable-next-line no-console
          console.warn('tw-plugin-build-error:', error);
        }
      }
    });

    const switchDefaultColor = switchDefaultColorCss(colors as ThemableColors);

    if (themeName === 'variable') {
      const themeNameX = 'dark';
      console.log(`${themeNameX} theme`);
      resolved.variants.push({
        name: themeNameX,
        definition: [
          `.${themeNameX}&`,
          `:is(.${themeName} > &:not([data-theme]))`,
          `:is(.${themeNameX} &:not(.${themeNameX} [data-theme]:not(.${themeNameX}) * ))`,
          `:is(.${themeNameX}:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
          `[data-theme='${themeNameX}']&`,
          `:is([data-theme='${themeNameX}'] > &:not([data-theme]))`,
          `:is([data-theme='${themeNameX}'] &:not([data-theme='${themeNameX}'] [data-theme]:not([data-theme='${themeNameX}']) * ))`,
          `:is([data-theme='${themeNameX}']:not(:has([data-theme])) &:not([data-theme]))`, // See the browser support: https://caniuse.com/css-has
        ],
      });

      resolved.components[':root'] = {
        ...(resolved.components[':root'] as object),
        ...lightVariables,
        ...switchDefaultColor,
        '--theme': 'light',
      };
      resolved.components['@media (prefers-color-scheme: dark)'] = {
        ':root': {
          ...darkVariables,
          ...switchDefaultColor,
          '--theme': 'dark',
        },
      };

      // resolved.utilities["[data-theme='dark'], .dark"] = {
      //   ...darkVariables,
      //   ...switchDefaultColor,
      //   '--theme': 'dark',
      // };
      // resolved.utilities["[data-theme='light'], .light"] = {
      //   ...lightVariables,
      //   ...switchDefaultColor,
      //   '--theme': 'light',
      // };
    } else {
      // TODO: additional themes
      // let cssSelector = `.${themeName}, [data-theme="${themeName}"]`;
      // // if the theme is the default theme, add the selector to the root element
      // if (themeName === 'variable') {
      //   cssSelector = `:where(:root)`; // add :where to prevent specificity issues when theme is set on the html element
      // }
      // resolved.utilities[":root[data-mode='dark'], .dark"] = darkVariables;
      // resolved.utilities[":root[data-mode='light'], .light"] = lightVariables;
    }

    Object.entries(baseColors).forEach(([colorName, definitions]) => {
      const flattened = flattenThemeObject(definitions);
      const overrideLightVariables: Record<string, string> = {};
      const overrideDarkVariables: Record<string, string> = {};
      Object.entries(flattened).forEach(([colorVariant, colorValue]) => {
        try {
          const [light, dark] = parseColorValue(colorValue);
          if (!light || !dark) return;

          const lightContent = contentColor(light);
          const darkContent = contentColor(dark);

          const colorVariable = `--color-default${colorVariant !== 'DEFAULT' ? `-${colorVariant}` : ''}`;
          const opacityVariable = `--color-default${colorVariant !== 'DEFAULT' ? `-${colorVariant}` : ''}-opacity`;

          // Set the css variable in "@layer utilities"
          overrideLightVariables[colorVariable] = `${light.h} ${light.s}% ${light.l}%`;
          overrideDarkVariables[colorVariable] = `${dark.h} ${dark.s}% ${dark.l}%`;

          if (!colorVariant.endsWith('content')) {
            const colorContentVariable = `--color-default${colorVariant !== 'DEFAULT' ? `-${colorVariant}` : ''}-content`;

            overrideLightVariables[colorContentVariable] = `${lightContent.h} ${lightContent.s}% ${lightContent.l}%`;
            overrideDarkVariables[colorContentVariable] = `${darkContent.h} ${darkContent.s}% ${darkContent.l}%`;

            // If an alpha value was provided in the color definition, store it in a css variable
            if (typeof light.alpha === 'number') {
              overrideLightVariables[opacityVariable] = light.alpha.toFixed(2);
            }
            if (typeof dark.alpha === 'number') {
              overrideDarkVariables[opacityVariable] = dark.alpha.toFixed(2);
            }
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            // eslint-disable-next-line no-console
            console.warn('tw-plugin-build-error:', error.message);
          } else {
            // eslint-disable-next-line no-console
            console.warn('tw-plugin-build-error:', error);
          }
        }
      });

      resolved.utilities[`.default-${colorName}`] = overrideLightVariables;
      resolved.utilities['@media (prefers-color-scheme: dark)'] = {
        [`.default-${colorName}`]: overrideDarkVariables,
      };
    });
  });

  return resolved;
};
