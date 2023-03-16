import { RequestContext } from '@geee-be/core';
import type { Filter } from 'mongodb';
import type { Contract, NotPrimitive, ValueProcessor } from 'validata';
import { isObject } from 'validata';
import { Statuses, body, headers, params, query } from 'validata-koa';
import type { AuthorizationContext } from './authorization.js';
import { ForbiddenError, UnauthorizedError } from './error.js';
import { filterAnd } from './mongo.js';
import { requestContext } from './request-context.js';
import type { ApiContext, Entity, ForeignKeyValidation, PaginatedList } from './types.js';
import { findManyQuery, validateForeignKeys } from './util.js';

export interface Input<T> {
  contract: Contract<T>;
  foreignKeys?: ForeignKeyValidation<T>;
}

export type ActionInputs<A> = { [K in keyof A]: Input<A[K]> };

export interface ActionArgs<P, Q, H> {
  params: P;
  query: Q;
  headers: H;
}

export interface ActionWithBodyArgs<B, P, Q, H> extends ActionArgs<P, Q, H> {
  body: B;
}

export type NoId<T> = { [K in keyof Omit<T, '_id'>]: T[K] | never };
export type InsertEntityFactory<T extends Entity> = (ctx: ApiContext, check: ValueProcessor<NoId<T>>) => T;

export type FindManyHandler<T> = (
  filter: Filter<T>,
  sort: string[] | undefined,
  limit: number | undefined,
  skip: number,
) => Promise<PaginatedList<unknown>>;
export type FindOneHandler<T> = (filter: Filter<T>) => Promise<unknown | undefined | null>;
export type InsertOneHandler<T extends Entity> = (entity: T) => Promise<unknown>;
export type PatchOneHandler<T extends Entity> = (filter: Filter<T>, patch: Partial<T>) => Promise<unknown>;
export type ActionHandler<A> = (args: A, ctx: ApiContext) => Promise<unknown>;
export type ActionWithBodyHandler<B, P = undefined, Q = undefined, H = undefined> = (
  args: ActionWithBodyArgs<B, P, Q, H>,
  ctx: ApiContext,
) => Promise<unknown>;

const getInsertEntity: InsertEntityFactory<any> = (ctx, check) => {
  return body(ctx, check);
};

const extractors: Record<string, (ctx: ApiContext, checker: ValueProcessor<Entity>) => Entity> = {
  body,
  params,
  query,
  headers,
};

export type AuthCheck = (request: RequestContext) => boolean;

const checkAuth = (authCheck?: AuthCheck): void => {
  const request = requestContext();
  if (!request.user) throw new UnauthorizedError();

  // TODO: ensure session exists and is valid

  if (authCheck === undefined) return;

  const pass = authCheck(request);
  if (!pass) throw new ForbiddenError();
};

export namespace Endpoint {
  export const findMany =
    <T>(
      handler: FindManyHandler<T>,
      filter: (ctx: ApiContext) => Filter<T>,
      mutator?: (result: T[]) => unknown,
      ...extensions: ((ctx: ApiContext) => void)[]
    ) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      const { filter: queryFilter, limit, skip, sort } = findManyQuery(ctx);
      const contextFilter = filter(ctx);
      const combinedFilter = filterAnd([queryFilter, contextFilter]) ?? {};
      const result = await handler(combinedFilter as Filter<T>, sort, limit, skip);

      ctx.body = mutator ? { ...result, items: mutator(result.items as T[]) } : result;
      ctx.status = Statuses.OK;
      extensions.forEach((extension) => extension(ctx));
    };

  export const findOne =
    <T>(
      handler: FindOneHandler<T>,
      filter: (ctx: ApiContext) => Filter<T>,
      mutator?: (result: T) => unknown,
      ...extensions: ((ctx: ApiContext) => void)[]
    ) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      const filterQuery = filter(ctx);
      const item = await handler(filterQuery);
      if (!item) return;

      ctx.body = mutator ? mutator(item as T) : item;
      ctx.status = Statuses.OK;
      extensions.forEach((extension) => extension(ctx));
    };

  export const insertOne =
    <T extends Entity>(
      authCheck: AuthCheck | undefined,
      handler: InsertOneHandler<T>,
      check: ValueProcessor<T>,
      foreignKeys: ForeignKeyValidation,
      getInsert: InsertEntityFactory<T> = getInsertEntity,
    ) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      checkAuth(authCheck);

      const entity = getInsert(ctx, check);
      await validateForeignKeys(foreignKeys, entity);

      const inserted = await handler(entity);
      ctx.body = {
        inserted,
      };
      ctx.status = Statuses.OK;
    };

  export const patchOne =
    <T extends Entity>(
      authCheck: AuthCheck | undefined,
      handler: PatchOneHandler<T>,
      check: ValueProcessor<Partial<T>>,
      foreignKeys: ForeignKeyValidation,
      filter: (ctx: ApiContext) => Filter<T>,
    ) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      checkAuth(authCheck);

      const filterObject = filter(ctx);
      const patch = body(ctx, check);

      await validateForeignKeys(foreignKeys, patch);
      const result = await handler(filterObject, patch);

      ctx.body = { updated: result };
      ctx.status = Statuses.OK;
    };

  type ContractOrUndefined<T extends NotPrimitive | undefined> = T extends never ? undefined : Contract<Required<T>>;

  export const actionWithBody =
    <B, P extends NotPrimitive | undefined, Q extends NotPrimitive | undefined, H extends NotPrimitive | undefined>(
      authCheck: AuthCheck | undefined,
      handler: ActionWithBodyHandler<B, P, Q, H>,
      bodyValidata: ValueProcessor<B>,
      paramContract?: ContractOrUndefined<P>,
      queryContract?: ContractOrUndefined<Q>,
      headerContract?: ContractOrUndefined<H>,
      onSuccess?: (ctx: ApiContext) => void,
    ) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      checkAuth(authCheck);

      const b = body(ctx, bodyValidata);
      const p = paramContract ? params(ctx, isObject(paramContract, { stripExtraProperties: true })) : undefined;
      const q = queryContract ? query(ctx, isObject(queryContract, { stripExtraProperties: true })) : undefined;
      const h = headerContract ? headers(ctx, isObject(headerContract, { stripExtraProperties: true })) : undefined;
      const result = await handler({ body: b, params: p as P, query: q as Q, headers: h as H }, ctx);
      if (result === undefined) return;

      ctx.body = result;
      ctx.status = Statuses.OK;
      onSuccess?.(ctx);
    };

  export const action =
    <A>(authCheck: AuthCheck | undefined, handler: ActionHandler<A>, inputs: ActionInputs<A>) =>
    async (ctx: AuthorizationContext): Promise<void> => {
      checkAuth(authCheck);

      const resolved = await Promise.all(
        Object.keys(inputs).map(async (key) => {
          const input = inputs[key as keyof typeof inputs] as Input<unknown>;
          const extractor = extractors[key];
          if (!extractor) return undefined;

          const value = extractor(ctx, isObject(input.contract, { stripExtraProperties: true }));
          if (input.foreignKeys) {
            await validateForeignKeys(input.foreignKeys, value, ':');
          }
          return { [key]: value };
        }),
      );
      const handlerArgs = resolved.filter((item) => !!item).reduce((acc, item) => ({ ...acc, ...item }), {} as A);

      const result = await handler(
        { ...handlerArgs, referrer: (ctx.request as unknown as { referrer: unknown }).referrer },
        ctx as ApiContext,
      );
      if (result === undefined) return;

      ctx.body = result;
      ctx.status = Statuses.OK;
    };
}
