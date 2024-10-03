import { lazy } from 'react';

export const CustomerIndexPage = lazy(
  () => import('@/features/admin/pages/customers')
);

export const CreateEditCustomerPage = lazy(
  () => import('@/features/admin/pages/customers/create-edit')
);
