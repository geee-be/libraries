import type { RouterContext } from '@koa/router';
import type { DefaultContext, Request } from 'koa';

export type Entity = object;

export type ApiEndpoint = (ctx: ApiContext) => Promise<void>;

export interface FindManyQuery {
  filter?: Record<string, unknown>;
  limit?: number;
  skip: number;
  sort?: string[];
}

export interface FindManyResult<T> {
  items: T[];
  matches: number;
}

export type ForeignKeyValidation<T = unknown> = Record<keyof T, (value: unknown) => Promise<boolean>>;

interface WithRequestBody {
  request: Request & {
    body: unknown;
  };
}

export declare type RequestHeaders = Record<string, string | string[] | undefined>;
interface WithRequestHeaders {
  request: Request & {
    headers: RequestHeaders;
  };
}

export declare type ExtraContext = DefaultContext & WithRequestBody & WithRequestHeaders;
export declare type ApiContext = RouterContext<unknown, ExtraContext>;

export interface PaginatedList<T> {
  items: T[];
  matches: number;
}
