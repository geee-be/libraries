import type { Client, RequestContext, RequestUser } from '@geee-be/core';
import type { Logger } from '@geee-be/logger';
import type { Middleware } from '@koa/router';
import { AsyncLocalStorage } from 'async_hooks';
import { DateTime } from 'luxon';
import { isIssue, isObject, isString, maybeString } from 'validata';
import type { AuthorizationContext } from './authorization.js';
import type { ApiContext } from './types.js';

type UserResolver = (sub: string, iss: string) => RequestUser;

const checkAuthorization = isObject(
  {
    iss: isString(),
    sub: isString(),
    email: maybeString(),
  },
  { stripExtraProperties: true },
);

const localStorage = new AsyncLocalStorage<RequestContext>();

export const requestContext = (): RequestContext => {
  const request = localStorage.getStore();
  if (!request) throw Error('Context failure');
  return request;
};

export const requestContextMiddleware = (resolveUser?: UserResolver): Middleware<any, ApiContext> => {
  return (ctx, next) => {
    const request = makeRequestContext(ctx, resolveUser);
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

export const makeRequestContext = (ctx: AuthorizationContext, resolveUser?: UserResolver): RequestContext => {
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
    traceId,
    user: resolveUser
      ? resolveUser(result.value.iss, result.value.sub)
      : {
          email: result.value.email,
          iss: result.value.iss,
          sub: result.value.sub,
        },
    when: DateTime.utc().toJSDate(),
  };
};
