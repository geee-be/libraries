import { jsonDateParser } from 'json-date-parser';
import get from 'lodash.get';
import type { SortDirection } from 'mongodb';
import type { Path } from 'validata';
import { Issue, ValidationError, asNumber, isObject, isString, maybeAsArray, maybeAsObject } from 'validata';
import { query } from 'validata-koa';
import type { ApiContext, Entity, FindManyQuery, ForeignKeyValidation } from './types.js';

export const validateForeignKeys = async (
  foreignKeys: ForeignKeyValidation,
  data: Entity,
  basePath?: Path,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const failedForeignKeys = (
    await Promise.all(
      Object.keys(foreignKeys).map(async (key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value = get(data, key);
        const ok = await foreignKeys[key](value);
        return ok ? null : key;
      }),
    )
  ).filter((key: string | null) => !!key) as string[];

  if (failedForeignKeys.length) {
    const issues = failedForeignKeys.map((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        const { key, value } = item.startsWith('-') ? { key: item.slice(1), value: -1 } : { key: item, value: 1 };

        return {
          ...acc,
          [key]: value as SortDirection,
        };
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
