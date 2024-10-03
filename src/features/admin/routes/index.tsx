import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import {
  CustomerIndexPage,
  CreateEditCustomerPage,
} from '@/features/admin/routes/utils';

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    children: [
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
    ],
  },
];
