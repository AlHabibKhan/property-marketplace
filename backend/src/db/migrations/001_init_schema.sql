-- MASTER CONTACTS (reusable across all future projects)
CREATE TABLE master_contacts (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150),
  phone VARCHAR(20) UNIQUE NOT NULL,
  whatsapp_opted_in BOOLEAN DEFAULT true,
  role VARCHAR(20),
  city VARCHAR(100),
  source_project VARCHAR(100),
  tags TEXT[],
  first_captured_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_master_contacts_role ON master_contacts(role);
CREATE INDEX idx_master_contacts_city ON master_contacts(city);

-- SELLERS
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  master_contact_id INT REFERENCES master_contacts(id),
  name VARCHAR(150),
  phone VARCHAR(20) NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LOCATION TAXONOMY
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE societies (
  id SERIAL PRIMARY KEY,
  city_id INT REFERENCES cities(id),
  name VARCHAR(150) NOT NULL,
  has_phases BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0
);

CREATE TABLE society_phases (
  id SERIAL PRIMARY KEY,
  society_id INT REFERENCES societies(id),
  phase_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  display_order INT DEFAULT 0
);
CREATE INDEX idx_phases_society ON society_phases(society_id);

-- PROPERTIES
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  property_code VARCHAR(20) UNIQUE NOT NULL,
  slug VARCHAR(250) UNIQUE,
  seller_id INT REFERENCES sellers(id),
  title VARCHAR(200),
  description TEXT,
  property_type VARCHAR(50),
  size VARCHAR(50),
  price NUMERIC(15,2),
  city_id INT REFERENCES cities(id),
  society_id INT REFERENCES societies(id),
  phase_id INT REFERENCES society_phases(id),
  block_or_street VARCHAR(100),
  images TEXT[],
  video_url VARCHAR(300),
  status VARCHAR(20) DEFAULT 'pending_review',  -- pending_review/active/sold/inactive/flagged
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_properties_city ON properties(city_id);
CREATE INDEX idx_properties_society ON properties(society_id);
CREATE INDEX idx_properties_phase ON properties(phase_id);
CREATE INDEX idx_properties_status ON properties(status);

-- BUYERS
CREATE TABLE buyers (
  id SERIAL PRIMARY KEY,
  master_contact_id INT REFERENCES master_contacts(id),
  name VARCHAR(150),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW()
);

-- OFFERS / ENQUIRIES
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id),
  property_code VARCHAR(20),
  buyer_id INT REFERENCES buyers(id),
  offer_price NUMERIC(15,2),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_offers_status ON offers(status);

-- BUYER REQUIREMENTS (reverse listings, plus-point feature)
CREATE TABLE buyer_requirements (
  id SERIAL PRIMARY KEY,
  buyer_id INT REFERENCES buyers(id),
  city_id INT REFERENCES cities(id),
  society_id INT REFERENCES societies(id),
  budget_max NUMERIC(15,2),
  property_type VARCHAR(50),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- REPORTED/FLAGGED LISTINGS (trust & safety plus-point)
CREATE TABLE listing_reports (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id),
  reason TEXT,
  reporter_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Uniqueness at the DB level so upsert logic stays consistent
ALTER TABLE sellers ADD CONSTRAINT sellers_phone_unique UNIQUE (phone);
ALTER TABLE buyers ADD CONSTRAINT buyers_phone_unique UNIQUE (phone);
