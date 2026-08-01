const pool = require('../config/db');

async function createListing(data) {
  const {
    ownerId, title, description, city, area, rent,
    occupancyType, genderPreference, amenities, photoUrls, houseRules
  } = data;

  const result = await pool.query(
    `INSERT INTO listings
      (owner_id, title, description, city, area, rent, occupancy_type,
       gender_preference, amenities, photo_urls, house_rules)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [ownerId, title, description, city, area, rent, occupancyType,
     genderPreference || 'any', amenities || [], photoUrls || [], houseRules]
  );
  return result.rows[0];
}

async function getListingById(id) {
  const result = await pool.query(`SELECT * FROM listings WHERE id = $1`, [id]);
  return result.rows[0];
}

async function getListingsByOwner(ownerId) {
  const result = await pool.query(
    `SELECT * FROM listings WHERE owner_id = $1 ORDER BY created_at DESC`,
    [ownerId]
  );
  return result.rows;
}

async function searchListings(filters) {
  const { city, minRent, maxRent, genderPreference, occupancyType } = filters;
  const conditions = ['status = $1'];
  const values = ['active'];
  let idx = 2;

  if (city) {
    conditions.push(`city ILIKE $${idx}`);
    values.push(city);
    idx++;
  }
  if (minRent) {
    conditions.push(`rent >= $${idx}`);
    values.push(minRent);
    idx++;
  }
  if (maxRent) {
    conditions.push(`rent <= $${idx}`);
    values.push(maxRent);
    idx++;
  }
  if (genderPreference) {
    conditions.push(`(gender_preference = $${idx} OR gender_preference = 'any')`);
    values.push(genderPreference);
    idx++;
  }
  if (occupancyType) {
    conditions.push(`occupancy_type = $${idx}`);
    values.push(occupancyType);
    idx++;
  }

  const query = `SELECT * FROM listings WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
  const result = await pool.query(query, values);
  return result.rows;
}

async function updateListing(id, ownerId, fields) {
  const allowed = ['title', 'description', 'city', 'area', 'rent', 'occupancy_type',
                    'gender_preference', 'amenities', 'photo_urls', 'house_rules', 'status'];
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (allowed.includes(key)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (setClauses.length === 0) return null;

  setClauses.push(`updated_at = NOW()`);
  values.push(id, ownerId);

  const query = `UPDATE listings SET ${setClauses.join(', ')}
                 WHERE id = $${idx} AND owner_id = $${idx + 1}
                 RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0]; // undefined if no match (wrong id or not the owner)
}

async function deleteListing(id, ownerId) {
  const result = await pool.query(
    `DELETE FROM listings WHERE id = $1 AND owner_id = $2 RETURNING id`,
    [id, ownerId]
  );
  return result.rows[0];
}

module.exports = {
  createListing, getListingById, getListingsByOwner,
  searchListings, updateListing, deleteListing
};