CREATE TABLE roommate_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_city VARCHAR(100),
  sleep_schedule VARCHAR(20),   -- 'early_bird' | 'night_owl' | 'flexible'
  food_habit VARCHAR(20),       -- 'veg' | 'non_veg' | 'no_preference'
  cleanliness_level VARCHAR(20),-- 'very_tidy' | 'moderate' | 'relaxed'
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);