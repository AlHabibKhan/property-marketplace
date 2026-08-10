import pool from '../db/connection.js';

// Normalize Pakistani phone numbers to consistent format
export function normalizePhone(phone) {
  let p = phone.replace(/[\s-]/g, '');
  if (p.startsWith('0')) p = '92' + p.slice(1);
  if (!p.startsWith('92')) p = '92' + p;
  return p;
}

export async function upsertMasterContact({ name, phone, role, city, sourceProject = 'PropertyMarketplace', tags = [] }) {
  const normalizedPhone = normalizePhone(phone);
  const existing = await pool.query(
    `SELECT id, tags FROM master_contacts WHERE phone = $1`,
    [normalizedPhone]
  );

  if (existing.rows.length > 0) {
    const mergedTags = Array.from(new Set([...(existing.rows[0].tags || []), ...tags]));
    await pool.query(
      `UPDATE master_contacts SET last_active_at = NOW(), tags = $1 WHERE id = $2`,
      [mergedTags, existing.rows[0].id]
    );
    return existing.rows[0].id;
  }

  const inserted = await pool.query(
    `INSERT INTO master_contacts (full_name, phone, role, city, source_project, tags)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [name, normalizedPhone, role, city, sourceProject, tags]
  );
  return inserted.rows[0].id;
}

// Get existing seller by phone, or create new — ensures ONE seller_id
// per person even across multiple property listings
export async function upsertSeller({ name, phone, masterContactId }) {
  const normalizedPhone = normalizePhone(phone);
  const existing = await pool.query(
    `SELECT id FROM sellers WHERE phone = $1`,
    [normalizedPhone]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const inserted = await pool.query(
    `INSERT INTO sellers (master_contact_id, name, phone) VALUES ($1, $2, $3) RETURNING id`,
    [masterContactId, name, normalizedPhone]
  );
  return inserted.rows[0].id;
}

// Same pattern for buyers — one buyer_id per phone, even across
// multiple offers/enquiries on different properties
export async function upsertBuyer({ name, phone, email, masterContactId }) {
  const normalizedPhone = normalizePhone(phone);
  const existing = await pool.query(
    `SELECT id FROM buyers WHERE phone = $1`,
    [normalizedPhone]
  );
  if (existing.rows.length > 0) {
    if (email) await pool.query(`UPDATE buyers SET email = $1 WHERE id = $2`, [email, existing.rows[0].id]);
    return existing.rows[0].id;
  }
  const inserted = await pool.query(
    `INSERT INTO buyers (master_contact_id, name, phone, email) VALUES ($1,$2,$3,$4) RETURNING id`,
    [masterContactId, name, normalizedPhone, email]
  );
  return inserted.rows[0].id;
}