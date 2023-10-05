import * as crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { isPromise } from 'util/types';
import type { MigrationDef } from './types';

export const fileDigest = async (filePath: string): Promise<string> => {
  const hash = crypto.createHash('sha256');
  const input = await fs.readFile(filePath);

  hash.update(input);
  return hash.digest('base64');
};

export const isMigration = <Props>(value: unknown): value is MigrationDef<Props> => {
  if (!(typeof value === 'object') || !value) return false;
  const hasUp = 'up' in value && !!value.up && typeof value.up === 'function';
  const validDown = !('down' in value) || (!!value.down && typeof value.down === 'function');
  return hasUp && validDown;
};

export const promisish = <T>(result: Promise<T> | T): Promise<T> => {
  if (isPromise(result)) return result;
  return Promise.resolve(result);
};
