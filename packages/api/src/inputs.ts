import { Filter } from 'mongodb';
import { isObject, maybeAsArray } from 'validata';
import { params, query } from 'validata-koa';
import { requestContext } from './request-context.js';
import type { ApiContext } from './types.js';
import { isUlid } from './ulid.js';

const idParam = (ctx: ApiContext): string => {
  const { id } = params(ctx, isObject({
    id: isUlid(),
  }));
  return id;
};

const filterByQueryIdsForOrganization = <T = any>(ctx: ApiContext): Filter<T> => {
  const { id } = query(ctx, isObject({
    id: maybeAsArray<string, string[]>(undefined, { minLength: 1 }),
  }, { stripExtraProperties: true }));

  const request = requestContext();
  const organizationId = request.user?.organizationId ?? null;
  return (id ? { _id: { $in: id }, organizationId } : { organizationId }) as any as Filter<T>;
};

const filterByIdParamForOrganization = <T = any>(ctx: ApiContext): Filter<T> => {
  const id = idParam(ctx);
  const request = requestContext();
  const organizationId = request.user?.organizationId ?? null;
  return { _id: id, organizationId } as any as Filter<T>;
};

const change = (_ctx: ApiContext): unknown => {
  return new Date();
};

export const Inputs = {
  idParam,
  filterByQueryIdsForOrganization,
  filterByIdParamForOrganization,
  change,
};

