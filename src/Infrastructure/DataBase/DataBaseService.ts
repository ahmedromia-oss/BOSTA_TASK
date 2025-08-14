import { AppDataSource } from "./DataSource.js";


export class DatabaseService {
  static async initialize(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Database connection established');
      }
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  static async close(): Promise<void> {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }

  static getDataSource() {
    if (!AppDataSource.isInitialized) {
      throw new Error('Database not initialized. Call DatabaseService.initialize() first.');
    }
    return AppDataSource;
  }
}