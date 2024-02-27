const fixInputs = <T extends { [key: string]: any }, K extends keyof T>(
  props: K[] | K,
  fn?: (val: any, key: K, obj: Record<string, unknown>) => boolean,
): {
  props: K[];
  fn?: (val: any, key: K, obj: Record<string, unknown>) => boolean;
} => {
  if (typeof props === 'function') {
    return { props: [], fn: props };
  }

  if (!Array.isArray(props)) {
    return { props: [props], fn };
  }

  return { props, fn };
};

export const omit = <T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  props: K[] | K,
  fn?: (val: any, key: K, obj: Record<string, unknown>) => boolean,
): Exclude<T, K> => {
  const { props: actualProps, fn: actualFn } = fixInputs<T, K>(props, fn);

  const isFunction = typeof actualFn === 'function';
  const keys = Object.keys(obj) as K[];
  const res: any = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val: any = obj[key];

    if (
      !actualProps ||
      (actualProps.indexOf(key) === -1 &&
        (!isFunction || !actualFn || actualFn(val, key, obj)))
    ) {
      res[key] = val;
    }
  }
  return res;
};
