import pg from 'pg';
import dns from 'node:dns';
import dotenv from 'dotenv';
dotenv.config();

dns.setDefaultResultOrder('ipv4first');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;