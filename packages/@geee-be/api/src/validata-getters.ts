import type { ValueProcessor } from 'validata';
import { check } from 'validata';
import type { ApiContext } from './types.js';

export const body = <T>(ctx: ApiContext, checker: ValueProcessor<T>): T =>
  check(checker, () => ctx.request.body);

export const headers = <T>(ctx: ApiContext, checker: ValueProcessor<T>): T =>
  check(checker, () => ctx.header, '#');

export const params = <T>(ctx: ApiContext, checker: ValueProcessor<T>): T =>
  check(checker, () => ctx.params, ':');

export const query = <T>(ctx: ApiContext, checker: ValueProcessor<T>): T =>
  check(checker, () => ctx.query, '?');
