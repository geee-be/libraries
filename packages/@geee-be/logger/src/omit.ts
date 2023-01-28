export const omit = <T extends { [key: string]: any }, K extends keyof T>(
  obj: T,
  props: K[],
  fn?: (val: any, key: K, obj: Record<string, unknown>) => boolean,
): Exclude<T, K> => {
  if (typeof props === 'function') {
    fn = props;
    props = [];
  }

  if (typeof props === 'string') {
    props = [props];
  }

  const isFunction = typeof fn === 'function';
  const keys = Object.keys(obj) as K[];
  const res: any = {};

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const val: any = obj[key];

    if (!props || (props.indexOf(key) === -1 && (!isFunction || !fn || fn(val, key, obj)))) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      res[key] = val;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res;
};
