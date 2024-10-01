import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || 'Unknown error';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <AlertCircle
        className="w-16 h-16 text-destructive mb-4"
        aria-hidden="true"
      />
      <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong</h1>
      <p className="text-xl mb-4">
        We're sorry, but an error occurred while processing your request.
      </p>
      <p className="text-muted-foreground mb-6">
        Error: {errorMessage || 'Unknown error'}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="default">
          Go Back
        </Button>
        <Button onClick={() => () => navigate('/')} variant="outline">
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
