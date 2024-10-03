import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

export function usePageFetch<T>(
  queryKey: string,
  queryFn: (queryString?: string) => Promise<T>
) {
  const [searchParams] = useSearchParams();

  const obj = Object.fromEntries(searchParams.entries());

  //   const queryString = searchParams.toString() ?? undefined;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [queryKey, obj],
    queryFn: () => queryFn(searchParams.get('search') ?? undefined),
    // refetchInterval: refetchInterval ? refetchInterval : false,
    // enabled: report ? !!queryString : true,
  });

  return { isLoading, error, data, refetch };
}
