import { useSearchParams } from 'react-router-dom';

export function useResetParams() {
  const [, setSearchParams] = useSearchParams();

  return () => {
    setSearchParams({});
  };
}
