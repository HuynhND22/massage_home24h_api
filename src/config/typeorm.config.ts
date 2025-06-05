import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const {
  DATABASE_URL = 'postgresql://postgres:123456@localhost:5432/massage_home24h',
} = process.env;

export default new DataSource({
  type: 'postgres',
  url: DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 