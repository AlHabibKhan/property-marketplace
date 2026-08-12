import express from 'express';
import pool from '../db/connection.js';
import { upsertMasterContact, upsertBuyer } from '../utils/upsertContact.js';
const router = express.Router();

// BUYER: post a requirement (reverse listing) — always goes through master_contacts
router.post('/', async (req, res) => {
  const { buyer_name, buyer_phone, buyer_email, city_id, society_id, budget_max, property_type, notes } = req.body;

  if (!buyer_phone) return res.status(400).json({ error: 'buyer_phone is required' });

  const masterContactId = await upsertMasterContact({
    name: buyer_name, phone: buyer_phone, role: 'buyer', city: city_id,
    tags: ['buyer_requirement', property_type].filter(Boolean)
  });

  const buyerId = await upsertBuyer({
    name: buyer_name, phone: buyer_phone, email: buyer_email, masterContactId
  });

  const result = await pool.query(
    `INSERT INTO buyer_requirements (buyer_id, city_id, society_id, budget_max, property_type, notes)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [buyerId, city_id || null, society_id || null, budget_max || null, property_type || null, notes || null]
  );

  res.json({ success: true, requirement_id: result.rows[0].id });
});

export default router;