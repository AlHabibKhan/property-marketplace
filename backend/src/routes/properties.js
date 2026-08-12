import express from 'express';
import pool from '../db/connection.js';
import { generatePropertyCode } from '../utils/generateCode.js';
import { generateSlug } from '../utils/generateSlug.js';
import { upsertMasterContact, upsertSeller } from '../utils/upsertContact.js';
import { polishDescription } from '../utils/polishDescription.js';
const router = express.Router();

// PUBLIC: polish raw description text with Gemini before final submit
router.post('/polish-description', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
  }
  try {
    const polished = await polishDescription(text);
    res.json({ polished });
  } catch (err) {
    res.status(502).json({ error: 'AI service unavailable', detail: err.message });
  }
});

// PUBLIC: search/browse — explicit column selection, no contact fields ever
router.get('/', async (req, res) => {
  const { city_id, society_id, phase_id, property_type, min_price, max_price } = req.query;
  let query = `
    SELECT p.id, p.property_code, p.slug, p.title, p.description, p.property_type,
           p.size, p.price, p.images, p.is_featured, p.is_verified, p.view_count,
           c.name AS city_name, s.name AS society_name, ph.phase_name
    FROM properties p
    LEFT JOIN cities c ON p.city_id = c.id
    LEFT JOIN societies s ON p.society_id = s.id
    LEFT JOIN society_phases ph ON p.phase_id = ph.id
    WHERE p.status = 'active'
  `;
  const params = [];
  if (city_id) { params.push(city_id); query += ` AND p.city_id = $${params.length}`; }
  if (society_id) { params.push(society_id); query += ` AND p.society_id = $${params.length}`; }
  if (phase_id) { params.push(phase_id); query += ` AND p.phase_id = $${params.length}`; }
  if (property_type) { params.push(property_type); query += ` AND p.property_type = $${params.length}`; }
  if (min_price) { params.push(min_price); query += ` AND p.price >= $${params.length}`; }
  if (max_price) { params.push(max_price); query += ` AND p.price <= $${params.length}`; }
  query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

  const result = await pool.query(query, params);
  res.json(result.rows);
});

// PUBLIC: single listing by slug — safe fields only
router.get('/:slug', async (req, res) => {
  const result = await pool.query(
    `SELECT p.id, p.property_code, p.slug, p.title, p.description, p.property_type,
            p.size, p.price, p.images, p.video_url, p.is_verified, p.block_or_street,
            c.name AS city_name, s.name AS society_name, ph.phase_name
     FROM properties p
     LEFT JOIN cities c ON p.city_id = c.id
     LEFT JOIN societies s ON p.society_id = s.id
     LEFT JOIN society_phases ph ON p.phase_id = ph.id
     WHERE p.slug = $1 AND p.status = 'active'`,
    [req.params.slug]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  await pool.query(`UPDATE properties SET view_count = view_count + 1 WHERE slug = $1`, [req.params.slug]);
  res.json(result.rows[0]);
});

// SELLER: create new listing
router.post('/', async (req, res) => {
  const { seller_name, seller_phone, title, description, property_type, size,
          price, city_id, society_id, phase_id, block_or_street, images } = req.body;

  const masterContactId = await upsertMasterContact({
    name: seller_name, phone: seller_phone, role: 'seller', city: city_id,
    tags: ['seller', property_type].filter(Boolean)
  });

  // Reuses existing seller_id if this phone has listed before —
  // this is what makes "single user, multiple properties" work correctly
  const sellerId = await upsertSeller({
    name: seller_name, phone: seller_phone, masterContactId
  });

  const propertyCode = await generatePropertyCode();
  const slug = generateSlug(title, city_id, society_id, propertyCode);

  const result = await pool.query(
    `INSERT INTO properties (property_code, slug, seller_id, title, description,
       property_type, size, price, city_id, society_id, phase_id, block_or_street, images)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING property_code, slug`,
    [propertyCode, slug, sellerId, title, description, property_type,
     size, price, city_id, society_id, phase_id, block_or_street, images]
  );

  res.json({ success: true, property: result.rows[0] });
});

// PUBLIC: report/flag a listing — inserts into listing_reports, auto-flags at 3+
router.post('/:code/report', async (req, res) => {
  const { code } = req.params;
  const { reason, reporter_phone } = req.body;

  const property = await pool.query(
    `SELECT id, status FROM properties WHERE property_code = $1`, [code]
  );
  if (property.rows.length === 0) return res.status(404).json({ error: 'Property not found' });

  await pool.query(
    `INSERT INTO listing_reports (property_id, reason, reporter_phone) VALUES ($1,$2,$3)`,
    [property.rows[0].id, reason || null, reporter_phone || null]
  );

  const countRes = await pool.query(
    `SELECT COUNT(*) AS count FROM listing_reports WHERE property_id = $1`,
    [property.rows[0].id]
  );
  const reportCount = parseInt(countRes.rows[0].count);

  let flagged = false;
  if (reportCount >= 3 && property.rows[0].status === 'active') {
    await pool.query(
      `UPDATE properties SET status = 'flagged' WHERE id = $1`,
      [property.rows[0].id]
    );
    flagged = true;
  }

  res.json({ success: true, report_count: reportCount, flagged });
});

// SELLER: view all own listings by phone (no login system needed for MVP)
router.get('/my-listings/:phone', async (req, res) => {
  const { normalizePhone } = await import('../utils/upsertContact.js');
  const phone = normalizePhone(req.params.phone);

  const result = await pool.query(`
    SELECT p.id, p.property_code, p.slug, p.title, p.price, p.status,
           p.is_verified, p.view_count, p.created_at,
           c.name AS city_name, s.name AS society_name,
           (SELECT COUNT(*) FROM offers o WHERE o.property_id = p.id) AS offer_count
    FROM properties p
    JOIN sellers sl ON p.seller_id = sl.id
    LEFT JOIN cities c ON p.city_id = c.id
    LEFT JOIN societies s ON p.society_id = s.id
    WHERE sl.phone = $1
    ORDER BY p.created_at DESC
  `, [phone]);

  res.json(result.rows);
});

export default router;