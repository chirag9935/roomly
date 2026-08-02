const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address').max(150),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
  role: z.enum(['seeker', 'owner'], { message: 'role must be "seeker" or "owner"' }),
  phone: z.string().trim().max(15).optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { signupSchema, loginSchema };