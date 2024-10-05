import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '@/features/admin/api/service';

export function useService() {
  const {
    data,
    isLoading: isLoading,
    error,
  } = useQuery({
    queryKey: ['services'],
    queryFn: () => fetchServices(),
  });

  const services =
    data
      ?.filter(dt => dt.active)
      .map(service => ({
        label: service.serviceName.toUpperCase(),
        value: service.id,
      })) || [];

  return {
    services,
    isLoading,
    error,
  };
}
