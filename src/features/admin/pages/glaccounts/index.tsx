import { FileText } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import AccountsTable from '@/features/admin/components/glaccounts/accounts-table';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { TableSkeleton } from '@/components/ui/table-skeleton';

import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchGlAccounts } from '@/features/admin/api/glaccounts';

export default function GlAccountsIndex() {
  const { data, error, isLoading } = usePageFetch(
    'gl accounts',
    fetchGlAccounts
  );
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <CreateNewButton href="/admin/glaccounts/new">
          <FileText className="icon mr-2" />
          <span>Create new account</span>
        </CreateNewButton>
      </div>
      {error && <ErrorAlert error={error.message} />}
      <PageCard
        title="GL Accounts"
        searchPlaceholder="Search by account name"
        description="List of all created gl accounts"
      >
        {isLoading ? (
          <TableSkeleton rowCount={10} columnWidths={['w-56', 'w-8', 'w-1']} />
        ) : (
          <AccountsTable data={data || []} />
        )}
      </PageCard>
    </ContentWrapper>
  );
}
