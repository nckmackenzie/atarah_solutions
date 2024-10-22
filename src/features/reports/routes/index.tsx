import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import {
  ClientStatementPage,
  CollectedPaymentsPage,
  ExpensesReportPage,
  OutstandingInvoicesPage,
} from '@/features/reports/routes/utils';
import { PageLoader } from '@/components/ui/loaders';

export const reportRoutes: RouteObject[] = [
  {
    path: 'reports',
    children: [
      {
        path: 'outstanding-invoices',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OutstandingInvoicesPage />
          </Suspense>
        ),
      },
      {
        path: 'collected-payments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectedPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'client-statement',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClientStatementPage />
          </Suspense>
        ),
      },
      {
        path: 'expenses-report',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExpensesReportPage />
          </Suspense>
        ),
      },
    ],
  },
];
