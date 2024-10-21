import { lazy } from 'react';

export const OutstandingInvoicesPage = lazy(
  () => import('@/features/reports/pages/outstanding-invoices')
);

export const CollectedPaymentsPage = lazy(
  () => import('@/features/reports/pages/collected-payments')
);

export const ExpensesReportPage = lazy(
  () => import('@/features/reports/pages/expenses-report')
);

export const ClientStatementPage = lazy(
  () => import('@/features/reports/pages/client-statement')
);
