import type {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
} from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";


export interface IBaseService<T extends ObjectLiteral> {
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

  checkIFExists(options: FindManyOptions<T>): Promise<boolean>;
  delete(options:FindOptionsWhere<T> | FindOptionsWhere<T>[]):Promise<string>
}
