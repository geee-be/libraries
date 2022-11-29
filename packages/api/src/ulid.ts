import { isString, maybeString, StringFormat, ValueProcessor } from 'validata';

export const isUlid = (): ValueProcessor<string> => isString({ format: StringFormat.ULID() });
export const maybeUlid = (): ValueProcessor<string | undefined> => maybeString({ format: StringFormat.ULID() });
