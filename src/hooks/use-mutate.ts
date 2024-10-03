import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

interface UseMutateOptions {
  queryKey?: string;
  redirectPath?: string;
}

export function useMutate<T>(
  createFn: (values: T) => Promise<void>,
  updateFn?: (id: string, values: T) => Promise<void>,
  options?: UseMutateOptions
) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { isPending, mutate } = useMutation({
    mutationFn: (values: T) => {
      if (!isEdit) {
        return createFn(values);
      } else {
        if (updateFn) {
          if (!id) throw new Error('Member id not found');
          return updateFn(id, values);
        }
        return Promise.resolve();
      }
    },
    onSuccess: () => {
      if (options) {
        const { queryKey, redirectPath } = options;
        if (queryKey) {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        }

        if (redirectPath) {
          navigate(redirectPath);
        }
      }
    },
  });

  return { isPending, mutate };
}
