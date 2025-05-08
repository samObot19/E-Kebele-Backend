import { config } from 'dotenv';

config();

const DEFAULT_CONFIG = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default DEFAULT_CONFIG;