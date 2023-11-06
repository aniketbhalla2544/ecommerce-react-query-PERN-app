import { ClientConfig, Pool, QueryConfig } from 'pg';
import { types } from 'pg';

const env = process.env;

types.setTypeParser(1700, (x) => parseFloat(x));

const dbConfig: ClientConfig = {
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  host: env.PGHOST,
  port: Number(env.PGPORT),
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
// pool.on('connect', (client) => {
pool.on('connect', () => {
  // console.log('Connection established by a client');
});

// pool.on('error', (err: Error, client: Client) => {
pool.on('error', () => {
  // console.log('Postgress connection problem, Error: ', err);
  process.exit();
});

export async function pgquery({ text, values }: QueryConfig) {
  // console.log('About pg pool: ', {
  //   totalCount: pool.totalCount,
  //   idleCount: pool.idleCount,
  //   waitingCount: pool.waitingCount,
  // });
  return await pool.query({
    text,
    values,
  });
}

export const USER_ID = 1;
