import { Logger } from '@geee-be/logger';
import { Service } from '@geee-be/service';
import Router from '@koa/router';
import Koa from 'koa';
import { Server } from 'net';
import 'reflect-metadata';
import { onError } from './error.js';
import { errorMiddleware, livenessEndpoint, readinessEndpoint } from './middleware.js';
import { prometheusMetricsEndpoint } from './prometheus.js';

export interface MonitoringServiceOptions {
  isAlive?: () => Promise<boolean>;
  isReady?: () => Promise<boolean>;
  logger: Logger;
  port: number | string; // server port
}

export class MonitoringService<TOptions extends MonitoringServiceOptions = MonitoringServiceOptions>
  extends Koa
  implements Service
{
  protected readonly logger: Logger;

  private server: Server | undefined;

  private alive = true;

  /**
   * Create Koa app
   * @param options
   */
  constructor(protected readonly options: TOptions) {
    super();

    this.logger = this.options.logger;
    this.use(errorMiddleware());

    this.on('error', onError(this.options.port, this.logger));
  }

  public isAlive(): Promise<boolean> {
    return Promise.resolve(this.alive);
  }

  public isReady(): Promise<boolean> {
    return Promise.resolve(!!this.server);
  }

  public start(): Promise<void> {
    if (this.server) throw new Error('Already started');

    const router = new Router();
    router.get('/alive', livenessEndpoint(this.options.isAlive));
    router.get('/metrics', prometheusMetricsEndpoint());
    router.get('/ready', readinessEndpoint(this.options.isReady));

    this.use(router.routes());
    this.use(router.allowedMethods());

    // start server
    return new Promise((resolve, reject) => {
      if (this.server) {
        reject(new Error('Already started'));
        return;
      }
      this.server = this.listen(this.options.port, () => {
        this.logger(`Monitoring started on http://localhost:${this.options.port}/`);
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return Promise.resolve();
  }

  public dispose(): Promise<void> {
    this.alive = false;
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          return reject(err);
        }
        this.server = undefined;
        resolve();
      });
    });
  }
}

export namespace MonitoringService {
  export const create = (
    port: number | string,
    logger: Logger,
    isReady: () => Promise<boolean>,
    isAlive?: () => Promise<boolean>,
  ): Service => {
    return new MonitoringService({
      isReady: (): Promise<boolean> => isReady(),
      isAlive: async (): Promise<boolean> => {
        const alive = await isAlive?.();
        const ready = await isReady();
        return (alive ?? true) && ready;
      },
      logger,
      port,
    });
  };
}
