import express from 'express';
import pool from '../db/connection.js';
import { normalizePhone } from '../utils/upsertContact.js';
const router = express.Router();

// PUBLIC: check which role a phone is already registered as (seller, buyer, or none)
router.get('/:phone', async (req, res) => {
  let phone;
  try {
    phone = normalizePhone(req.params.phone);
  } catch {
    return res.status(400).json({ error: 'phone is required' });
  }

  const [sellers, buyers] = await Promise.all([
    pool.query(`SELECT name FROM sellers WHERE phone = $1`, [phone]),
    pool.query(`SELECT name FROM buyers WHERE phone = $1`, [phone])
  ]);

  res.json({
    phone,
    seller: sellers.rows.length > 0,
    buyer: buyers.rows.length > 0,
    seller_name: sellers.rows[0]?.name || null,
    buyer_name: buyers.rows[0]?.name || null
  });
});

export default router;