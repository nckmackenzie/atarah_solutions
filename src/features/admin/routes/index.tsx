import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import {
  CustomerIndexPage,
  CreateEditCustomerPage,
  UsersIndexPage,
  ServicesIndexPage,
  CreateEditServicePage,
} from '@/features/admin/routes/utils';

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UsersIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'customers',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CustomerIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'customers/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditCustomerPage />
          </Suspense>
        ),
      },
      {
        path: 'customers/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditCustomerPage isEdit />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ServicesIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'services/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditServicePage />
          </Suspense>
        ),
      },
      {
        path: 'services/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditServicePage isEdit />
          </Suspense>
        ),
      },
    ],
  },
];
