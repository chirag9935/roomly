const pool = require('../config/db');

async function upsertPreferences(userId, data) {
  const {
    budgetMin, budgetMax, preferredCity, sleepSchedule, foodHabit, cleanlinessLevel, bio
  } = data;

  const result = await pool.query(
    `INSERT INTO roommate_preferences
      (user_id, budget_min, budget_max, preferred_city, sleep_schedule, cleanliness_level, food_habit, bio)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (user_id) DO UPDATE SET
       budget_min = EXCLUDED.budget_min,
       budget_max = EXCLUDED.budget_max,
       preferred_city = EXCLUDED.preferred_city,
       sleep_schedule = EXCLUDED.sleep_schedule,
       cleanliness_level = EXCLUDED.cleanliness_level,
       food_habit = EXCLUDED.food_habit,
       bio = EXCLUDED.bio
     RETURNING *`,
    [userId, budgetMin, budgetMax, preferredCity, sleepSchedule, cleanlinessLevel, foodHabit, bio]
  );
  return result.rows[0];
}

async function getPreferencesByUser(userId) {
  const result = await pool.query(
    `SELECT * FROM roommate_preferences WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function findMatches(userId) {
  const myPrefs = await getPreferencesByUser(userId);
  if (!myPrefs) return [];

  const result = await pool.query(
    `SELECT rp.*, u.name, u.email
     FROM roommate_preferences rp
     JOIN users u ON u.id = rp.user_id
     WHERE rp.user_id != $1
       AND rp.preferred_city = $2
       AND rp.sleep_schedule = $3
       AND (rp.budget_min <= $4 AND rp.budget_max >= $5)
     ORDER BY rp.created_at DESC`,
    [userId, myPrefs.preferred_city, myPrefs.sleep_schedule, myPrefs.budget_max, myPrefs.budget_min]
  );
  return result.rows;
}

module.exports = { upsertPreferences, getPreferencesByUser, findMatches };