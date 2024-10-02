import { lazy } from 'react';

export const CustomerIndexPage = lazy(
  () => import('@/features/admin/pages/customers')
);
