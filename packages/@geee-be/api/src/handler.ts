import type { Collection, Filter, MatchKeysAndValues, OptionalUnlessRequiredId } from 'mongodb';
import { MongoError } from 'mongodb';
import { ulid } from 'ulid';
import type { FindManyHandler, FindOneHandler, InsertOneHandler, PatchOneHandler } from './endpoint.js';
import type { Entity } from './types.js';
import { parseSort } from './util.js';

export interface WithId {
  _id: string;
}

const asPromise = async <T>(input: T | Promise<T>): Promise<T> =>
  (input as Promise<T>).then && typeof (input as Promise<T>).then === 'function' ? await input : Promise.resolve(input);

export interface MutationOptions<
  T extends Entity,
  TInsert extends Entity = Partial<T>,
  TPatch extends Entity = Partial<T>,
> {
  mutateInsert?: (input: TInsert & WithId) => T;
  mutatePatch?: (patch: TPatch) => TPatch;
  mutateResult?: (results: T[]) => Promise<unknown[]>;
}
export class Handler<
  T extends Entity & WithId,
  TInsert extends Entity = Partial<T>,
  TPatch extends Entity = Partial<T>,
> {
  constructor(
    protected readonly collection: Collection<T>,
    protected readonly options: MutationOptions<T, TInsert, TPatch> = {},
  ) {}

  public findMany(additionalAggregateStates: () => Record<string, unknown>[] = () => []): FindManyHandler<T> {
    return async (filter, sort, limit, skip) => {
      const $sort = parseSort(sort);
      const stages: Record<string, unknown>[] = [{ $match: await asPromise(filter) }];
      stages.push(...additionalAggregateStates());
      if (Object.keys($sort).length) {
        stages.push({ $sort });
      }
      const paginated = [...stages, { $skip: skip }, { $limit: limit }];
      const items = await this.collection.aggregate(paginated).toArray();
      const matches = await this.collection.aggregate<{ count: number }>([...stages, { $count: 'count' }]).toArray();
      return {
        items: await this.mutateResult(items as T[]),
        matches: (matches.length && matches[0] && matches[0].count) || 0,
      };
    };
  }

  public findOne(additionalAggregateStates: () => Record<string, unknown>[] = () => []): FindOneHandler<T> {
    return async (filter) => {
      const stages: Record<string, unknown>[] = [{ $match: await asPromise(filter) }];
      stages.push(...additionalAggregateStates());
      stages.push({ $limit: 1 });

      const items = await this.collection.aggregate(stages).toArray();
      if (!items.length) return;

      return (await this.mutateResult(items as T[]))[0];
    };
  }

  public insertOne(): InsertOneHandler<TInsert> {
    return async (entity) => {
      const _id = ulid();
      const withId = { _id, ...entity };
      const mutated = this.mutateInsert(withId);
      await this.collection.insertOne(mutated as OptionalUnlessRequiredId<T>);
      return (await this.mutateResult([mutated]))[0];
    };
  }

  public patchOne(): PatchOneHandler<TPatch> {
    return async (filter, patch) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.collection.findOneAndUpdate(
        filter as Filter<T>,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        { $set: this.mutatePatch(patch as any) as MatchKeysAndValues<T> },
        { returnDocument: 'after' },
      );
      if (!result.value) throw new MongoError('Unable to patch');

      return (await this.mutateResult([result.value as T]))[0];
    };
  }

  protected mutateInsert(input: TInsert & WithId): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.options.mutateInsert ? this.options.mutateInsert(input) : (input as any);
  }

  protected mutatePatch(patch: TPatch): TPatch {
    return this.options.mutatePatch ? this.options.mutatePatch(patch) : patch;
  }

  protected mutateResult(results: T[]): Promise<unknown[]> {
    return this.options.mutateResult ? this.options.mutateResult(results) : Promise.resolve(results);
  }
}
