/**
 * Returns the corresponding CSS color string based on the provided color and opacity values.
 *
 * @param colorVariable - The CSS variable for the color value.
 * @param opacityVariable - The CSS variable for the opacity value.
 * @param twOpacityValue - The opacity value to use. If not provided, the opacity value from the CSS variable will be used.
 * @param twOpacityVariable - The CSS variable for the opacity value to use if `opacityValue` is not provided.
 * @returns The corresponding CSS color string.
 */
export const getColorString = (
  colorVariable: string,
  opacityVariable: string,
  twOpacityValue?: number | string,
  twOpacityVariable?: string,
): string => {
  if (twOpacityValue !== null && twOpacityValue !== undefined && !Number.isNaN(+twOpacityValue)) {
    return `hsl(var(${colorVariable}) / ${twOpacityValue})`;
  }

  if (twOpacityVariable) {
    return `hsl(var(${colorVariable}) / var(${opacityVariable}, var(${twOpacityVariable})))`;
  }

  return `hsl(var(${colorVariable}) / var(${opacityVariable}, 1))`;
};
