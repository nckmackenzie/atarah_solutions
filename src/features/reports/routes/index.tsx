import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import {
  ClientStatementPage,
  CollectedPaymentsPage,
  ExpensesDetailedPage,
  ExpensesReportPage,
  IncomeStatementPage,
  OutstandingInvoicesPage,
  RevenueDetailedPage,
} from '@/features/reports/routes/utils';
import { PageLoader } from '@/components/ui/loaders';
import { revenueDetailedPageLoader } from '@/features/reports/pages/revenue-detailed';
import { expensesDetailedPageLoader } from '@/features/reports/pages/expense-detailed';

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
      {
        path: 'income-statement',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <IncomeStatementPage />
              </Suspense>
            ),
          },
          {
            path: 'revenue-detailed',
            element: (
              <Suspense fallback={<PageLoader />}>
                <RevenueDetailedPage />
              </Suspense>
            ),
            loader: revenueDetailedPageLoader,
          },
          {
            path: 'expense-detailed',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ExpensesDetailedPage />
              </Suspense>
            ),
            loader: expensesDetailedPageLoader,
          },
        ],
        // element: (
        //   <Suspense fallback={<PageLoader />}>
        //     <IncomeStatementPage />
        //   </Suspense>
        // ),
      },
    ],
  },
];
