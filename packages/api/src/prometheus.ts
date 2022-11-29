import { RouterContext } from '@koa/router';
import { register } from 'prom-client';

/**
 * Renders monitoring metrics for Prometheus
 */
export const prometheusMetricsEndpoint = () => async (ctx: RouterContext): Promise<void> => {
  ctx.type = register.contentType;
  ctx.body = register.metrics();
  return Promise.resolve();
};
