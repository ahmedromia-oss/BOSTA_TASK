import type { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";
import type { BaseRepository } from "../../Infrastructure/Repositories/BaseRepository.js";
import type { IBaseRepository } from "../../Domain/IRepositories/IBaseRepository.js";
import { IBaseService } from "../../Domain/IServices/IBaseService.js";


export class BaseService<T extends ObjectLiteral>  implements IBaseService<T>{
  constructor(protected readonly repository: IBaseRepository<T>) {}
  async delete(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<string> {
    return await this.repository.delete(options)
  }
  
  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    return await this.repository.create(data, manager);
  }

  async findAll(options?: FindManyOptions<T>, manager?: EntityManager): Promise<T[]> {
    return await this.repository.findAll(options, manager);
  }

  async findById(id: number | string, options?: FindOneOptions<T>, manager?: EntityManager): Promise<T | null> {
    return await this.repository.findById(id, options, manager);
  }

  async findOne(options: FindOneOptions<T>, manager?: EntityManager): Promise<T | null> {
    return await this.repository.findOne(options, manager);
  }

  async update(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<string> {
    return await this.repository.update(options, data, manager);
  }

  async checkIFExists(options: FindManyOptions<T>): Promise<boolean> {
    return await this.repository.checkIFExists(options);
  }
}