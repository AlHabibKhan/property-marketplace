-- 005_ADD_LAHORE_BLOCKS
-- Add block-level options for Lahore societies organised by blocks:
--   * Central Park      (Block A-H, AA, A1, A1 Executive, BB, J)
--   * Elite Town        (new society, Block A-F)
--   * Al-Kabir Town     (replace generic Phase 1/2/3 with real phase+block names)
-- Idempotent: safe to re-run (uses ON CONFLICT / DELETE-then-insert).

-- 1) Elite Town is not in the DB yet — insert it (Lahore).
INSERT INTO societies (city_id, name, has_phases, display_order)
SELECT c.id, 'Elite Town', true, 145
FROM cities c
WHERE c.name = 'Lahore'
ON CONFLICT (city_id, name) DO NOTHING;

-- 2) Central Park has blocks now
UPDATE societies s SET has_phases = true
WHERE s.name = 'Central Park'
  AND s.city_id = (SELECT id FROM cities WHERE name = 'Lahore');

-- 3) Al-Kabir's generic "Phase 1/2/3" rows are misleading — drop them so real blocks come through
DELETE FROM society_phases
WHERE society_id = (SELECT id FROM societies WHERE name = 'Al-Kabir Town')
  AND phase_name IN ('Phase 1', 'Phase 2', 'Phase 3');

-- 4) Insert all blocks for the three Lahore societies (idempotent via unique (society_id, phase_name))
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, v.block, 'active', v.display_order
FROM (VALUES
  -- Central Park (Lahore)
  ('Central Park', 'Block A',            1),
  ('Central Park', 'Block AA',           2),
  ('Central Park', 'Block A1',           3),
  ('Central Park', 'Block A1 Executive', 4),
  ('Central Park', 'Block B',            5),
  ('Central Park', 'Block BB',           6),
  ('Central Park', 'Block C',            7),
  ('Central Park', 'Block D',            8),
  ('Central Park', 'Block E',            9),
  ('Central Park', 'Block F',            10),
  ('Central Park', 'Block G',            11),
  ('Central Park', 'Block H',            12),
  ('Central Park', 'Block J',            13),
  -- Elite Town (Lahore)
  ('Elite Town',   'Block A',            1),
  ('Elite Town',   'Block B',            2),
  ('Elite Town',   'Block C',            3),
  ('Elite Town',   'Block D',            4),
  ('Elite Town',   'Block E',            5),
  ('Elite Town',   'Block F',            6),
  -- Al-Kabir Town (Lahore) — real phase + block names
  ('Al-Kabir Town', 'Phase 1 - Block A',          1),
  ('Al-Kabir Town', 'Phase 1 - Block A Extension', 2),
  ('Al-Kabir Town', 'Phase 2 - Block A',           3),
  ('Al-Kabir Town', 'Phase 2 - Block B',           4),
  ('Al-Kabir Town', 'Phase 2 - Block C',           5),
  ('Al-Kabir Town', 'Phase 2 - Block D',           6),
  ('Al-Kabir Town', 'Phase 2 - Block E',           7),
  ('Al-Kabir Town', 'Phase 2 - Ali Block',         8),
  ('Al-Kabir Town', 'Phase 2 - Usman Block',       9),
  ('Al-Kabir Town', 'Phase 2 - Umer Block',        10),
  ('Al-Kabir Town', 'Phase 2 - Abu Bakar Block',   11),
  ('Al-Kabir Town', 'Phase 2 - Platinum Block',    12),
  ('Al-Kabir Town', 'Phase 2 - Business Bay',      13)
) AS v(society, block, display_order)
JOIN societies s ON s.name = v.society
  AND s.city_id = (SELECT id FROM cities WHERE name = 'Lahore')
ON CONFLICT (society_id, phase_name) DO NOTHING;

-- 5) Backfill slug for the new Elite Town society
UPDATE societies s
SET slug = lower(regexp_replace(trim(c.name), '[\s]+', '-', 'g')) || '-' || lower(regexp_replace(trim(s.name), '[\s]+', '-', 'g'))
FROM cities c
WHERE s.city_id = c.id AND s.name = 'Elite Town' AND s.slug IS NULL;