import { EntityManager } from 'typeorm';
import { IUnitOfWork } from '../../Domain/IServices/IUnitOfWorkService.js';
import { DatabaseService } from '../../Infrastructure/DataBase/DataBaseService.js';

/**
 * Unit of Work implementation for managing database transactions
 * Ensures atomicity across multiple database operations
 */
export class UnitOfWork implements IUnitOfWork {
  constructor() {}

  /**
   * Execute multiple database operations within a single transaction
   * Automatically handles commit/rollback based on success/failure
   * @param work Function containing the database operations to execute
   * @returns Result of the work function
   */
  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    // Create a new query runner for this transaction
    const queryRunner = DatabaseService.getDataSource().createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Execute the work function with the transaction manager
      const result = await work(queryRunner.manager);
      // All operations succeeded, commit the transaction
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      // An error occurred, rollback all changes
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Always clean up the query runner resources
      await queryRunner.release();
    }
  }
}