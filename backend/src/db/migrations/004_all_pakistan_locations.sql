-- 004_ALL_PAKISTAN_LOCATIONS
-- Nationwide city/society/phase expansion for the location dropdowns:
--   * add all remaining DHA cities
--   * all DHA branches across Pakistan (with their phases)
--   * curated list of other major housing societies per city
-- Idempotent: safe to re-run (uses ON CONFLICT / WHERE ... IS NULL).

-- 1) MORE CITIES
INSERT INTO cities (name) VALUES
  ('Multan'),
  ('Peshawar'),
  ('Quetta'),
  ('Gujranwala'),
  ('Sialkot'),
  ('Bahawalpur'),
  ('Hyderabad'),
  ('Faisalabad')
ON CONFLICT (name) DO NOTHING;

-- 2) UNIQUE KEY HELPERS for idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_societies_city_name ON societies(city_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_phases_society_name ON society_phases(society_id, phase_name);

-- 3) NEW SOCIETIES (curated major societies + all DHA branches)
INSERT INTO societies (city_id, name, has_phases, display_order)
SELECT c.id, v.name, v.has_phases::boolean, v.display_order::int
FROM (VALUES
  -- Karachi
  ('Karachi',    'Gulshan-e-Maymar',         'false', 50),
  ('Karachi',    'Askari 10',                'false', 60),
  ('Karachi',    'Askari 11',                'false', 70),
  ('Karachi',    'Scheme 33',                'false', 80),
  ('Karachi',    'Bahria Adventure Village', 'false', 90),
  -- Lahore
  ('Lahore',     'Lake City',                'false', 50),
  ('Lahore',     'LDA City',                 'false', 60),
  ('Lahore',     'Etihad Town',              'true',  70),
  ('Lahore',     'Wapda Town',               'false', 80),
  ('Lahore',     'Johar Town',               'false', 90),
  ('Lahore',     'Model Town',               'false', 100),
  ('Lahore',     'Valencia Town',            'false', 110),
  ('Lahore',     'Lahore Smart City',        'true',  120),
  ('Lahore',     'Al-Kabir Town',            'true',  130),
  ('Lahore',     'Central Park',             'false', 140),
  -- Islamabad
  ('Islamabad',  'Capital Smart City',       'true',  50),
  ('Islamabad',  'Park View City',           'false', 60),
  ('Islamabad',  'Gulberg Greens',           'false', 70),
  ('Islamabad',  'Blue World City',          'false', 80),
  ('Islamabad',  'Top City',                 'false', 90),
  ('Islamabad',  'Eighteen',                 'false', 100),
  ('Islamabad',  'B-17 Multi Gardens',       'false', 110),
  -- Rawalpindi
  ('Rawalpindi', 'Faisal Town',              'false', 50),
  ('Rawalpindi', 'Faisal Hills',             'false', 60),
  ('Rawalpindi', 'CBR Town',                 'false', 70),
  ('Rawalpindi', 'Gulrez',                   'false', 80),
  -- Multan
  ('Multan',     'DHA Multan',               'true',  10),
  ('Multan',     'Citi Housing Multan',      'true',  20),
  ('Multan',     'Royal Orchard',            'false', 30),
  ('Multan',     'Model Town',               'false', 40),
  ('Multan',     'Wapda Town',               'false', 50),
  -- Peshawar
  ('Peshawar',   'DHA Peshawar',             'true',  10),
  ('Peshawar',   'Citi Housing Peshawar',    'true',  20),
  -- Quetta
  ('Quetta',     'DHA Quetta',               'true',  10),
  ('Quetta',     'Zuhra Abad',               'false', 20),
  -- Gujranwala
  ('Gujranwala', 'DHA Gujranwala',           'true',  10),
  ('Gujranwala', 'Citi Housing Gujranwala',  'true',  20),
  -- Sialkot
  ('Sialkot',    'DHA Sialkot',              'true',  10),
  ('Sialkot',    'Citi Housing Sialkot',     'true',  20),
  -- Bahawalpur
  ('Bahawalpur', 'DHA Bahawalpur',           'true',  10),
  ('Bahawalpur', 'Citi Housing Bahawalpur',  'true',  20),
  ('Bahawalpur', 'Model Town',               'false', 30),
  -- Hyderabad
  ('Hyderabad',  'DHA Hyderabad',            'true',  10),
  -- Faisalabad
  ('Faisalabad', 'DHA Faisalabad',           'true',  10),
  ('Faisalabad', 'Citi Housing Faisalabad',  'true',  20),
  ('Faisalabad', 'Model Town',               'false', 30),
  ('Faisalabad', 'Wapda Town',               'false', 40),
  ('Faisalabad', 'Canal Garden',             'false', 50)
) AS v(city, name, has_phases, display_order)
JOIN cities c ON c.name = v.city
ON CONFLICT (city_id, name) DO NOTHING;

