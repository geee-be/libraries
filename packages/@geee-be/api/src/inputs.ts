import { isUlid } from '@geee-be/core';
import { isObject } from 'validata';
import type { ApiContext } from './types.js';
import { params } from './validata-getters.js';

const idParam = (ctx: ApiContext): string => {
  const { id } = params<{ id: string }>(
    ctx,
    isObject({
      id: isUlid(),
    }),
  );
  return id;
};

const change = (_ctx: ApiContext): unknown => {
  return new Date();
};

export const Inputs = {
  idParam,
  change,
};
