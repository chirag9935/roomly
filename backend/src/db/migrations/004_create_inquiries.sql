CREATE TYPE inquiry_status AS ENUM ('pending', 'responded', 'closed');

CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  seeker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);