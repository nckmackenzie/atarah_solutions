import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import {
  InvoicesIndexPage,
  InvoicesCreateEdit,
} from '@/features/transactions/routes/utils';

export const transanctionsRoutes: RouteObject[] = [
  {
    path: 'transactions',
    children: [
      {
        path: 'invoices',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicesIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'invoices/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicesCreateEdit />
          </Suspense>
        ),
      },
      {
        path: 'invoices/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicesCreateEdit isEdit />
          </Suspense>
        ),
      },
    ],
  },
];
