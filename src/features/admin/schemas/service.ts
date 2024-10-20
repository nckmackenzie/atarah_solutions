import { z } from 'zod';

export const serviceFormSchema = z
  .object({
    serviceName: z
      .string()
      .trim()
      .min(2, 'Service name is required')
      .toLowerCase(),
    serviceRate: z.coerce
      .number({
        required_error: 'Service rate is required',
        invalid_type_error: 'Service rate must be a number',
      })
      .min(1, 'Service rate must be greater than 0')
      .positive('Service rate must be greater than 0'),
    description: z.string().trim().optional(),
    active: z.boolean().default(true),
    accountId: z.string({required_error: 'G/L account is required'}).trim().min(1, 'G/L account is required'),
  })
  .strict();
