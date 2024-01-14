'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import type { InitialValue, SerializationOptions } from './state.util.js';
import { deserialize, getInitialValue, serialize } from './state.util.js';

export const useHistoryState = <T, S = T>(
  key: string,
  initialValue: InitialValue<T>,
  replace = true,
  options?: SerializationOptions<T, S>,
): [T, Dispatch<SetStateAction<T>>] => {
  if (!history) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [undefined as any, () => {}];
  }
  const [value, setValue] = useState<T>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    () => deserialize(history.state?.[key], options?.fromSerializable) ?? getInitialValue(initialValue),
  );

  useEffect(() => {
    if (replace) {
      history.replaceState({ ...history.state, [key]: serialize(value, options?.toSerializable) }, '');
    } else {
      history.pushState({ ...history.state, [key]: serialize(value, options?.toSerializable) }, '');
    }
  }, [key, value]);

  return [value, setValue];
};
