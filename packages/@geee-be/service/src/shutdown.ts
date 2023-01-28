import { Duration } from '@geee-be/core';

const run = (fn: (() => unknown | Promise<unknown>) | undefined, done: () => unknown): void => {
  if (!fn) {
    done();
    return;
  }
  Promise.all([fn()]).finally(done);
};

/**
 * Enable graceful shutdown triggered by SIGINT or SIGTERM
 * @param grace grace period in milliseconds before forcing shutdown
 * @param prepare callback to start shutdown
 * @param finish callback to force shutdown after grace period has expired
 */
export const graceful = (
  grace: Duration,
  prepare?: () => unknown | Promise<unknown>,
  finish?: () => unknown | Promise<unknown>,
): { shuttingDown: boolean } => {
  const status = { shuttingDown: false };

  // signal handlers
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
  signals.forEach((signal: NodeJS.Signals) => {
    process.once(signal, () => {
      console.info(`Signal ${signal} received - shutting down`);
      status.shuttingDown = true;
      run(prepare, () => {
        setTimeout(() => {
          run(finish, () => {
            process.exit(0);
          });
        }, grace);
      });
    });
  });

  /**
   * Log and shutdown on uncaught exceptions
   */
  process.once('uncaughtException', (err) => {
    console.error(err);
    status.shuttingDown = true;
    run(prepare, () => {
      run(finish, () => {
        process.exit(0);
      });
    });
  });

  return status;
};
