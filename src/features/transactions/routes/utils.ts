import { lazy } from 'react';

export const InvoicesIndexPage = lazy(
  () => import('@/features/transactions/pages/invoices')
);

export const InvoicesCreateEdit = lazy(
  () => import('@/features/transactions/pages/invoices/create-edit')
);

export const InvoicePaymentsIndex = lazy(
  () => import('@/features/transactions/pages/invoice-payments')
);

export const InvoicePaymentsCreateEdit = lazy(
  () => import('@/features/transactions/pages/invoice-payments/create-edit')
);
