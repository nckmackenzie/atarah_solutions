import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '@/features/admin/api/glaccounts';

export function useAccounts() {
  const {
    data,
    error: accountsError,
    isLoading: isLoadingAccounts,
  } = useQuery({
    queryKey: ['gl accounts'],
    queryFn: () => fetchAccounts(),
  });

  const accountTypes =
    data
      ?.filter(dt => dt.parentId === null)
      .map(account => ({
        label: account.accountName.toUpperCase(),
        value: account.id,
      })) || [];

  const accounts =
    data
      ?.filter(dt => dt.parentId)
      .map(account => ({
        label: account.accountName.toUpperCase(),
        value: account.id,
        parentId: account.parentId as string,
      })) || [];

  const expenseId = data?.find(dt => dt.accountName === 'expenses')?.id || '';
  const expenseAccounts = data?.filter(dt => dt.parentId === expenseId) || [];

  return {
    accountTypes,
    accountsError,
    isLoadingAccounts,
    accounts,
    expenseAccounts,
  };
}
