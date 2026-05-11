import type { RouterInstance, RouterOptions } from '@koa/router';
import Router from '@koa/router';
import type { ApiContext } from './types.js';

export abstract class Api<StateT = any, CustomT = ApiContext> extends Router {
  /**
   * Create API
   * @param path - Path to mount this API inside the router
   */
  constructor(path?: string, options?: RouterOptions) {
    super({ prefix: path, ...options });
  }

  public mount(parent: RouterInstance<StateT, CustomT>): void {
    this.mountRoutes();
    parent.use(this.routes(), this.allowedMethods());
  }

  /**
   * Override to add the routes for this API
   * @return {void}
   */
  protected abstract mountRoutes(): void;
}
