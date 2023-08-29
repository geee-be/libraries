import type { Duration } from './time.js';

export const sleep = (duration: Duration): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
