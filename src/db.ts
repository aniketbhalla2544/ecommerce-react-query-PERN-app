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
pool.on('connect', async (client) => {
  try {
    const response = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        firstname VARCHAR(60) NOT NULL,
        lastname VARCHAR(60),
        email VARCHAR(150) NOT NULL,
        is_premium BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        product_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR(120) NOT NULL,
        price NUMERIC DEFAULT 1, 
        description TEXT,
        image TEXT,
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT description_length_check CHECK (LENGTH(description) >= 10)
      );
    `);
    console.log('Tables created or verified successfully, response: ', response);
  } catch (err) {
    console.error('Error during database tables creation', err);
    process.exit();
  }
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
