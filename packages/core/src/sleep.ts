import { Duration } from './time';

export const sleep = (duration: Duration): Promise<unknown> => {
  return new Promise((res) => { setTimeout(res, duration); });
};
