import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().toLowerCase(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  contact: z.string().optional(),
});
