import type {
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  EntityManager,
} from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';


export interface IBaseRepository<T> {
  checkIFExists(options: FindManyOptions<T>): Promise<boolean>;

  create(data: DeepPartial<T>, manager?: EntityManager): Promise<T>;

  findAll(options?: FindManyOptions<T>, manager?: EntityManager): Promise<T[]>;

  findById(
    id: number | string,
    options?: FindOneOptions<T>,
    manager?: EntityManager,
  ): Promise<T | null>;

  findOne(options: FindOneOptions<T>, manager?: EntityManager): Promise<T | null>;

  update(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<string>;

  delete(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    manager?: EntityManager,
  ): Promise<string>;
}
