import { createBrowserRouter } from 'react-router-dom';

import ErrorPage from '@/components/ui/error-page';
import LoginPage from '@/features/auth/pages/login';
import ProtectedRoute from '@/components/ui/protected-route';
import AppLayout from '@/components/layout/app-layout';
import ContentWrapper from '@/components/layout/content-wrapper';
import { adminRoutes } from '@/features/admin/routes';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ContentWrapper>
            <div>Home</div>
          </ContentWrapper>
        ),
      },
      ...adminRoutes,
    ],
  },
]);
