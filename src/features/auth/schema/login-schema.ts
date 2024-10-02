import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 8 characters long'),
});
