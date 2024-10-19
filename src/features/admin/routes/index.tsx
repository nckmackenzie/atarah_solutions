import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { PageLoader } from '@/components/ui/loaders';
import {
  CustomerIndexPage,
  CreateEditCustomerPage,
  UsersIndexPage,
  ServicesIndexPage,
  CreateEditServicePage,
  GlAccountsIndexPage,
  CreateEditGlAccountsPage,
  ProjectsIndexPage,
  ProjectCreateEditPage,
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
      {
        path: 'glaccounts',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GlAccountsIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'glaccounts/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditGlAccountsPage />
          </Suspense>
        ),
      },
      {
        path: 'glaccounts/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateEditGlAccountsPage isEdit />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectsIndexPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectCreateEditPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/edit/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProjectCreateEditPage isEdit />
          </Suspense>
        ),
      },
    ],
  },
];
