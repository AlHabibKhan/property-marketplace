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

// PUBLIC: SEO landing — resolve city + society by slug
router.get('/by-slug/:citySlug/:societySlug', async (req, res) => {
  const { citySlug, societySlug } = req.params;
  const result = await pool.query(
    `SELECT c.id AS city_id, c.name AS city_name, c.slug AS city_slug,
            s.id AS society_id, s.name AS society_name, s.slug AS society_slug, s.has_phases
     FROM societies s
     JOIN cities c ON s.city_id = c.id
     WHERE c.slug = $1 AND s.slug = $2`,
    [citySlug, societySlug]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
  res.json(result.rows[0]);
});

export default router;