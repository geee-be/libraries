export interface SerializationOptions<T, S> {
  fromSerializable: (value: S) => T;
  toSerializable: (value: T) => S;
}

export const deserialize = <T, S>(
  serialized: unknown,
  fromSerializable?: (value: S) => T,
): T | undefined => {
  if (!serialized || typeof serialized !== 'string') return undefined;
  try {
    return fromSerializable
      ? fromSerializable(JSON.parse(serialized) as S)
      : (JSON.parse(serialized) as T);
  } catch {
    return undefined;
  }
};

export const serialize = <T, S>(
  value: T,
  toSerializable?: (value: T) => S,
): string => {
  try {
    return JSON.stringify(toSerializable ? toSerializable(value) : value);
  } catch {
    return '';
  }
};

export type InitialValue<T> = T | (() => T);

export const getInitialValue = <T>(initialValue: InitialValue<T>): T =>
  initialValue instanceof Function ? initialValue() : initialValue;
