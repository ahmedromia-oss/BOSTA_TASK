import type { DeepPartial, EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from "typeorm";
import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";
import type { BaseRepository } from "../../Infrastructure/Repositories/BaseRepository.js";
import type { IBaseRepository } from "../../Domain/IRepositories/IBaseRepository.js";
import { IBaseService } from "../../Domain/IServices/IBaseService.js";

/**
 * Generic base service providing common CRUD operations
 * Acts as a service layer wrapper around repository methods
 */
export class BaseService<T extends ObjectLiteral> implements IBaseService<T>{
  constructor(protected readonly repository: IBaseRepository<T>) {}

  /**
   * Delete entities matching the given criteria
   */
  async delete(options: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<string> {
    return await this.repository.delete(options)
  }
  
  /**
   * Create a new entity with the provided data
   */
  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    return await this.repository.create(data, manager);
  }

  /**
   * Retrieve all entities matching the optional criteria
   */
  async findAll(options?: FindManyOptions<T>, manager?: EntityManager): Promise<T[]> {
    return await this.repository.findAll(options, manager);
  }

  /**
   * Find a single entity by its ID
   */
  async findById(id: number | string, options?: FindOneOptions<T>, manager?: EntityManager): Promise<T | null> {
    return await this.repository.findById(id, options, manager);
  }

  /**
   * Find the first entity matching the given criteria
   */
  async findOne(options: FindOneOptions<T>, manager?: EntityManager): Promise<T | null> {
    return await this.repository.findOne(options, manager);
  }

  /**
   * Update entities matching the criteria with new data
   */
  async update(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<string> {
    return await this.repository.update(options, data, manager);
  }

  /**
   * Check if any entities exist matching the given criteria
   */
  async checkIFExists(options: FindManyOptions<T>): Promise<boolean> {
    return await this.repository.checkIFExists(options);
  }
}