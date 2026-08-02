const { z } = require('zod');

const createInquirySchema = z.object({
  listingId: z.coerce.number().int().positive('listingId must be a valid id'),
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000),
});

const updateInquiryStatusSchema = z.object({
  status: z.enum(['pending', 'responded', 'closed'], {
    message: 'status must be one of: pending, responded, closed',
  }),
});

module.exports = { createInquirySchema, updateInquiryStatusSchema };