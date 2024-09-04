import { jsonDateParser } from 'json-date-parser';
import get from 'lodash.get';
import type { SortDirection } from 'mongodb';
import type { Path } from 'validata';
import {
  Issue,
  ValidationError,
  asNumber,
  isObject,
  isString,
  maybeAsArray,
  maybeAsObject,
} from 'validata';
import { query } from 'validata-koa';
import type {
  ApiContext,
  Entity,
  FindManyQuery,
  ForeignKeyValidation,
} from './types.js';

export const validateForeignKeys = async <T extends Entity>(
  foreignKeys: ForeignKeyValidation<T>,
  data: T,
  basePath?: Path,
): Promise<void> => {
  const failedForeignKeys = (
    await Promise.all(
      Object.entries(foreignKeys).map(async ([key, validate]) => {
        const value = get(data, key);
        const ok =
          typeof validate === 'function' ? await validate(value) : false;
        return ok ? null : key;
      }),
    )
  ).filter((key: string | null) => !!key) as string[];

  if (failedForeignKeys.length) {
    const issues = failedForeignKeys.map((key) => {
      const value = get(data, key);
      const path = basePath ? [basePath, ...key.split('.')] : key.split('.');
      return Issue.forPath(path, value, 'foreign-key-mismatch');
    });
    throw new ValidationError(issues);
  }
};

export const parseSort = (items?: string[]): Record<string, SortDirection> =>
  items
    ? items.reduce<Record<string, SortDirection>>((acc, item) => {
        const { key, value } = item.startsWith('-')
          ? { key: item.slice(1), value: -1 }
          : { key: item, value: 1 };

        acc[key] = value as SortDirection;
        return acc;
      }, {})
    : {};

export const findManyQuery = (ctx: ApiContext): FindManyQuery =>
  query(
    ctx,
    isObject(
      {
        filter: maybeAsObject(undefined, { reviver: jsonDateParser }),
        limit: asNumber({ default: 100, min: 1 }),
        skip: asNumber({ default: 0, min: 0 }),
        sort: maybeAsArray<string>(isString()),
      },
      { stripExtraProperties: true },
    ),
  );

export const asPromise = async <T>(input: T | Promise<T>): Promise<T> =>
  (input as Promise<T>).then && typeof (input as Promise<T>).then === 'function'
    ? await input
    : Promise.resolve(input);

    export const bodyAsString = (body: unknown): string => {
      if (typeof body === 'string') {
        return body;
      }
      if (Buffer.isBuffer(body)) {
        return body.toString();
      }
      return JSON.stringify(body);
    };
