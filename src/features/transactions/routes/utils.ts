import { lazy } from 'react';

export const InvoicesIndexPage = lazy(
  () => import('@/features/transactions/pages/invoices')
);

export const InvoicesCreateEdit = lazy(
  () => import('@/features/transactions/pages/invoices/create-edit')
);

export const InvoicePrint = lazy(
  () => import('@/features/transactions/pages/invoices/print')
);

export const InvoicePaymentsIndex = lazy(
  () => import('@/features/transactions/pages/invoice-payments')
);

export const InvoicePaymentsCreateEdit = lazy(
  () => import('@/features/transactions/pages/invoice-payments/create-edit')
);

export const ExpensesIndex = lazy(
  () => import('@/features/transactions/pages/expenses')
);

export const CreateEditExpense = lazy(
  () => import('@/features/transactions/pages/expenses/create-edit')
);
