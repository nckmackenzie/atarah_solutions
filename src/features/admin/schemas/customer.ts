import { z } from 'zod';

export const customerFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').toLowerCase(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase(),
    contact: z.string().min(1, 'Contact is required'),
    address: z.string().optional(),
    taxPin: z.string().max(11, 'Invalid pin number'),
    openingBalance: z.coerce.number().optional().default(0),
    openingBalanceDate: z.coerce.date().optional(),
    active: z.boolean().default(true),
  })
  .superRefine(({ openingBalance, openingBalanceDate }, ctx) => {
    if (openingBalance > 0 && !openingBalanceDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Opening balance date is required',
        path: ['openingBalanceDate'],
      });
    }
  });
