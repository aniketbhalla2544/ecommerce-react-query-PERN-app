import { ClientConfig, Pool, PoolClient, QueryConfig } from 'pg';
import { types } from 'pg';
import { isProductionEnv } from './utils/helpers';

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

async function createDbTables(client: PoolClient) {
  console.log('creating tables');
  await client.query(`
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
  console.log('tables created');
}

// creating 20 products
async function initializeProductsTableInDevEnv(client: PoolClient) {
  await client.query(`
    DO $$
    DECLARE
      i INT;
    BEGIN
      FOR i IN 1..20 LOOP
      INSERT INTO products (user_id, title, price, description, image, created_at, updated_at)
      VALUES (
        1,
        'Product ' || LPAD(i::TEXT, 3, '0'),
        FLOOR(100 * (RANDOM() * 99 + 1)) / 100,
        LEFT(MD5(RANDOM()::text), 15 + (i % 6)), 
        NULL,
        CURRENT_TIMESTAMP + (i * INTERVAL '1 second'),
        CURRENT_TIMESTAMP + (i * INTERVAL '1 second')
      );
      END LOOP;
    END $$;
`);
}

async function initializeProductsUsersTableInDevEnv(client: PoolClient) {
  if (isProductionEnv) return;
  console.log('initialzing users and products table..');
  const { rowCount } = await client.query(`
      SELECT user_id FROM users;
    `);
  if (!rowCount) {
    await client.query(`
        INSERT INTO users (user_id, firstname, lastname, email)
        VALUES (1, 'aniket', 'bhalla', 'ab@gmail.com');
      `);
    await initializeProductsTableInDevEnv(client);
    console.log('initialzed users and products table');
  }
}

// # events
pool.on('connect', async (client) => {
  try {
    await createDbTables(client);
    await initializeProductsUsersTableInDevEnv(client);
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

export const USER_ID = 1;
