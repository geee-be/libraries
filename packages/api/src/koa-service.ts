import { Logger } from '@geee-be/logger';
import { Service } from '@geee-be/service';
import Router from '@koa/router';
import Koa, { DefaultContext, DefaultState } from 'koa';
import helmet from 'koa-helmet';
import { Server } from 'net';
import { collectDefaultMetrics } from 'prom-client';
import 'reflect-metadata';
import { validate } from 'validata-koa';
import { onError } from './error.js';
import { DEFAULT_HELMET_OPTIONS, HelmetOptions } from './helmet.js';
import { errorMiddleware, Monitor, observeMiddleware } from './middleware.js';

import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import serveStatic from 'koa-static';
import { requestContextMiddleware } from './request-context.js';

const DEFAULT_OPTIONS = {
  helmetOptions: DEFAULT_HELMET_OPTIONS,
  observe: true,
  port: 80,
  serviceName: 'service',
};

if (process.env.JEST_WORKER_ID === undefined) {
  collectDefaultMetrics();
}

export interface ServiceOptions {
  helmetOptions?: HelmetOptions;
  isAlive?: () => Promise<boolean>;
  isReady?: () => Promise<boolean>;
  logger: Logger;
  loggerIgnorePath?: RegExp;
  monitor?: Monitor;
  observe?: boolean;
  port: number | string; // server port
  proxy?: boolean;
  serviceName?: string; // name of service, used for tracing
  staticPath?: string; // directory from which to serve static files
  useLogger?: boolean; // include koa logger
}

// noinspection JSUnusedGlobalSymbols
export abstract class KoaService<TOptions extends ServiceOptions = ServiceOptions, StateT extends DefaultState = DefaultState, CustomT extends DefaultContext = DefaultContext> extends Koa<StateT, CustomT> implements Service {
  protected readonly options: TOptions;

  protected readonly logger: Logger;

  private server: Server | undefined;

  private alive = true;

  /**
   * Create Koa app
   * @param options
   */
  constructor(options: TOptions) {
    super();

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.logger = this.options.logger;
    this.proxy = this.options.proxy ?? false;

    if (this.options.observe) {
      this.use(observeMiddleware(this.logger, this.options));
    }
    this.use(errorMiddleware());
    this.use(validate());
    if (this.options.helmetOptions) {
      this.use(helmet(this.options.helmetOptions));
    }
    this.use(conditional());
    this.use(etag());
    this.use(compress());
    if (this.options.staticPath) {
      this.logger.info(`Serving static content from ${this.options.staticPath}`);
      this.use(serveStatic(this.options.staticPath));
    }
    this.use(bodyParser());
    this.use(requestContextMiddleware());

    this.on('error', onError(this.options.port, this.logger));
  }

  /**
   * Return true if this service is alive
   */
  public isAlive(): Promise<boolean> { return Promise.resolve(this.alive); }

  /**
    * Return true if this service is ready for operation
    */
  public isReady(): Promise<boolean> { return Promise.resolve(!!this.server); }

  /**
   * Start the app
   */
  public start(): Promise<void> {
    const router = new Router<StateT, CustomT>();
    this.mountApi(router);

    this.use(router.routes());
    this.use(router.allowedMethods());

    // start server
    return this.startServer();
  }

  public stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        this.server = undefined;
        resolve();
      });
    });
  }

  public dispose(): Promise<void> {
    this.alive = false;
    return Promise.resolve();
  }

  /**
   * Start the web server
   */
  private startServer = (): Promise<void> => new Promise<void>((resolve, reject) => {
    if (this.server) {
      reject(new Error('Already started'));
      return;
    }
    this.server = this.listen(this.options.port, () => {
      this.logger.info(`HTTP started on http://localhost:${this.options.port}/`);
      resolve();
    });
  });

  /**
   * Override to mount API routes
   */
  protected abstract mountApi(router: Router<StateT, CustomT>): void;
}
