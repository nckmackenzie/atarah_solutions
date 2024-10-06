import { CreditCard } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/custom-alert';
import PageCard from '@/components/ui/page-card';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import InvoicePaymentTable from '@/features/transactions/components/invoice-payments/invoice-payment-table';

import { useDocumentTitle } from '@/hooks/use-title';
import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchInvoicePayments } from '@/features/transactions/api/invoice';

export default function InvoicePaymentsIndex() {
  useDocumentTitle('Invoice Payments');
  const { data, isLoading, error } = usePageFetch(
    'invoice payments',
    fetchInvoicePayments
  );
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <CreateNewButton href="/transactions/invoices/payments/new">
          <CreditCard className="icon" />
          <span>Create new payment</span>
        </CreateNewButton>
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title="Invoice Payments"
          description="List of all invoice payments"
          hasSearch={false}
        >
          {isLoading ? (
            <TableSkeleton
              rowCount={5}
              columnWidths={['w-16', 'w-56', 'w-24', 'w-36']}
            />
          ) : (
            <InvoicePaymentTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
