import { AppDataSource } from "./DataSource.js";


export class DatabaseService {
  static async initialize(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
    } catch (error) {
      throw error;
    }
  }

  static async close(): Promise<void> {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  static getDataSource() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized. Call DatabaseService.initialize() first.');
    }
    return AppDataSource;
  }
}