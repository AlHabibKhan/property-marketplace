import pool from '../db/connection.js';

async function upsertCity(name) {
  const result = await pool.query(
    `INSERT INTO cities (name, slug)
     VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET slug = COALESCE(cities.slug, EXCLUDED.slug)
     RETURNING id`,
    [name, name.toLowerCase().trim().replace(/\s+/g, '-')]
  );
  return result.rows[0].id;
}

async function upsertSociety(cityId, name) {
  const slug = await slugForSociety(cityId, name);
  const result = await pool.query(
    `INSERT INTO societies (city_id, name, has_phases, display_order, slug)
     VALUES ($1, $2, true, 999, $3)
     ON CONFLICT (city_id, name) DO UPDATE
       SET has_phases = true,
           slug = EXCLUDED.slug
     RETURNING id`,
    [cityId, name, slug]
  );
  return result.rows[0].id;
}

async function slugForSociety(cityId, name) {
  const city = await pool.query(`SELECT slug FROM cities WHERE id = $1`, [cityId]);
  const citySlug = city.rows[0]?.slug || 'city';
  return `${citySlug}-${name.toLowerCase().trim().replace(/\s+/g, '-')}`;
}

async function upsertPhase(societyId, name) {
  const result = await pool.query(
    `INSERT INTO society_phases (society_id, phase_name, status, display_order)
     VALUES ($1, $2, 'active', 999)
     ON CONFLICT (society_id, phase_name) DO NOTHING
     RETURNING id`,
    [societyId, name]
  );
  if (result.rows[0]) return result.rows[0].id;
  const existing = await pool.query(
    `SELECT id FROM society_phases WHERE society_id = $1 AND phase_name = $2`,
    [societyId, name]
  );
  return existing.rows[0].id;
}

// Resolves optional id-or-free-text location into database ids, creating rows as needed.
export async function resolveLocation({ city_id, city_name, society_id, society_name, phase_id, phase_name }) {
  let resolvedCityId = city_id ? Number(city_id) : null;
  if (resolvedCityId && city_name) {
    resolvedCityId = null;
  }
  if (city_name && !resolvedCityId) {
    resolvedCityId = await upsertCity(city_name.trim());
  }

  let resolvedSocietyId = society_id ? Number(society_id) : null;
  if (resolvedSocietyId && society_name) {
    resolvedSocietyId = null;
  }
  if (society_name && !resolvedSocietyId) {
    if (!resolvedCityId) {
      throw new Error('society_name requires a city (city_id or city_name)');
    }
    resolvedSocietyId = await upsertSociety(resolvedCityId, society_name.trim());
  }

  let resolvedPhaseId = phase_id ? Number(phase_id) : null;
  if (resolvedPhaseId && phase_name) {
    resolvedPhaseId = null;
  }
  if (phase_name && !resolvedPhaseId) {
    if (!resolvedSocietyId) {
      throw new Error('phase_name requires a society (society_id or society_name)');
    }
    resolvedPhaseId = await upsertPhase(resolvedSocietyId, phase_name.trim());
  }

  return { city_id: resolvedCityId, society_id: resolvedSocietyId, phase_id: resolvedPhaseId };
}