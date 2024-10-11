import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import {
  InvoicesIndexPage,
  InvoicesCreateEdit,
  InvoicePaymentsIndex,
  InvoicePaymentsCreateEdit,
  InvoicePrint,
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
      {
        path: 'invoices/print/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicePrint />
          </Suspense>
        ),
      },
      {
        path: 'invoices/payments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicePaymentsIndex />
          </Suspense>
        ),
      },
      {
        path: 'invoices/payments/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicePaymentsCreateEdit />
          </Suspense>
        ),
      },
      {
        path: 'invoices/payments/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <InvoicePaymentsCreateEdit isEdit />
          </Suspense>
        ),
      },
    ],
  },
];
