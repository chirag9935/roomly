const { getListingById } = require('../models/listing.model');
const {
  createInquiry, getInquiriesForOwner, getInquiriesBySeeker, updateInquiryStatus
} = require('../models/inquiry.model');

async function create(req, res, next) {
  try {
    const { listingId, message } = req.body;

    if (!listingId || !message) {
      const err = new Error('listingId and message are required');
      err.statusCode = 400;
      throw err;
    }

    const listing = await getListingById(listingId);
    if (!listing) {
      const err = new Error('Listing not found');
      err.statusCode = 404;
      throw err;
    }

    if (listing.owner_id === req.user.id) {
      const err = new Error('You cannot inquire about your own listing');
      err.statusCode = 400;
      throw err;
    }

    const inquiry = await createInquiry({
      listingId, seekerId: req.user.id, message
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    next(err);
  }
}

async function getForOwner(req, res, next) {
  try {
    const inquiries = await getInquiriesForOwner(req.user.id);
    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    next(err);
  }
}

async function getMine(req, res, next) {
  try {
    const inquiries = await getInquiriesBySeeker(req.user.id);
    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'responded', 'closed'];

    if (!validStatuses.includes(status)) {
      const err = new Error(`status must be one of: ${validStatuses.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const updated = await updateInquiryStatus(req.params.id, req.user.id, status);
    if (!updated) {
      const err = new Error('Inquiry not found or you do not own the related listing');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ success: true, inquiry: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getForOwner, getMine, updateStatus };