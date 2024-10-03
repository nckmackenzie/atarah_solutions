import { User } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import { ErrorAlert } from '@/components/ui/custom-alert';
import ClientTable from '@/features/admin/components/client-table';
import { TableSkeleton } from '@/components/ui/table-skeleton';

import { useDocumentTitle } from '@/hooks/use-title';
import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchClients } from '@/features/admin/api/customer';

export default function CustomerIndexPage() {
  useDocumentTitle('Client centre');
  const { isLoading, data, error } = usePageFetch('clients', fetchClients);

  return (
    <ContentWrapper>
      <div className="y-spacing">
        <CreateNewButton href="/admin/customers/new">
          <User className="icon" />
          <span>Create new client</span>
        </CreateNewButton>
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title="Client List"
          description="List of all created clients."
          searchPlaceholder="Search by client name or contact"
        >
          {isLoading ? (
            <TableSkeleton
              rowCount={10}
              columnWidths={['w-52', 'w-24', 'w-24', 'w-16', 'w-24', 'w-1']}
            />
          ) : (
            <ClientTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
