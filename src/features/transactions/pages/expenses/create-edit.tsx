import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';
import ExpenseForm from '@/features/transactions/components/expenses/expense-form';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchExpense } from '@/features/transactions/api/expense';
import type { IsEdit } from '@/types/index.types';

export default function CreateEditExpense({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit Expense' : 'Create new Expense');
  const { data, error, isLoading } = useFetchSingle('expense', fetchExpense);

  if (isLoading) return <PageLoader loaderText="Fetching expense details" />;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit Expense' : 'Create new Expense'}
          hasSearch={false}
        >
          <ExpenseForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
