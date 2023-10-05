import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Storage } from './types.js';
import { fileDigest, isMigration, promisish } from './utils.js';

export class Migration<Props> {
  private readonly migrations: Promise<string[]>;

  constructor(
    pattern: string,
    private readonly storage: Storage,
  ) {
    this.migrations = glob(pattern, { absolute: true }).then<string[]>((migrations) => migrations.toSorted());
  }

  public async run(props: Props): Promise<void> {
    const migrations = await Promise.all(
      (await this.migrations).map(async (migration) => {
        const info = await fs.stat(migration);
        const digest = await fileDigest(migration);
        const fileName = path.relative(process.cwd(), migration);
        const modified = info.mtime;
        return {
          migrationPath: migration,
          digest,
          fileName,
          modified,
        };
      }),
    );

    // find migration gaps
    const migrationApplications = await Promise.all(
      migrations.map(async (migration) => {
        const isApplied = (await this.storage.check(migration.fileName, migration.digest)).applied;
        return {
          ...migration,
          isApplied,
        };
      }),
    );

    const anyMigrations = !!migrationApplications.length;
    if (anyMigrations) {
      const firstNotApplied = migrationApplications.findIndex((migration) => !migration.isApplied);
      if (firstNotApplied >= 0) {
        // look for applied migrations after that
        const needsToRollBack = migrationApplications.slice(firstNotApplied).filter((migration) => migration.isApplied);
        if (needsToRollBack.length) {
          for (const { migrationPath, fileName } of needsToRollBack.toReversed()) {
            const instance = (await import(migrationPath)) as unknown;
            if (!isMigration<Props>(instance)) {
              console.error(fileName, 'does not correctly export migration functions.');
              return;
            }
            console.error('Roll back', fileName);
            await promisish(instance.down?.(props));
            await this.storage.unapplied(fileName);
          }
        }
      }
    }

    // apply updates
    for (const { migrationPath, fileName, digest } of migrations) {
      const instance = (await import(migrationPath)) as unknown;
      if (!isMigration<Props>(instance)) {
        console.error(fileName, 'does not correctly export migration functions.');
        return;
      }

      const check = await this.storage.check(fileName, digest);
      if (check.applied) {
        if (check.current) continue;

        if (!instance.idempotent) {
          console.error(fileName, 'has changed but cannot be re-applied - skipping.', digest);
          continue;
        } else {
          console.error('Reapply', fileName, digest);
        }
      } else {
        console.error('Apply', fileName, digest);
      }

      await promisish(instance.up(props));
      await this.storage.applied(fileName, digest);
    }
  }
}
