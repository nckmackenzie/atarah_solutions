import { CircleDollarSign } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import ExpensesDatatable from '@/features/transactions/components/expenses/expenses-datatable';

import { useDocumentTitle } from '@/hooks/use-title';
import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchExpenses } from '@/features/transactions/api/expense';

export default function ExpensesIndex() {
  useDocumentTitle('Expenses');
  const { data, error, isLoading } = usePageFetch('expenses', fetchExpenses);
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <CreateNewButton href="/transactions/expenses/new">
          <CircleDollarSign className="icon" />
          <span>Create New Expense</span>
        </CreateNewButton>
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          searchPlaceholder="Search by payee, reference"
          title="Expenses"
        >
          {isLoading ? (
            <TableSkeleton
              rowCount={10}
              columnWidths={['w-4', 'w-24', 'w-8', 'w-36', 'w-24', 'w-1']}
            />
          ) : (
            <ExpensesDatatable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
