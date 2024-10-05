import { lazy } from 'react';

export const InvoicesIndexPage = lazy(
  () => import('@/features/transactions/pages/invoices')
);

export const InvoicesCreateEdit = lazy(
  () => import('@/features/transactions/pages/invoices/create-edit')
);
