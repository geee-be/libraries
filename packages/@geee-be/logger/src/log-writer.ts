export interface Log {
  message: string;
  level: string;
  timestamp: Date;
  hostname: string;
  pid: number;
  file?: string;
  line?: number;
  method?: string;
  stack?: string;
}

export interface LogWriter {
  write(log: Log): void;
}
