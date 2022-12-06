import { Logger } from '@geee-be/logger';
import { Service } from '@geee-be/service';
import Router from '@koa/router';
import { DefaultContext } from 'koa';
import { KoaService, ServiceOptions } from './koa-service.js';
import type { ApiContext } from './types.js';

export interface Mountable {
  mount(parent: Router<any, any>): void;
}

export class ApiService<StateT = any, CustomT extends DefaultContext = ApiContext> extends KoaService<ServiceOptions, StateT, CustomT> {
  public static create(port: number | string, logger: Logger, ...apis: Mountable[]): Service {
    return new ApiService(apis, { logger, port, proxy: true });
  }

  constructor(private readonly apis: Mountable[], options: ServiceOptions) {
    super(options);
  }

  protected mountApi(router: Router<StateT, CustomT>): void {
    this.apis.forEach((api) => api.mount(router));
  }
}
