import PageCard from '@/components/ui/page-card';
import ClientForm from '@/features/admin/components/clients/client-form';
import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';

import { useDocumentTitle } from '@/hooks/use-title';
import { useFetchSingle } from '@/hooks/use-fetch-single';
import { fetchClient } from '@/features/admin/api/customer';
import type { IsEdit } from '@/types/index.types';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { PageLoader } from '@/components/ui/loaders';

export default function CreateEditForm({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit client' : 'Create new client');
  const { data, error, isLoading } = useFetchSingle('customer', fetchClient);

  if (isLoading) return <PageLoader loaderText="Fetcing client details..." />;

  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit client' : 'Create new client'}
          hasSearch={false}
          className="max-w-4xl mx-4 md:mx-auto"
        >
          <ClientForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
