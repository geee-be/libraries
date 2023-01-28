import { Collection, Filter, MongoError, OptionalUnlessRequiredId } from 'mongodb';
import { ulid } from 'ulid';
import { FindManyHandler, FindOneHandler, InsertOneHandler, PatchOneHandler } from './endpoint';
import type { Entity } from './types.js';
import { parseSort } from './util';

export interface MutationOptions<T extends Entity> {
  mutateInsert?: (input: Partial<T>) => Partial<T>;
  mutatePatch?: (patch: Partial<T>) => Partial<T>;
  mutateResult?: (result: Entity) => unknown;
}

export class Handler<T extends Entity> {
  constructor(protected readonly collection: Collection<T>, protected readonly options: MutationOptions<T> = {}) {}

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
        items: items.map((item) => this.mutateResult(item)),
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

      return this.mutateResult(items[0]);
    };
  }

  public insertOne(): InsertOneHandler<Partial<T>> {
    return async (entity) => {
      const _id = ulid();
      const withId = { _id, ...entity };
      const mutated = this.mutateInsert(withId);
      const result = await this.collection.insertOne(mutated as OptionalUnlessRequiredId<T>);
      return this.mutateResult({
        ...mutated,
        _id: result.insertedId,
      });
    };
  }

  public patchOne(): PatchOneHandler<Partial<T>> {
    return async (filter, patch) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.collection.findOneAndUpdate(
        filter as Filter<T>,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { $set: this.mutatePatch(patch) as any },
        { returnDocument: 'after' },
      );
      if (!result.value) throw new MongoError('Unable to patch');

      return this.mutateResult(result.value);
    };
  }

  protected mutateInsert(input: Partial<T>): Partial<T> {
    return this.options.mutateInsert ? this.options.mutateInsert(input) : input;
  }

  protected mutatePatch(patch: Partial<T>): Partial<T> {
    return this.options.mutatePatch ? this.options.mutatePatch(patch) : patch;
  }

  protected mutateResult(result: Entity): unknown {
    return this.options.mutateResult ? this.options.mutateResult(result) : result;
  }
}
