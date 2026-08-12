-- ADD SLUGS to cities and societies for SEO landing pages (/karachi/dha-karachi)
ALTER TABLE cities ADD COLUMN IF NOT EXISTS slug VARCHAR(120);
ALTER TABLE societies ADD COLUMN IF NOT EXISTS slug VARCHAR(160);

UPDATE cities SET slug = lower(regexp_replace(trim(name), '[\s]+', '-', 'g')) WHERE slug IS NULL;
UPDATE societies SET slug = lower(regexp_replace(trim(name), '[\s]+', '-', 'g')) WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_societies_slug ON societies(slug);