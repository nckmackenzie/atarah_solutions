import { z } from 'zod';

export const projectFormSchema = z.object({
  projectName: z
    .string({ required_error: 'Project name is required' })
    .trim()
    .min(1, 'Project name is required')
    .toLowerCase(),
  description: z.string().trim().optional(),
  active: z.boolean().default(true),
});
