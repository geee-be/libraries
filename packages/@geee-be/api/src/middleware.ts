import { HrTime, Statuses } from '@geee-be/core';
import type { Logger } from '@geee-be/logger';
import type { RouterContext } from '@koa/router';
import type { Middleware } from 'koa';
import { Summary } from 'prom-client';
import { formatError } from './error.js';
import { bodyAsString } from './util.js';

const responseSummary = new Summary({
  help: 'Response timing (seconds)',
  labelNames: ['method', 'route', 'status'],
  name: 'api_response',
});

export interface MonitorRequest {
  duration: number;
  method: string;
  path: string;
  route?: string;
  status: number;
}

export type Monitor = (details: MonitorRequest) => void;

export interface ObserveMiddlewareOptions {
  useLogger?: boolean;
  loggerIgnorePath?: RegExp;
  monitor?: Monitor;
}

/**
 * Returns error formatting middleware
 */
export const errorMiddleware = (): Middleware => async (ctx, next) => {
  try {
    await next();

    if (ctx.status === Statuses.NOT_FOUND) {
      ctx.body = { error: { type: 'NotFoundError', message: 'Not Found' } };
      ctx.status = Statuses.NOT_FOUND;
    }
  } catch (err) {
    formatError(ctx, err);
  }
};

/**
 * Call listed child middleware except for given paths
 * @param paths
 * @param middleware
 */
export const ignorePaths = (
  paths: string[],
  middleware: Middleware,
): Middleware => {
  return async function (this: any, ctx, next) {
    if (paths.includes(ctx.path)) {
      await next();
    } else {
      // must .call() to explicitly set the receiver
      await middleware.call(this, ctx, next);
    }
  };
};

interface MaybeWithRouterPath {
  _matchedRoute: string | RegExp | undefined;
}

const getRoute = (ctx: MaybeWithRouterPath): string | undefined => {
  return '_matchedRoute' in ctx
    ? typeof ctx._matchedRoute === 'object'
      ? ctx._matchedRoute.toString()
      : ctx._matchedRoute
    : undefined;
};

/**
 * Adds headers for additional security
 */
export const maxCacheMiddleware =
  (): Middleware =>
  async (ctx, next: () => Promise<any>): Promise<void> => {
    await next();

    ctx.set('Cache-Control', 'immutable');
  };

export const livenessEndpoint =
  (isAlive?: () => Promise<boolean>) =>
  async (ctx: RouterContext): Promise<void> => {
    let alive: boolean;
    try {
      alive = isAlive ? await isAlive() : true;
    } catch (err) {
      alive = false;
    }
    ctx.body = { alive };
    if (!alive) {
      ctx.status = Statuses.SERVICE_UNAVAILABLE;
      const headers = ctx.response.headers as Record<string, unknown>;
      headers['Retry-After'] = 30;
    }
  };

export const readinessEndpoint =
  (isReady?: () => Promise<boolean>) =>
  async (ctx: RouterContext): Promise<void> => {
    let ready: boolean;
    try {
      ready = isReady ? await isReady() : true;
    } catch (err) {
      ready = false;
    }
    ctx.body = { ready };
    if (!ready) {
      ctx.status = Statuses.SERVICE_UNAVAILABLE;
      const headers = ctx.response.headers as Record<string, unknown>;
      headers['Retry-After'] = 30;
    }
  };

export const observeMiddleware = (
  logger: Logger,
  options: ObserveMiddlewareOptions,
): Middleware => {
  const middleware = async (
    ctx: RouterContext,
    next: () => Promise<unknown>,
  ): Promise<void> => {
    const started = process.hrtime();

    const requestLogger = logger.child({
      host: ctx.host,
      ip: ctx.ip,
      method: ctx.method,
      path: ctx.request.url,
    });
    ctx.logger = requestLogger;

    if (
      options.useLogger !== false &&
      !options.loggerIgnorePath?.test(ctx.request.url)
    ) {
      requestLogger.verbose('rx');
    }
    await next();

    const duration = process.hrtime(started);
    const durationMs = HrTime.toMs(duration);
    try {
      const route = getRoute(ctx as MaybeWithRouterPath);
      responseSummary.observe(
        {
          method: ctx.method,
          route,
          status: String(ctx.status),
        },
        HrTime.toSeconds(duration),
      );

      options.monitor?.({
        duration: durationMs,
        method: ctx.method,
        path: ctx.path,
        route: getRoute(ctx as MaybeWithRouterPath),
        status: ctx.status,
      });
      if (
        options.useLogger !== false &&
        !options.loggerIgnorePath?.test(ctx.request.url)
      ) {
        requestLogger.verbose('tx', {
          duration: durationMs,
          route,
          status: ctx.status,
          response:
            ctx.status === Statuses.BAD_REQUEST
              ? bodyAsString(ctx.body).slice(0, 2048)
              : undefined,
        });
      }
    } catch (err) {
      requestLogger.error(err as Error);
    }
  };
  return middleware as Middleware;
};
