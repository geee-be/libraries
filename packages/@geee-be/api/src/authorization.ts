import { Statuses } from '@geee-be/core';
import { logger, Logger, MaybeWithLogger } from '@geee-be/logger';
import * as Router from '@koa/router';
import { createSecretKey } from 'crypto';
import jose, { JWSHeaderParameters, JWTPayload, JWTVerifyOptions, KeyLike } from 'jose';
import { Context, Middleware, Next } from 'koa';
import { ApiContext, RequestHeaders } from './types';

const TOKEN_EXTRACTOR = /^Bearer (.*)$/;
const debug = logger.child({ module: 'api:authorization' });

export interface MaybeWithAuthorization {
  authorization?: JWTPayload;
}

export interface AuthorizationContext extends ApiContext, MaybeWithAuthorization {
}

export type CheckToken = (authorization: JWTPayload | undefined, ctx: Context) => Promise<boolean>;

export interface Options {
  verifyOptions?: JWTVerifyOptions;
  continueOnUnauthorized?: boolean;

  check?: CheckToken;
}

export interface AuthorizationSuccess {
  authorization: JWTPayload;
  status: undefined;
}

export interface AuthorizationFailure {
  authorization: undefined;
  status: Statuses;
}

export namespace Jwt {
  export const getBearerToken = (headers: RequestHeaders): string | undefined => {
    const authorization = headers.authorization;
    if (!authorization) return undefined;
    const matches = TOKEN_EXTRACTOR.exec(Array.isArray(authorization) ? authorization[0] : authorization);
    return matches && matches[1] || undefined;
  };

  export const decode = (jwt: string): {
    payload: JWTPayload;
    header: JWSHeaderParameters;
  } => {
    if (typeof jwt !== 'string') {
      throw new Error('JWT must be a string');
    }
    const { 0: encodedHeader, 1: encodedPayload, length } = jwt.split('.');
    if (length !== 3) {
      throw new Error('Invalid JWT');
    }
    try {
      const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString('utf8')) as JWSHeaderParameters;
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf8')) as JWTPayload;
      return { payload, header };
    }
    catch (err) {
      throw new Error('Invalid JWT - Error Parsing JSON');
    }
  };
}

export class JwtDecoder {
  constructor() { }

  public middleware(): Middleware<any, AuthorizationContext> & Router.Middleware<any, AuthorizationContext> {
    return async (ctx: AuthorizationContext, next: Next): Promise<void> => {
      const { headers } = ctx.request;
      ctx.authorization = JwtDecoder.getAuthorization(headers);
      await next();
    };
  }
}

export namespace JwtDecoder {
  export const getAuthorization = (headers: RequestHeaders): JWTPayload | undefined => {
    try {
      // decode token
      const token = Jwt.getBearerToken(headers);
      if (token) {
        return Jwt.decode(token).payload;
      }
    } catch (err) {
      debug.error(err as Error);
    }
    return undefined;
  };
}

abstract class BaseJwtAuthentication {
  constructor(
    protected readonly options?: Options,
  ) { }

  public async getAuthorization(headers: RequestHeaders, log: Logger): Promise<AuthorizationSuccess | AuthorizationFailure> {
    try {
      // decode token
      const token = Jwt.getBearerToken(headers);
      if (token) {
        const result = await jose.jwtVerify(token, await this.getSecretOrPublicKey(token), this.options?.verifyOptions);
        return {
          authorization: result.payload,
          status: undefined,
        };
      }
      return {
        authorization: undefined,
        status: Statuses.UNAUTHORIZED,
      };
    } catch (err) {
      if (!(err instanceof Error)) throw err;
      switch (err.name) {
        case 'JWTClaimInvalid':
        case 'JWSInvalid':
        case 'JWSSignatureVerificationFailed':
          log.warn(err.message);
          return {
            authorization: undefined,
            status: Statuses.FORBIDDEN,
          };
        case 'JWTMalformed':
          log.warn(err.message);
          return {
            authorization: undefined,
            status: Statuses.UNAUTHORIZED,
          };
        default:
          log.error(err);
          return {
            authorization: undefined,
            status: Statuses.UNAUTHORIZED,
          };
      }
    }
  }

  public middleware(): Middleware<any, AuthorizationContext> & Router.Middleware<any, AuthorizationContext> {
    return async (ctx: AuthorizationContext, next: Next): Promise<void> => {
      const { status, authorization } = await this.getAuthorization(ctx.request.headers, (ctx as MaybeWithLogger).logger || debug);
      if (status) {
        ctx.status = status;
        if (!this.options?.continueOnUnauthorized) return;
      }
      if (this.options?.check && !(await this.options.check(authorization, ctx))) {
        ctx.status = Statuses.FORBIDDEN;
        return;
      }
      ctx.authorization = authorization;
      await next();
    };
  }

  protected abstract getSecretOrPublicKey(token: string): Promise<Uint8Array | KeyLike>;
}

export class JwtAuthentication extends BaseJwtAuthentication {
  constructor(
    private readonly secretOrPublicKey: string | Buffer,
    options?: Options,
  ) {
    super(options);
  }

  protected getSecretOrPublicKey(): Promise<Uint8Array | KeyLike> {
    return Promise.resolve(createSecretKey(Buffer.from(this.secretOrPublicKey)));
  }
}
