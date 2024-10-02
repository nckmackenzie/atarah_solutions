import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import { CustomerIndexPage } from '@/features/admin/routes/utils';

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
    ],
  },
];
