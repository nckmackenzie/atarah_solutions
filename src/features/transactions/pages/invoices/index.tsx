import { FileText } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import InvoicesTable from '@/features/transactions/components/invoices/invoices-table';
import PageCard from '@/components/ui/page-card';

import { useDocumentTitle } from '@/hooks/use-title';
import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchInvoices } from '@/features/transactions/api/invoice';

export default function InvoicesIndexPage() {
  useDocumentTitle('Invoices');
  const { data, error, isLoading } = usePageFetch('invoices', fetchInvoices);
  return (
    <ContentWrapper>
      <div className="y-spacing">
        {error && <ErrorAlert error={error.message} />}
        <CreateNewButton href="/transactions/invoices/new">
          <FileText className="icon" />
          <span>Create New Invoice</span>
        </CreateNewButton>
        <PageCard
          title="Invoices"
          description="List of all created invoices."
          searchPlaceholder="Search by invoice number"
        >
          {isLoading ? (
            <TableSkeleton
              rowCount={10}
              columnWidths={['w-8', 'w-16', 'w-16', 'w-56', 'w-24', 'w-1']}
            />
          ) : (
            <InvoicesTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
