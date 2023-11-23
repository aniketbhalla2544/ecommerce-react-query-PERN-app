import { ClientConfig, Pool, QueryConfig } from 'pg';
import { types } from 'pg';

const env = process.env;

types.setTypeParser(1700, (x) => parseFloat(x));

const dbConfig: ClientConfig = {
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.PG_HOST,
  port: +Number(env.PG_PORT) || 5432,
};

const pool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  port: dbConfig.port,
  max: 5,
  database: dbConfig.database,
});

// # events
pool.on('connect', async () => {
  try {
    // await createDbTables(client);
    // await initializeProductsUsersTableInDevEnv(client);
  } catch (err) {
    console.error('Error from db pool on connect event, err: ', err);
  }
});

pool.on('error', (err) => {
  console.log('Postgress connection problem, Error: ', err.message);
  process.exit(1);
});

export async function pgquery({ text, values }: QueryConfig) {
  return await pool.query({
    text,
    values,
  });
}
