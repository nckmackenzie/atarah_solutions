import { z } from 'zod';

export const invoiceFormSchema = z
  .object({
    invoiceNo: z
      .string({ required_error: 'Invoice number is required' })
      .trim()
      .min(1, 'Invoice number is required'),
    invoiceDate: z.coerce.date({
      required_error: 'Invoice date is required',
      invalid_type_error: 'Invoice date must be a date',
    }),
    dueDate: z.coerce.date({
      required_error: 'Due date is required',
      invalid_type_error: 'Due date must be a date',
    }),
    clientId: z.string({ required_error: 'Client is required' }),
    terms: z.coerce.number({ required_error: 'Terms is required' }),
    vatType: z.enum(['no_vat', 'inclusive', 'exclusive'], {
      required_error: 'Vat type is required',
    }),
    vat: z.coerce.number().optional(),
    userId: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        serviceId: z.string({ required_error: 'Service is required' }),
        qty: z.coerce.number({
          required_error: 'Quantity is required',
          invalid_type_error: 'Quantity must be a number',
        }),
        rate: z.coerce.number({
          required_error: 'Rate is required',
          invalid_type_error: 'Rate must be a number',
        }),
        accountId: z.coerce.number(),
      })
    ),
  })
  .superRefine(({ vatType, vat, dueDate, invoiceDate }, ctx) => {
    if (vatType !== 'no_vat' && !vat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vat is required',
        path: ['vat'],
      });
    }
    if (dueDate < invoiceDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Due date must be greater than invoice date',
        path: ['dueDate'],
      });
    }
  });

export const invoicePaymentFormSchema = z.object({
  clientId: z.string({ required_error: 'Client is required' }),
  paymentDate: z.coerce.date({
    required_error: 'Payment date is required',
    invalid_type_error: 'Payment date must be a date',
  }),
  paymentMethod: z.enum(['cash', 'mpesa', 'cheque', 'bank'], {
    required_error: 'Payment method is required',
    invalid_type_error: 'Invalid payment method selected.',
  }),
  paymentReference: z
    .string({
      required_error: 'Payment reference is required',
    })
    .min(1, 'Payment reference is required'),
  invoices: z.array(
    z.object({
      invoiceId: z.string({ required_error: 'Invoice is required' }),
      invoiceNo: z.string({ required_error: 'Invoice is required' }),
      invoiceAmount: z.coerce.number(),
      dueDate: z.coerce.date(),
      balance: z.coerce.number(),
      amountPaid: z.coerce.number(),
    })
  ),
});
