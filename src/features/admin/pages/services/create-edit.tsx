import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import ServiceForm from '@/features/admin/components/services/service-form';
import { ErrorAlert } from '@/components/ui/custom-alert';
import { PageLoader } from '@/components/ui/loaders';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchService } from '@/features/admin/api/service';
import type { IsEdit } from '@/types/index.types';

export default function ServicesCreateEdit({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit service' : 'Create new service');
  const { data, error, isLoading } = useFetchSingle('service', fetchService);

  if (isLoading) return <PageLoader loaderText="Fetching service details..." />;
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit service' : 'Create new service'}
          hasSearch={false}
          className="max-w-xl mx-4 md:mx-auto"
        >
          <ServiceForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
