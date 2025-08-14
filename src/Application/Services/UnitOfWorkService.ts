import { EntityManager } from 'typeorm';
import { IUnitOfWork } from '../../Domain/IServices/IUnitOfWorkService.js';
import { DatabaseService } from '../../Infrastructure/DataBase/DataBaseService.js';

export class UnitOfWork implements IUnitOfWork{
  constructor() {}

  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = DatabaseService.getDataSource().createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}