import { createBrowserRouter } from 'react-router-dom';

import ErrorPage from '@/components/ui/error-page';
import LoginPage from '@/features/auth/pages/login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);
