import express from 'express';
import pool from '../db/connection.js';
const router = express.Router();

router.get('/cities', async (req, res) => {
  const result = await pool.query(`SELECT id, name FROM cities ORDER BY name`);
  res.json(result.rows);
});

router.get('/societies', async (req, res) => {
  const { city_id } = req.query;
  const result = await pool.query(
    `SELECT id, name, has_phases FROM societies WHERE city_id = $1 ORDER BY display_order, name`,
    [city_id]
  );
  res.json(result.rows);
});

router.get('/phases', async (req, res) => {
  const { society_id } = req.query;
  const result = await pool.query(
    `SELECT id, phase_name, status FROM society_phases WHERE society_id = $1 ORDER BY display_order, phase_name`,
    [society_id]
  );
  res.json(result.rows);
});

export default router;