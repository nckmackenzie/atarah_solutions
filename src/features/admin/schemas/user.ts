import { z } from 'zod';

export const userFormSchema = z.object({
  contact: z.string().optional(),
  userName: z.string({ required_error: 'Provide name for user' }),
});
