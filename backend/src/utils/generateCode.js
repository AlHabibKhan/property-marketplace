import pool from '../db/connection.js';

export async function generatePropertyCode() {
  const result = await pool.query(
    `SELECT COUNT(*) FROM properties`
  );
  const nextNum = 1001 + parseInt(result.rows[0].count);
  return `PRP-${nextNum}`;
}