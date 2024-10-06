import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import InvoiceForm from '@/features/transactions/components/invoices/invoice-form';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchInvoice } from '@/features/transactions/api/invoice';
import type { IsEdit } from '@/types/index.types';

export default function InvoicesCreateEdit({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit Invoice' : 'Create new Invoice');
  const { data, error, isLoading } = useFetchSingle('invoice', fetchInvoice);

  if (isLoading) return <PageLoader loaderText="Fetching invoice details" />;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit invoice' : 'Create new invoice'}
          hasSearch={false}
        >
          <InvoiceForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
