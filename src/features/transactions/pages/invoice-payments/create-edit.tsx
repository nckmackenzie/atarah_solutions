import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import InvoicePaymentForm from '@/features/transactions/components/invoice-payments/payment-form';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchInvoicePayment } from '@/features/transactions/api/invoice';
import type { IsEdit } from '@/types/index.types';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';

export default function InvoicePaymentsCreateEdit({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit Payment' : 'New Payment');
  const { data, error, isLoading } = useFetchSingle(
    'invoice payment',
    fetchInvoicePayment
  );

  if (isLoading) return <PageLoader loaderText="Fetching payment details" />;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit Payment' : 'New Payment'}
          hasSearch={false}
        >
          <InvoicePaymentForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
