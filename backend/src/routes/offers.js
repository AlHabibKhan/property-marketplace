import express from 'express';
import pool from '../db/connection.js';
import { upsertMasterContact, upsertBuyer } from '../utils/upsertContact.js';
const router = express.Router();

// BUYER: submit an offer/enquiry — contact goes into DB only, never shown to seller
router.post('/:propertyCode', async (req, res) => {
  const { buyer_name, buyer_phone, buyer_email, offer_price, message } = req.body;
  const { propertyCode } = req.params;

  if (!buyer_phone || typeof buyer_phone !== 'string') {
    return res.status(400).json({ error: 'buyer_phone is required' });
  }

  const property = await pool.query(
    `SELECT id, city_id FROM properties WHERE property_code = $1`, [propertyCode]
  );
  if (property.rows.length === 0) return res.status(404).json({ error: 'Property not found' });

  const masterContactId = await upsertMasterContact({
    name: buyer_name, phone: buyer_phone, role: 'buyer', city: property.rows[0].city_id,
    tags: ['buyer']
  });

  // Reuses existing buyer_id if this phone has enquired before —
  // same buyer can make offers on multiple properties without duplicate rows
  const buyerId = await upsertBuyer({
    name: buyer_name, phone: buyer_phone, email: buyer_email, masterContactId
  });

  await pool.query(
    `INSERT INTO offers (property_id, property_code, buyer_id, offer_price, message)
     VALUES ($1,$2,$3,$4,$5)`,
    [property.rows[0].id, propertyCode, buyerId, offer_price, message]
  );

  res.json({ success: true, message: 'Offer submitted. Our team will review and contact you.' });
});

export default router;