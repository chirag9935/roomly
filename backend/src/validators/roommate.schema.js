const { z } = require('zod');

const setPreferencesSchema = z.object({
  budgetMin: z.coerce.number().nonnegative('budgetMin cannot be negative'),
  budgetMax: z.coerce.number().positive('budgetMax must be greater than 0'),
  preferredCity: z.string().trim().min(1).max(100),
  sleepSchedule: z.enum(['early_bird', 'night_owl', 'flexible']),
  foodHabit: z.enum(['veg', 'non_veg', 'vegan', 'no_preference']).optional(),
  cleanlinessLevel: z.enum(['low', 'medium', 'high']).optional(),
  bio: z.string().trim().max(1000).optional().or(z.literal('')),
}).refine((data) => data.budgetMin <= data.budgetMax, {
  message: 'budgetMin cannot be greater than budgetMax',
  path: ['budgetMin'],
});

module.exports = { setPreferencesSchema };