import { AppConfig } from './config.interface';

export const appConfiguration = (): AppConfig => ({
  port: parseInt(process.env.CRM_PORT, 10) || 3000,
  host: process.env.CRM_HOST,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  client: process.env.FRONTEND_HOST,
  mode: process.env.MODE || 'PROD',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
