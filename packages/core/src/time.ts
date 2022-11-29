export declare type Duration = number;

export namespace Time {
  export const SECOND = 1000;
  export const MINUTE = 60 * Time.SECOND;
  export const HOUR = 60 * Time.MINUTE;
  export const DAY = 24 * Time.HOUR;

  export const past = (interval: Duration): Date => new Date(Date.now() - toMs(interval));
  export const future = (interval: Duration): Date => new Date(Date.now() + toMs(interval));

  export const ms = (milliSeconds: number): Duration => milliSeconds;
  export const seconds = (s: number): Duration => s * Time.SECOND;
  export const minutes = (m: number): Duration => m * Time.MINUTE;
  export const hours = (h: number): Duration => h * Time.HOUR;
  export const days = (d: number): Duration => d * Time.DAY;

  export const wholeMs = (d: Duration): number => Math.round(toMs(d));
  export const wholeSeconds = (d: Duration): number => Math.round(toMs(d) / Time.SECOND);
  export const wholeMinutes = (d: Duration): number => Math.round(toMs(d) / Time.MINUTE);
  export const wholeHours = (d: Duration): number => Math.round(toMs(d) / Time.HOUR);
  export const wholeDays = (d: Duration): number => Math.round(toMs(d) / Time.DAY);

  export const toMs = (d: Duration): number => d;
  export const toSeconds = (d: Duration): number => toMs(d) / Time.SECOND;
  export const toMinutes = (d: Duration): number => toMs(d) / Time.MINUTE;
  export const toHours = (d: Duration): number => toMs(d) / Time.HOUR;
  export const toDays = (d: Duration): number => toMs(d) / Time.DAY;
}
