import type { Client, RequestContext } from '@geee-be/core';
import type { Logger } from '@geee-be/logger';
import type { Middleware } from '@koa/router';
import { AsyncLocalStorage } from 'async_hooks';
import { DateTime } from 'luxon';
import { isArray, isIssue, isObject, isString, maybeString } from 'validata';
import type { AuthorizationContext } from './authorization.js';
import type { ApiContext } from './types.js';
import { isUlid, maybeUlid } from './ulid.js';

const checkAuthorization = isObject(
  {
    oid: maybeUlid(),
    rls: isArray(isString()),
    sid: isString(),
    sub: isUlid(),
    sty: maybeString(),
    typ: maybeString(),
  },
  { stripExtraProperties: true },
);

const localStorage = new AsyncLocalStorage<RequestContext>();

export const requestContext = (): RequestContext => {
  const request = localStorage.getStore();
  if (!request) throw Error('Context failure');
  return request;
};

export const userHasRole = (...allOf: string[][]): boolean => {
  const request = localStorage.getStore();
  const user = request?.user;
  if (!user) return false;

  return allOf.reduce<boolean>((acc, anyOf) => acc && user.roles.some((role) => anyOf.includes(role)), true);
};

export const requestContextMiddleware = (): Middleware<any, ApiContext> => {
  return (ctx, next) => {
    const request = makeRequestContext(ctx);
    return localStorage.run(request, () => {
      return next();
    });
  };
};

const getClient = (ctx: AuthorizationContext): Client => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  ips: ctx.request.ips.length ? ctx.request.ips : [ctx.request.ip],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  userAgent: ctx.request.header['user-agent'],
});

export const makeRequestContext = (ctx: AuthorizationContext): RequestContext => {
  const traceId = Array.isArray(ctx.header['trace-id']) ? ctx.header['trace-id'][0] : ctx.header['trace-id'];
  if (!ctx.authorization) {
    return {
      client: getClient(ctx),
      traceId,
      when: DateTime.utc().toJSDate(),
    };
  }

  const result = checkAuthorization.process(ctx.authorization);
  if (isIssue(result)) {
    const { logger } = ctx as { logger?: Logger };
    logger?.warn('Invalid authorization', undefined, {
      authorization: JSON.stringify(ctx.authorization),
      issues: JSON.stringify(result.issues),
    });
    throw new Error('Invalid authorization');
  }

  return {
    client: getClient(ctx),
    sessionId: result.value.sid,
    sessionType: result.value.sty,
    tokenType: result.value.typ,
    traceId,
    user: {
      _id: result.value.sub,
      organizationId: result.value.oid,
      roles: result.value.rls,
    },
    when: DateTime.utc().toJSDate(),
  };
};
