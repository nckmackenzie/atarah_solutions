import { Briefcase } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/custom-alert';
import PageCard from '@/components/ui/page-card';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import ServicesDatatable from '@/features/admin/components/services/services-datatable';

import { usePageFetch } from '@/hooks/use-page-fetch';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchServices } from '@/features/admin/api/service';

export default function ServicesIndexPage() {
  useDocumentTitle('Services');
  const { data, error, isLoading } = usePageFetch('services', fetchServices);
  return (
    <ContentWrapper>
      <div className="y-spacing">
        {error && <ErrorAlert error={error.message} />}
        <CreateNewButton href="/admin/services/new">
          <Briefcase className="icon" />
          <span>Create new service</span>
        </CreateNewButton>
      </div>
      <PageCard
        title="Services"
        description="List of all created services."
        searchPlaceholder="Search by service name or description"
      >
        {isLoading ? (
          <TableSkeleton
            rowCount={10}
            columnWidths={['w-72', 'w-72', 'w-16', 'w-1']}
          />
        ) : (
          <ServicesDatatable data={data || []} />
        )}
      </PageCard>
    </ContentWrapper>
  );
}
