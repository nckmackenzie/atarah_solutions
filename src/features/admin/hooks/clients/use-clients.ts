import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/features/admin/api/customer';

export function useClients() {
  const {
    data,
    isLoading: isLoadingClients,
    error: errorClients,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
  });

  const clients =
    data
      ?.filter(dt => dt.active)
      .map(client => ({
        label: client.name.toUpperCase(),
        value: client.id,
      })) || [];

  return {
    clients,
    isLoadingClients,
    errorClients,
  };
}
