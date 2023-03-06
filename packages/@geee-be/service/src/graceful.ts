import type { Duration } from '@geee-be/core';
import { promiseReduceBoolean, Service, ServiceFactory } from './service.js';
import { graceful } from './shutdown.js';

export class Graceful implements Service {
  public static service(grace: Duration, factory: ServiceFactory): Promise<unknown> {
    const service = new Graceful(grace, factory);
    return service.start();
  }

  private readonly service: Service;

  private running = false;
  private disposed = false;

  private constructor(grace: Duration, factory: ServiceFactory) {
    this.service = factory(
      () => promiseReduceBoolean([this.isReady(), this.service.isReady()]),
      () => promiseReduceBoolean([this.isAlive(), this.service.isAlive()]),
    );
    graceful(
      grace,
      () => this.service.stop(),
      () => this.service.dispose(),
    );
  }

  public isReady(): Promise<boolean> {
    return Promise.resolve(this.running);
  }

  public isAlive(): Promise<boolean> {
    return Promise.resolve(!this.disposed);
  }

  public start(): Promise<unknown> {
    this.running = true;
    return this.service.start();
  }

  public stop(): Promise<unknown> {
    this.running = false;
    return this.service.stop();
  }

  public dispose(): Promise<unknown> {
    this.disposed = true;
    return this.service.dispose();
  }
}
