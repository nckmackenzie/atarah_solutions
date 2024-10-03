import PageCard from '@/components/ui/page-card';
import { useDocumentTitle } from '@/hooks/use-title';
import type { IsEdit } from '@/types/index.types';
import ClientForm from '../../components/client-form';
import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';

export default function CreateEditForm({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit client' : 'Create new client');
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        <PageCard
          title={isEdit ? 'Edit client' : 'Create new client'}
          hasSearch={false}
          className="max-w-4xl mx-4 md:mx-auto"
        >
          <ClientForm isEdit={!!isEdit} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
