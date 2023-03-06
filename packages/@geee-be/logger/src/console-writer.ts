import type { Log, LogWriter } from './log-writer.js';
import { omit } from './omit.js';

export interface ConsoleOptions {
  pretty: boolean;
  prettyOmit?: (keyof Log)[];
  skip?: (log: any) => boolean;
}

export const OMIT_PRETTY: (keyof Log)[] = [
  'file',
  'hostname',
  'line',
  'message',
  'pid',
  'timestamp',
  'host',
  'ip',
  'spanId',
  'traceId',
];

const DEFAULT_OPTIONS: ConsoleOptions = {
  pretty: true,
  prettyOmit: OMIT_PRETTY,
};

export class ConsoleWriter implements LogWriter {
  constructor(private readonly options = DEFAULT_OPTIONS) {}

  public write(log: Log): void {
    if (this.options.skip && this.options.skip(log)) return;
    if (this.options.pretty) {
      process.nextTick(() =>
        console.log(
          (log?.timestamp ?? new Date()).toISOString(),
          log?.message ?? '',
          omit(log, this.options.prettyOmit || OMIT_PRETTY),
        ),
      );
      return;
    }
    process.nextTick(() => console.log(JSON.stringify(log)));
  }
}
