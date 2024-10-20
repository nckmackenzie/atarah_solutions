import { z } from 'zod';

export const glAccountSchema = z
  .object({
    name: z.string().trim().min(1, 'G/L Name is required'),
    accountTypeId: z.coerce
      .number({ required_error: 'Account type is required' })
      .min(1, 'Account type is required'),
    active: z.boolean().default(true),
    isSubcategory: z.boolean().default(false),
    parentId: z.coerce.number().optional(),
  })
  .superRefine(({ isSubcategory, parentId }, ctx) => {
    if (isSubcategory && !parentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Parent id is required',
        path: ['parentId'],
      });
    }
  });
