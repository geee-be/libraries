import { Time } from '@geee-be/core';
import { logger } from '@geee-be/logger';
import { Graceful, Service } from '@geee-be/service';
import { asNumber } from 'validata';
import { Api } from '../api.js';
import type { ActionHandler } from '../endpoint.js';
import { Endpoint } from '../endpoint.js';
import { MonitoringService } from '../monitoring-service.js';
import { ApiService } from '../service.js';

const idContract = { id: asNumber() };

class MyApi extends Api {
  constructor() {
    super('/api/v1', {});
  }

  protected mountRoutes(): void {
    this.get(
      '/test/:id',
      Endpoint.action(undefined, this.testHandler(), {
        params: { contract: idContract },
      }),
    );
  }

  private testHandler =
    (): ActionHandler<{ params: { id: number } }> =>
    ({ params: { id } }) => {
      return Promise.resolve({ id });
    };
}

Graceful.service(Time.seconds(1), (isReady, isAlive) =>
  Service.combine(
    MonitoringService.create(8081, logger, isReady, isAlive),
    ApiService.create(8080, logger, new MyApi()),
  ),
).catch((err: Error) => logger.error(err));
