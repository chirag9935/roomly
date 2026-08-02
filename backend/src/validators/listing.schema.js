const { z } = require('zod');

const occupancyTypes = ['single', 'double', 'triple', 'dormitory'];
const listingStatuses = ['active', 'under_inquiry', 'booked', 'closed'];
const genderPreferences = ['male', 'female', 'any'];

const createListingSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().max(3000).optional().or(z.literal('')),
  city: z.string().trim().min(1).max(100),
  area: z.string().trim().min(1).max(100),
  rent: z.coerce.number().positive('Rent must be greater than 0').max(1_000_000),
  occupancyType: z.enum(occupancyTypes, { message: `occupancyType must be one of: ${occupancyTypes.join(', ')}` }),
  genderPreference: z.enum(genderPreferences).optional(),
  amenities: z.array(z.string().trim().max(50)).max(30).optional(),
  photoUrls: z.array(z.string().trim().url('Each photo must be a valid URL')).max(10).optional(),
  houseRules: z.string().trim().max(2000).optional().or(z.literal('')),
});

// Same shape as create, but every field is optional (PATCH-style update).
const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(listingStatuses, { message: `status must be one of: ${listingStatuses.join(', ')}` }).optional(),
});

const searchListingsQuerySchema = z.object({
  city: z.string().trim().max(100).optional(),
  minRent: z.coerce.number().nonnegative().optional(),
  maxRent: z.coerce.number().positive().optional(),
  genderPreference: z.enum(genderPreferences).optional(),
  occupancyType: z.enum(occupancyTypes).optional(),
});

module.exports = { createListingSchema, updateListingSchema, searchListingsQuerySchema };