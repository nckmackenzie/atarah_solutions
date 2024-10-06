import { z } from 'zod';
import { invoiceFormSchema } from '@/features/transactions/schema/invoice';
import {
  fetchInvoices,
  fetchInvoice,
} from '@/features/transactions/api/invoice';

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type VatType = InvoiceFormValues['vatType'];
export type InvoiceRow = Awaited<ReturnType<typeof fetchInvoices>>[number];
export type Invoice = Awaited<ReturnType<typeof fetchInvoice>>;
