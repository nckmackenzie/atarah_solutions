import { z } from 'zod';

export const expenseFormSchema = z
  .object({
    expenseDate: z.coerce.date({
      required_error: 'Select expense date',
      invalid_type_error: 'Expense date must be a date',
    }),
    payee: z
      .string({ required_error: 'Payee is required' })
      .trim()
      .min(1, 'Payee is required')
      .toLowerCase(),
    paymentMethod: z.enum(['cash', 'mpesa', 'cheque', 'bank'], {
      required_error: 'Payment method is required',
      invalid_type_error: 'Invalid payment method selected.',
    }),
    paymentReference: z.string().trim().optional(),
    details: z.array(
      z.object({
        id: z.string(),
        accountId: z
          .string({ required_error: 'Account is required' })
          .trim()
          .min(1, 'Account is required'),
        amount: z.coerce
          .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
          })
          .min(1, 'Amount must be greater than 0'),
        narration: z.string().trim().optional(),
      })
    ),
  })
  .superRefine(({ paymentReference, paymentMethod }, ctx) => {
    if (paymentMethod === 'mpesa' && !paymentReference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter Mpesa reference',
        path: ['paymentReference'],
      });
    }
    if (paymentMethod === 'cheque' && !paymentReference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter cheque no...',
        path: ['paymentReference'],
      });
    }
    if (paymentMethod === 'bank' && !paymentReference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter payment details',
        path: ['paymentReference'],
      });
    }
  });
