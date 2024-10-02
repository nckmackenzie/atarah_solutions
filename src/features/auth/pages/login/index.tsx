import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginForm from '@/features/auth/components/login-form';
import { useUser } from '@/features/auth/hooks/use-user';

export default function LoginPage() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate('/', { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );
  return <LoginForm />;
}
