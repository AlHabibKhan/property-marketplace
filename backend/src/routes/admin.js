import express from 'express';
import pool from '../db/connection.js';
import { adminAuth } from '../middleware/adminAuth.js';
const router = express.Router();
router.use(adminAuth);

// Full offer view — seller + buyer contact side by side, with Property ID
router.get('/offers', async (req, res) => {
  const result = await pool.query(`
    SELECT o.id, o.property_code, o.offer_price, o.message, o.status, o.created_at,
           b.name AS buyer_name, b.phone AS buyer_phone,
           s.name AS seller_name, s.phone AS seller_phone,
           p.title AS property_title
    FROM offers o
    JOIN buyers b ON o.buyer_id = b.id
    JOIN properties p ON o.property_id = p.id
    JOIN sellers s ON p.seller_id = s.id
    ORDER BY o.created_at DESC
  `);
  res.json(result.rows);
});

router.patch('/offers/:id', async (req, res) => {
  const { status, admin_notes } = req.body;
  await pool.query(
    `UPDATE offers SET status = $1, admin_notes = $2 WHERE id = $3`,
    [status, admin_notes, req.params.id]
  );
  res.json({ success: true });
});

// Listings needing approval
router.get('/properties/pending', async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, s.name AS seller_name, s.phone AS seller_phone
     FROM properties p JOIN sellers s ON p.seller_id = s.id
     WHERE p.status = 'pending_review' ORDER BY p.created_at DESC`
  );
  res.json(result.rows);
});

router.patch('/properties/:id/approve', async (req, res) => {
  await pool.query(`UPDATE properties SET status = 'active', is_verified = true WHERE id = $1`, [req.params.id]);
  res.json({ success: true });
});

// Export master contacts as CSV-ready JSON
router.get('/contacts', async (req, res) => {
  const { role, city } = req.query;
  let query = `SELECT full_name, phone, role, city, tags, source_project, last_active_at FROM master_contacts WHERE 1=1`;
  const params = [];
  if (role) { params.push(role); query += ` AND role = $${params.length}`; }
  if (city) { params.push(city); query += ` AND city = $${params.length}`; }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

export default router;