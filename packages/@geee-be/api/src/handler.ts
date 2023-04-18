import type { Collection, Filter, MatchKeysAndValues } from 'mongodb';
import { MongoError } from 'mongodb';
import { ulid } from 'ulid';
import type { FindManyHandler, FindOneHandler, InsertOneHandler, PatchOneHandler } from './endpoint.js';
import type { Entity } from './types.js';
import { parseSort } from './util.js';

export interface MutationOptions<
  T extends Entity,
  TInsert extends Entity = Partial<T>,
  TPatch extends Entity = Partial<T>,
> {
  mutateInsert?: (input: TInsert) => TInsert;
  mutatePatch?: (patch: TPatch) => TPatch;
  mutateResult?: (result: T) => unknown;
}

export class Handler<
  T extends Entity & { _id: string },
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
      const stages: Record<string, unknown>[] = [{ $match: filter }];
      stages.push(...additionalAggregateStates());
      if (Object.keys($sort).length) {
        stages.push({ $sort });
      }
      const paginated = [...stages, { $skip: skip }, { $limit: limit }];
      const items = await this.collection.aggregate(paginated).toArray();
      const matches = await this.collection.aggregate<{ count: number }>([...stages, { $count: 'count' }]).toArray();
      return {
        items: items.map((item) => this.mutateResult(item as T)),
        matches: (matches.length && matches[0] && matches[0].count) || 0,
      };
    };
  }

  public findOne(additionalAggregateStates: () => Record<string, unknown>[] = () => []): FindOneHandler<T> {
    return async (filter) => {
      const stages: Record<string, unknown>[] = [{ $match: filter }];
      stages.push(...additionalAggregateStates());
      stages.push({ $limit: 1 });

      const items = await this.collection.aggregate(stages).toArray();
      if (!items.length) return;

      return this.mutateResult(items[0] as T);
    };
  }

  public insertOne(): InsertOneHandler<TInsert> {
    return async (entity) => {
      const _id = ulid();
      const withId = { _id, ...entity };
      const mutated = this.mutateInsert(withId);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await this.collection.insertOne(mutated as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.mutateResult({
        ...mutated,
        _id: result.insertedId,
      } as any);
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

      return this.mutateResult(result.value as T);
    };
  }

  protected mutateInsert(input: TInsert): TInsert {
    return this.options.mutateInsert ? this.options.mutateInsert(input) : input;
  }

  protected mutatePatch(patch: TPatch): TPatch {
    return this.options.mutatePatch ? this.options.mutatePatch(patch) : patch;
  }

  protected mutateResult(result: T): unknown {
    return this.options.mutateResult ? this.options.mutateResult(result) : result;
  }
}
