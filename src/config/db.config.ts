import { ClientConfig } from 'pg';

const dbConfig: ClientConfig = {
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT as number | undefined,
};

export default dbConfig;
