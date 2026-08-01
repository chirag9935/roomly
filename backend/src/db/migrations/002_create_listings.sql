CREATE TYPE occupancy_type AS ENUM ('single', 'double', 'triple', 'dormitory');
CREATE TYPE listing_status AS ENUM ('active', 'under_inquiry', 'booked', 'closed');

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  rent INTEGER NOT NULL,
  occupancy_type occupancy_type NOT NULL,
  gender_preference VARCHAR(20) DEFAULT 'any',
  amenities TEXT[],
  photo_urls TEXT[],
  house_rules TEXT,
  status listing_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);