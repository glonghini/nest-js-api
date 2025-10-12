import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'nestjs',
  password: process.env.DB_PASSWORD || 'nestjs123',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [User],
  migrations: ['migrations/*.ts'],
  synchronize: false,
  logging: true,
});
