const pool = require('../config/db');

async function createInquiry({ listingId, seekerId, message }) {
  const result = await pool.query(
    `INSERT INTO inquiries (listing_id, seeker_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [listingId, seekerId, message]
  );
  return result.rows[0];
}

async function getInquiriesForOwner(ownerId) {
  const result = await pool.query(
    `SELECT i.*, l.title AS listing_title, u.name AS seeker_name, u.email AS seeker_email
     FROM inquiries i
     JOIN listings l ON l.id = i.listing_id
     JOIN users u ON u.id = i.seeker_id
     WHERE l.owner_id = $1
     ORDER BY i.created_at DESC`,
    [ownerId]
  );
  return result.rows;
}

async function getInquiriesBySeeker(seekerId) {
  const result = await pool.query(
    `SELECT i.*, l.title AS listing_title, l.city, l.area
     FROM inquiries i
     JOIN listings l ON l.id = i.listing_id
     WHERE i.seeker_id = $1
     ORDER BY i.created_at DESC`,
    [seekerId]
  );
  return result.rows;
}

async function updateInquiryStatus(inquiryId, ownerId, status) {
  const result = await pool.query(
    `UPDATE inquiries SET status = $1
     WHERE id = $2 AND listing_id IN (SELECT id FROM listings WHERE owner_id = $3)
     RETURNING *`,
    [status, inquiryId, ownerId]
  );
  return result.rows[0];
}

module.exports = { createInquiry, getInquiriesForOwner, getInquiriesBySeeker, updateInquiryStatus };