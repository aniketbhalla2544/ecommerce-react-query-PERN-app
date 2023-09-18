import { Client } from 'pg';
import dbConfig from '@/config/db.config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function connect() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// async function query(query, params) {
//   const client = await connect();
//   await client.query(query, [...params]);
// }

exports.db = {
  // query,
};
