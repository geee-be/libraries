import type { Collection, Db } from 'mongodb';
import type { Storage } from './types';

export class MongoStorage implements Storage {
  private readonly migrations: Collection<{
    _id: string;
    digest: string;
    when: Date;
  }>;

  constructor(db: Db) {
    this.migrations = db.collection('_migrations');
  }

  public async check(
    fileName: string,
    digest: string,
  ): Promise<{ applied: boolean; current: boolean }> {
    const migration = await this.migrations.findOne({ _id: fileName });

    if (!migration) return { applied: false, current: false };
    return { applied: true, current: migration.digest === digest };
  }

  public async applied(fileName: string, digest: string): Promise<void> {
    await this.migrations.updateOne(
      { _id: fileName },
      { $set: { digest, when: new Date() } },
      { upsert: true },
    );
  }

  public async unapplied(fileName: string): Promise<void> {
    await this.migrations.deleteOne({ _id: fileName });
  }
}
