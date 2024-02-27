import 'reflect-metadata';

export const promiseReduceBoolean = async (
  promises: Promise<boolean>[],
): Promise<boolean> =>
  (await Promise.all(promises)).reduce((acc, b) => acc && b, true);

export namespace Service {
  export const combine = (...services: Service[]): Service => {
    return {
      dispose: () =>
        Promise.all(services.map((service) => service.dispose())).then(
          () => undefined,
        ),
      isAlive: (): Promise<boolean> =>
        promiseReduceBoolean(services.map((service) => service.isAlive())),
      isReady: (): Promise<boolean> =>
        promiseReduceBoolean(services.map((service) => service.isReady())),
      start: () =>
        Promise.all(services.map((service) => service.start())).then(
          () => undefined,
        ),
      stop: () =>
        Promise.all(services.map((service) => service.stop())).then(
          () => undefined,
        ),
    };
  };
}

export interface Service {
  dispose(): Promise<unknown>;
  isAlive(): Promise<boolean>;
  isReady(): Promise<boolean>;
  start(): Promise<unknown>;
  stop(): Promise<unknown>;
}

export type ServiceFactory = (
  isReady: () => Promise<boolean>,
  isAlive: () => Promise<boolean>,
) => Service;
