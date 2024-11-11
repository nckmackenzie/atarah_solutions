import { z } from 'zod';
import {
  invoiceFormSchema,
  invoicePaymentFormSchema,
} from '@/features/transactions/schema/invoice';
import {
  fetchInvoices,
  fetchInvoice,
  fetchInvoicePayments,
  fetchInvoicePayment,
  fetchInvoiceWithDetails,
} from '@/features/transactions/api/invoice';
import { Database } from '@/lib/supabase/database.types';

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type VatType = InvoiceFormValues['vatType'];
export type InvoiceRow = Awaited<ReturnType<typeof fetchInvoices>>[number];
export type Invoice = Awaited<ReturnType<typeof fetchInvoice>>;
export type InvoicePaymentFormValues = z.infer<typeof invoicePaymentFormSchema>;
export type PaymentType = Database['public']['Enums']['invoice_payment_type'];
export type InvoicePaymentRow = Awaited<
  ReturnType<typeof fetchInvoicePayments>
>[number];

export type InvoicePayment = Awaited<ReturnType<typeof fetchInvoicePayment>>;

export type SingleInvoicePrintDetails = Awaited<
  ReturnType<typeof fetchInvoiceWithDetails>
>;
