-- SEED LOCATIONS: cities, societies, and DHA/Bahria phases

INSERT INTO cities (name) VALUES
  ('Karachi'),
  ('Lahore'),
  ('Islamabad'),
  ('Rawalpindi');

-- SOCIETIES
INSERT INTO societies (city_id, name, has_phases, display_order) VALUES
  ((SELECT id FROM cities WHERE name = 'Karachi'),    'DHA Karachi',            true, 10),
  ((SELECT id FROM cities WHERE name = 'Karachi'),    'DHA City Karachi',       true, 20),
  ((SELECT id FROM cities WHERE name = 'Karachi'),    'Bahria Town Karachi',    true, 30),
  ((SELECT id FROM cities WHERE name = 'Karachi'),    'Gulshan-e-Iqbal',        false, 40),
  ((SELECT id FROM cities WHERE name = 'Lahore'),     'DHA Lahore',             true, 10),
  ((SELECT id FROM cities WHERE name = 'Lahore'),     'Bahria Town Lahore',     true, 20),
  ((SELECT id FROM cities WHERE name = 'Lahore'),     'Bahria Orchard',         true, 30),
  ((SELECT id FROM cities WHERE name = 'Lahore'),     'Gulberg III',            false, 40),
  ((SELECT id FROM cities WHERE name = 'Islamabad'),  'DHA Islamabad',          true, 10),
  ((SELECT id FROM cities WHERE name = 'Islamabad'),  'Bahria Town Phase 1-9',  true, 20),
  ((SELECT id FROM cities WHERE name = 'Islamabad'),  'Bahria Enclave',         true, 30),
  ((SELECT id FROM cities WHERE name = 'Rawalpindi'), 'Bahria Town Rawalpindi', true, 10),
  ((SELECT id FROM cities WHERE name = 'Rawalpindi'), 'DHA Phase 1-2 Rawalpindi', true, 20);

-- DHA KARACHI PHASES
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4),(5),(6),(7),(8)
) AS v(p)
WHERE s.name = 'DHA Karachi';

INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase 8 Extension', 'active', 9
FROM societies s WHERE s.name = 'DHA Karachi';

-- DHA CITY KARACHI PHASES
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4)
) AS v(p)
WHERE s.name = 'DHA City Karachi';

-- BAHRIA TOWN KARACHI PRECINCTS
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Precinct ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),(21)
) AS v(p)
WHERE s.name = 'Bahria Town Karachi';

-- DHA LAHORE PHASES
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9)
) AS v(p)
WHERE s.name = 'DHA Lahore';

INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase 9 Prism', 'active', 10
FROM societies s WHERE s.name = 'DHA Lahore';

-- BAHRIA TOWN LAHORE PHASES
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11)
) AS v(p)
WHERE s.name = 'Bahria Town Lahore';

-- BAHRIA ORCHARD LAHORE
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3)
) AS v(p)
WHERE s.name = 'Bahria Orchard';

-- DHA ISLAMABAD PHASES
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2)
) AS v(p)
WHERE s.name = 'DHA Islamabad';

-- BAHRIA TOWN ISLAMABAD (PHASE 1-9)
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9)
) AS v(p)
WHERE s.name = 'Bahria Town Phase 1-9';

-- BAHRIA ENCLAVE ISLAMABAD
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Block ' || l, 'active', p
FROM societies s, LATERAL (
  VALUES ('A', 1), ('B', 2), ('C', 3), ('D', 4)
) AS v(l, p)
WHERE s.name = 'Bahria Enclave';

-- BAHRIA TOWN RAWALPINDI SECTORS
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Sector ' || l, 'active', p
FROM societies s, LATERAL (
  VALUES ('A', 1), ('B', 2), ('C', 3), ('D', 4), ('E', 5), ('F', 6), ('G', 7), ('H', 8), ('I', 9), ('J', 10)
) AS v(l, p)
WHERE s.name = 'Bahria Town Rawalpindi';

-- DHA RAWALPINDI PHASE 1-2
INSERT INTO society_phases (society_id, phase_name, status, display_order)
SELECT s.id, 'Phase ' || p, 'active', p
FROM societies s, LATERAL (
  VALUES (1),(2)
) AS v(p)
WHERE s.name = 'DHA Phase 1-2 Rawalpindi';
