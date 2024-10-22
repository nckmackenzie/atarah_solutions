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
        value: account.id.toString(),
      })) || [];

  const accounts =
    data
      ?.filter(dt => dt.parentId)
      .map(account => ({
        label: account.accountName.toUpperCase(),
        value: account.id.toString(),
        parentId: account.parentId,
      })) || [];

  const expenseId = data?.find(dt => dt.accountName === 'expense')?.id || '';
  const expenseAccounts =
    data
      ?.filter(dt => dt.accountTypeId === expenseId)
      .map(exp => ({
        value: exp.id.toString(),
        label: exp.accountName.toUpperCase(),
      })) || [];

  return {
    accountTypes,
    accountsError,
    isLoadingAccounts,
    accounts,
    expenseAccounts,
  };
}
