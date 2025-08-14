import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'BOSTA_TASK',
  
  // Auto-load entities from Domain/Models directory
  entities: [
    path.join(__dirname, '../../Domain/Models/*.model.{ts,js}'),
    // Or if you prefer to specify the exact path:
    // 'src/Domain/Models/*.model.{ts,js}'
  ],
  
  // Migration settings
  migrations: [
    path.join(__dirname, './migrations/*.{ts,js}')
  ],
  
  // Subscriber settings (optional)
  
  
  // Development settings
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  
  // Connection pool settings
  extra: {
    connectionLimit: 10,
  },
  
  // SSL settings for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
});