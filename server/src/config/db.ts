import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sharedOptions = {
  dialect: 'mysql' as const,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
};

function createSequelize(): Sequelize {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    return new Sequelize(databaseUrl, sharedOptions);
  }

  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const database = process.env.DB_NAME?.trim();
  const password = process.env.DB_PASSWORD ?? '';
  const port = Number(process.env.DB_PORT) || 3306;

  if (!host || !user || !database) {
    throw new Error(
      'Set DATABASE_URL, or DB_HOST, DB_USER, DB_NAME (and optional DB_PORT, DB_PASSWORD)',
    );
  }

  return new Sequelize(database, user, password, {
    ...sharedOptions,
    host,
    port,
  });
}

export const sequelize = createSequelize();

export async function connectDb(): Promise<void> {
  await sequelize.authenticate();
}
