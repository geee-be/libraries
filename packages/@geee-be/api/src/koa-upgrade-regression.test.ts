import { Statuses } from '@geee-be/core';
import type { Logger } from '@geee-be/logger';
import Router from '@koa/router';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import type { ServiceOptions } from './koa-service.js';
import { KoaService } from './koa-service.js';

const createTestLogger = (
  onChild?: (meta: Record<string, unknown>) => void,
): Logger => {
  const base = ((_: string): void => {}) as Logger;

  base.verbose = (): void => {};
  base.debug = (): void => {};
  base.info = (): void => {};
  base.notice = (): void => {};
  base.warn = (): void => {};
  base.error = (): void => {};
  base.fatal = (): void => {};
  base.critical = (): void => {};
  base.audit = (): void => {};
  base.child = (meta: Record<string, unknown>): Logger => {
    onChild?.(meta);
    return base;
  };

  return base;
};

class TestKoaService extends KoaService {
  constructor(options: ServiceOptions) {
    super(options);

    const router = new Router();
    this.mountApi(router);
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  protected mountApi(router: Router): void {
    router.get('/hello', (ctx) => {
      ctx.body = { ok: true };
      ctx.status = Statuses.OK;
    });
  }
}

describe('Koa upgrade regressions', () => {
  describe('static file handling', () => {
    let staticPath: string;

    beforeAll(() => {
      staticPath = mkdtempSync(join(tmpdir(), 'geee-be-api-static-'));
      writeFileSync(join(staticPath, 'index.txt'), 'hello');
    });

    afterAll(() => {
      rmSync(staticPath, { recursive: true, force: true });
    });

    it('returns 404 with standard NotFound error shape for missing static files', async () => {
      const app = new TestKoaService({
        logger: createTestLogger(),
        port: 0,
        staticPath,
      });

      const response = await request(app.callback())
        .get('/missing.txt')
        .expect(Statuses.NOT_FOUND);

      expect(response.body).toEqual({
        error: {
          type: 'NotFoundError',
          message: 'Not Found',
        },
      });
    });
  });

  describe('host handling with proxy setting', () => {
    it('uses Host header when proxy=false', async () => {
      const hosts: string[] = [];
      const app = new TestKoaService({
        logger: createTestLogger((meta) => {
          const host = meta.host;
          if (typeof host === 'string') {
            hosts.push(host);
          }
        }),
        port: 0,
        proxy: false,
      });

      await request(app.callback())
        .get('/hello')
        .set('Host', 'service.example')
        .set('X-Forwarded-Host', 'proxy.example')
        .expect(Statuses.OK);

      expect(hosts).toContain('service.example');
      expect(hosts).not.toContain('proxy.example');
    });

    it('uses X-Forwarded-Host when proxy=true', async () => {
      const hosts: string[] = [];
      const app = new TestKoaService({
        logger: createTestLogger((meta) => {
          const host = meta.host;
          if (typeof host === 'string') {
            hosts.push(host);
          }
        }),
        port: 0,
        proxy: true,
      });

      await request(app.callback())
        .get('/hello')
        .set('Host', 'service.example')
        .set('X-Forwarded-Host', 'proxy.example')
        .expect(Statuses.OK);

      expect(hosts).toContain('proxy.example');
    });
  });
});
