import { Statuses } from '@geee-be/core';
import type { JWTPayload } from 'jose';
import Koa from 'koa';
import type { Server } from 'net';
import request from 'supertest';
import type { AuthorizationContext } from './authorization.js';
import { JwtAuthentication, JwtDecoder } from './authorization.js';

describe('JwtAuthentication', () => {
  describe('middleware()', () => {
    const decoder = new JwtAuthentication(
      'dont-tell-dont-tell-dont-tell-anyone',
      {
        verifyOptions: { algorithms: ['HS256'] },
        check: (auth, _) => Promise.resolve(auth?.sub === '1234567890'),
      },
    );
    const app = new Koa();
    app.use(decoder.middleware());
    app.use((ctx: AuthorizationContext) => {
      // return decoded authorization as body so that the tests can check it
      ctx.body = { authorization: ctx.authorization };
      ctx.status = 200;
      return Promise.resolve();
    });

    let server: Server;

    beforeAll(() => {
      server = app.listen();
    });

    afterAll(() => {
      server.close();
    });

    it('must fail no Authorization header', async () => {
      await request(server).post('/').expect(Statuses.UNAUTHORIZED);
    });

    it('must fail malformed Authorization header', async () => {
      await request(server)
        .post('/')
        .set('Authorization', 'TEST')
        .expect(Statuses.UNAUTHORIZED);
    });

    it('must fail malformed Authorization header Bearer token', async () => {
      await request(server)
        .post('/')
        .set('Authorization', 'Bearer TOKEN')
        .expect(Statuses.FORBIDDEN);
    });

    it('must fail jwt signed by incorrect secret', async () => {
      await request(server)
        .post('/')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.rOtgTjkfWU-nIvbDkCKiYEI0_yk1Chf7hqxDyaF-_hU',
        )
        .expect(Statuses.FORBIDDEN);
    });

    it('must set authorization on context if valid token', async () => {
      const response = await request(server)
        .post('/')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XJFQwsk7KL2yjWHl55Q0KW1w0IgV6UjhyUUw_pERYOI',
        )
        .expect(Statuses.OK);
      const { authorization } = response.body as { authorization: JWTPayload };
      expect(authorization).toBeDefined();
      expect(authorization.sub).toBe('1234567890');
      expect(authorization.name).toBe('John Doe');
      expect(authorization.iat).toBe(1516239022);
    });

    it('must fail if check returns false', async () => {
      await request(server)
        .post('/')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NDMyMSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.pCypSgCgyn-D8-_-HXVfssDG2Whjhh0faS7QY_1Qrk4',
        )
        .expect(Statuses.FORBIDDEN);
    });
  });
});

describe('JwtDecoder', () => {
  describe('middleware()', () => {
    const decoder = new JwtDecoder();
    const app = new Koa();
    app.use(decoder.middleware());
    app.use((ctx: AuthorizationContext) => {
      // return decoded authorization as body so that the tests can check it
      ctx.body = { authorization: ctx.authorization };
      ctx.status = 200;
      return Promise.resolve();
    });

    let server: Server;

    beforeAll(() => {
      server = app.listen();
    });

    afterAll(() => {
      server.close();
    });

    it('must ignore no Authorization header', async () => {
      const response = await request(server).post('/');
      const { authorization } = response.body as { authorization: JWTPayload };
      expect(authorization).toBeUndefined();
    });

    it('must ignore malformed Authorization header', async () => {
      const response = await request(server)
        .post('/')
        .set('Authorization', 'TEST');
      const { authorization } = response.body as { authorization: JWTPayload };
      expect(authorization).toBeUndefined();
    });

    it('must ignore malformed Authorization header Bearer token', async () => {
      const response = await request(server)
        .post('/')
        .set('Authorization', 'Bearer TOKEN');
      const { authorization } = response.body as { authorization: JWTPayload };
      expect(authorization).toBeUndefined();
    });

    it('must set authorization on context if valid token', async () => {
      const response = await request(server)
        .post('/')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o',
        );
      const { authorization } = response.body as { authorization: JWTPayload };
      expect(authorization).toBeDefined();
      expect(authorization.sub).toBe('1234567890');
      expect(authorization.name).toBe('John Doe');
      expect(authorization.iat).toBe(1516239022);
    });
  });
});
