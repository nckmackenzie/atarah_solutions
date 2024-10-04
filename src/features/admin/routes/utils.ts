import { lazy } from 'react';

export const UsersIndexPage = lazy(
  () => import('@/features/admin/pages/users')
);

export const CustomerIndexPage = lazy(
  () => import('@/features/admin/pages/customers')
);

export const CreateEditCustomerPage = lazy(
  () => import('@/features/admin/pages/customers/create-edit')
);

export const ServicesIndexPage = lazy(
  () => import('@/features/admin/pages/services')
);

export const CreateEditServicePage = lazy(
  () => import('@/features/admin/pages/services/create-edit')
);
