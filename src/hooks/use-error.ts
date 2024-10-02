import { useState } from 'react';

export function useError() {
  const [errors, setErrors] = useState<string | string[]>();

  function onError(err: string | string[]) {
    setErrors(err);
  }

  function clearErrors() {
    setErrors(undefined);
  }

  return { errors, onError, clearErrors };
}
