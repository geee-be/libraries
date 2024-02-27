import semver from 'semver';
import type { Logger } from './logger.js';

type Origin = 'uncaughtException' | 'unhandledRejection';

export const monitorUncaughtExceptions = (logger: Logger): void => {
  if (semver.satisfies(process.version, '>=13.7.0')) {
    process.on('uncaughtExceptionMonitor', (error: Error, origin: Origin) => {
      logger.fatal(error, { origin });
    });
  } else {
    process.on('uncaughtException', (error: Error, origin: Origin) => {
      logger.fatal(error, { origin });
      process.exit(1);
    });
  }
};
