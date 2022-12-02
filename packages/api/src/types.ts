import { RouterContext } from '@koa/router';
import { JWTPayload } from 'jose';
import { Request } from 'koa';

export interface Client {
  ips: string[];
  userAgent?: string;
}

export interface Entity { }

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

export type ForeignKeyValidation<T = any> = Record<keyof T, (value: any) => Promise<boolean>>;

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

export declare type ExtraContext = WithRequestBody & WithRequestHeaders;
export declare type ApiContext = RouterContext<any, ExtraContext>;

export interface MaybeWithAuthorization {
  authorization?: JWTPayload;
}

export interface AuthorizationContext extends ApiContext, MaybeWithAuthorization {
}

export interface PaginatedList<T> {
  items: T[];
  matches: number;
}