-- 4) PHASES: new DHA branches + extended phases for existing DHA societies
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, v.phase, v.status, v.display_order::int
FROM (VALUES
  -- Extended phases for existing DHA societies
  ('DHA Lahore',       'Phase 10',             'active', 10),
  ('DHA Lahore',       'Phase 11',             'active', 11),
  ('DHA Lahore',       'Phase 12 EME',         'active', 12),
  ('DHA Lahore',       'Phase 13',             'active', 13),
  ('DHA Islamabad',    'Phase 3',              'active', 3),
  ('DHA Islamabad',    'Phase 4',              'active', 4),
  ('DHA Islamabad',    'Phase 5',              'active', 5),
  ('DHA Islamabad',    'Phase 6',              'active', 6),
  ('DHA Islamabad',    'DHA Valley',           'active', 7),
  ('DHA Islamabad',    'DHA Gandhara',         'active', 8),
  ('DHA Islamabad',    'River View North',     'active', 9),
  ('DHA Karachi',      'Phase 9 (E8)',         'upcoming', 10),
  -- DHA Multan
  ('DHA Multan',       'Phase 1',              'active', 1),
  ('DHA Multan',       'Phase 2',              'active', 2),
  -- DHA Peshawar
  ('DHA Peshawar',     'Phase 1',              'active', 1),
  -- DHA Quetta
  ('DHA Quetta',       'Phase 1',              'active', 1),
  -- DHA Gujranwala
  ('DHA Gujranwala',   'Phase 1',              'active', 1),
  ('DHA Gujranwala',   'Phase 2',              'active', 2),
  -- DHA Sialkot
  ('DHA Sialkot',      'Phase 1',              'active', 1),
  ('DHA Sialkot',      'Phase 2',              'active', 2),
  -- DHA Bahawalpur
  ('DHA Bahawalpur',   'Phase 1',              'active', 1),
  ('DHA Bahawalpur',   'Phase 2',              'active', 2),
  -- DHA Hyderabad
  ('DHA Hyderabad',    'Phase 1',              'active', 1),
  -- DHA Faisalabad
  ('DHA Faisalabad',   'Phase 1',              'active', 1),
  -- Citi Housing
  ('Citi Housing Multan',      'Phase 1',      'active', 1),
  ('Citi Housing Multan',      'Phase 2',      'active', 2),
  ('Citi Housing Multan',      'Phase 3',      'active', 3),
  ('Citi Housing Peshawar',    'Phase 1',      'active', 1),
  ('Citi Housing Peshawar',    'Phase 2',      'active', 2),
  ('Citi Housing Peshawar',    'Phase 3',      'active', 3),
  ('Citi Housing Gujranwala',  'Phase 1',      'active', 1),
  ('Citi Housing Gujranwala',  'Phase 2',      'active', 2),
  ('Citi Housing Sialkot',     'Phase 1',      'active', 1),
  ('Citi Housing Sialkot',     'Phase 2',      'active', 2),
  ('Citi Housing Bahawalpur',  'Phase 1',      'active', 1),
  ('Citi Housing Bahawalpur',  'Phase 2',      'active', 2),
  ('Citi Housing Faisalabad',  'Phase 1',      'active', 1),
  ('Citi Housing Faisalabad',  'Phase 2',      'active', 2),
  ('Citi Housing Faisalabad',  'Phase 3',      'active', 3),
  -- Other phased societies
  ('Etihad Town',        'Phase 1',            'active', 1),
  ('Etihad Town',        'Phase 2',            'active', 2),
  ('Etihad Town',        'Phase 3',            'active', 3),
  ('Lahore Smart City',  'Phase 1',            'active', 1),
  ('Lahore Smart City',  'Phase 2',            'active', 2),
  ('Al-Kabir Town',      'Phase 1',            'active', 1),
  ('Al-Kabir Town',      'Phase 2',            'active', 2),
  ('Al-Kabir Town',      'Phase 3',            'active', 3),
  ('Capital Smart City', 'Phase 1',            'active', 1),
  ('Capital Smart City', 'Phase 2',            'active', 2),
  ('Capital Smart City', 'Phase 3',            'active', 3)
) AS v(society, phase, status, display_order)
JOIN societies s ON s.name = v.society
ON CONFLICT (society_id, phase_name) DO NOTHING;

-- 5) BACKFILL SLUGS for any new city/society (city-prefixed to stay unique, e.g. Model Town in several cities)
UPDATE cities SET slug = lower(regexp_replace(trim(name), '[\s]+', '-', 'g')) WHERE slug IS NULL;

UPDATE societies s
SET slug = lower(regexp_replace(trim(c.name), '[\s]+', '-', 'g')) || '-' || lower(regexp_replace(trim(s.name), '[\s]+', '-', 'g'))
FROM cities c
WHERE s.city_id = c.id AND s.slug IS NULL;