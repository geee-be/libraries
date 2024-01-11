import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { InitialValue, SerializationOptions } from './state.util.js';
import { deserialize, getInitialValue, serialize } from './state.util.js';

type SetValue<T> = Dispatch<SetStateAction<T>>;

// Provides hook that persist the state with local storage with sync'd updates
// NOTE: this only syncs between different window contexts, it doesn't sync between components in the same window
export const useLocalState = <T, S = T>(
  key: string,
  initialValue: InitialValue<T>,
  options?: SerializationOptions<T, S>,
): [T, SetValue<T>] => {
  const readValue = useCallback((): T => {
    const item = localStorage.getItem(key);
    return deserialize<T, S>(item, options?.fromSerializable) ?? getInitialValue(initialValue);
  }, [key, options?.fromSerializable, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      localStorage.setItem(key, serialize<T, S>(newValue, options?.toSerializable));
    },
    [key, options?.toSerializable, storedValue],
  );

  const storageValueChanged = useCallback(
    (ev: StorageEvent) => {
      if (ev.storageArea !== localStorage || ev.key !== key) return;
      setStoredValue(deserialize<T, S>(ev.newValue, options?.fromSerializable) ?? getInitialValue(initialValue));
    },
    [key, options?.fromSerializable, initialValue],
  );

  useEffect(() => {
    window.addEventListener('storage', storageValueChanged);
    return () => window.removeEventListener('storage', storageValueChanged);
  }, [storageValueChanged]);

  return [storedValue, setValue];
};
