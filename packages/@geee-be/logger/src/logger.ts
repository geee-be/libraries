import { hostname } from 'os';
import { get } from 'stack-trace';
import { ConsoleWriter } from './console-writer.js';
import { Log, LogWriter } from './log-writer.js';

export interface DebugMeta {
  /** A ticket/reminder should be created to remove Debug logs */
  removalTicket?: string;
}

export interface CriticalMeta {
  code: string;
  /** Ideally the log message/data should include a link to instructions on how to deal with the situation */
  playbookUrl?: string;
}

export interface Logger {
  (message: string, meta?: Record<string, unknown>): void;
  verbose(message: string, meta?: Record<string, unknown>): void;
  debug<T extends DebugMeta>(message: string, meta?: T): void;
  info(message: string, meta?: Record<string, unknown>): void;
  notice(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, error?: Error, meta?: Record<string, unknown>): void;
  error(error: Error, meta?: Record<string, unknown>): void;
  fatal(error: Error, meta?: Record<string, unknown>): void;
  critical<T extends CriticalMeta>(message: string, meta: T): void;
  audit(message: string, meta?: Record<string, unknown>): void;
  child(meta: Record<string, unknown>): Logger;
}

export interface WithLogger {
  logger: Logger;
}

export interface MaybeWithLogger {
  logger?: Logger;
}

export interface LoggerOptions {
  addStackInfo?: boolean;
}

const DEFAULT_OPTIONS: LoggerOptions = {
  addStackInfo: false,
};

const systemMeta = {
  hostname: hostname(),
  pid: process.pid,
};

export const createLogger = (
  writer: () => LogWriter,
  meta?: Record<string, unknown>,
  options?: LoggerOptions,
): Logger => {
  const actualOptions = { ...DEFAULT_OPTIONS, ...options };
  const baseMeta = { ...meta };

  const write = (level: string, message: string, meta?: Record<string, unknown>): void => {
    const log = { message, timestamp: new Date() } as Log;
    if (actualOptions.addStackInfo) {
      try {
        // extend data
        const frame = get()[1];
        log.file = frame.getFileName() ?? undefined;
        log.line = Number(frame.getLineNumber());

        const type = frame.getTypeName();
        const method = frame.getMethodName();
        Object.assign(log, {
          method: method ? `${type}.${method}` : frame.getFunctionName(),
        });
      } catch (err) {
        console.error(err);
      }
    }
    writer().write({
      ...log,
      ...systemMeta,
      ...baseMeta,
      ...meta,
      level,
    });
  };

  const clz = ((message: string, meta?: Record<string, unknown>): void => write('info', message, meta)) as Logger;
  clz.verbose = (message: string, meta?: Record<string, unknown>): void => write('verbose', message, meta);
  clz.debug = (message: string, meta?: DebugMeta): void => write('debug', message, meta as Record<string, unknown>);
  clz.info = (message: string, meta?: DebugMeta): void => write('info', message, meta as Record<string, unknown>);
  clz.notice = (message: string, meta?: Record<string, unknown>): void => write('notice', message, meta);
  clz.warn = (message: string, error?: Error, meta?: Record<string, unknown>): void =>
    write('warn', message, {
      ...(error ? { error: `${error.name}: ${error.message}` } : undefined),
      ...error,
      ...meta,
    });
  clz.error = (error: Error, meta?: Record<string, unknown>): void => {
    const log = {
      level: 'error',
      message: `${error.name}: ${error.message}`,
      stack: error.stack,
      timestamp: new Date(),
    };
    writer().write({
      ...log,
      ...error,
      ...systemMeta,
      ...baseMeta,
      ...meta,
    });
  };
  clz.fatal = (error: Error, meta?: Record<string, unknown>): void => {
    const log = {
      level: 'fatal',
      message: `${error.name}: ${error.message}`,
      stack: error.stack,
      timestamp: new Date(),
    };
    writer().write({
      ...log,
      ...error,
      ...systemMeta,
      ...baseMeta,
      ...meta,
    });
  };
  clz.critical = <T extends CriticalMeta>(message: string, meta: T): void =>
    write('warn', message, meta as Record<string, unknown>);
  clz.audit = (message: string, meta?: Record<string, unknown>): void => write('warn', message, meta);
  clz.child = (meta: Record<string, unknown>): Logger => {
    const combinedMeta = { ...baseMeta, ...meta };
    return createLogger(writer, combinedMeta);
  };
  return clz;
};

export class Writer implements LogWriter {
  constructor(private readonly writer: (log: Log) => void) {}

  public write(log: Log): void {
    this.writer(log);
  }
}

export const loggerOptions: {
  writer?: LogWriter;
  meta?: Record<string, unknown>;
} = {};
const consoleWriter = new ConsoleWriter({ pretty: true });
export const logger: Logger = createLogger(() => loggerOptions.writer || consoleWriter, loggerOptions.meta);
