import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export function useFetchSingle<T>(
  queryKey: string,
  queryFn: (queryString: string) => Promise<T>,
  refetchInterval?: number
) {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => {
      if (!id) throw new Error('id not found');
      return queryFn(id);
    },
    enabled: !!id,
    refetchInterval: refetchInterval ? refetchInterval : false,
  });

  return { isLoading, error, data };
}
