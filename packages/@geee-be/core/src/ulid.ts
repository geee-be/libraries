import type { ValueProcessor } from 'validata';
import { isString, maybeString, StringFormat } from 'validata';

export const isUlid = (): ValueProcessor<string> =>
  isString({ format: StringFormat.ULID() });
export const maybeUlid = (): ValueProcessor<string | undefined> =>
  maybeString({ format: StringFormat.ULID() });
