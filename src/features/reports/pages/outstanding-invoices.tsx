import ContentWrapper from '@/components/layout/content-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import PageCard from '@/components/ui/page-card';
import { ErrorAlert } from '@/components/ui/custom-alert';
import OutstandingInvoicesTable from '@/features/reports/components/outstanding-invoices-table';

import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchOutstandingInvoices } from '@/features/reports/api';

export default function OutstandingInvoices() {
  const { data, error, isLoading } = usePageFetch(
    'outstanding invoices',
    fetchOutstandingInvoices
  );
  return (
    <ContentWrapper>
      <div className="y-spacing">
        {error && <ErrorAlert error={error.message} />}
        <PageCard title="Outstanding Invoices" hasSearch={false}>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-32 h-9" />
              <TableSkeleton
                rowCount={10}
                columnWidths={['w-12', 'w-24', 'w-56', 'w-32', 'w-16', 'w-16']}
              />
            </div>
          ) : (
            <OutstandingInvoicesTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
