import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .min(1, { message: 'Phone number is required.' })
    .max(10, { message: 'Invalid phone number' }),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long'),
});
