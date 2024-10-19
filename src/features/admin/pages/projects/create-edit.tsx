import ContentWrapper from '@/components/layout/content-wrapper';
import { BackButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import ProjectForm from '@/features/admin/components/projects/project-form';
import { PageLoader } from '@/components/ui/loaders';
import { ErrorAlert } from '@/components/ui/custom-alert';

import { useFetchSingle } from '@/hooks/use-fetch-single';
import { useDocumentTitle } from '@/hooks/use-title';
import { fetchProject } from '@/features/admin/api/project';
import type { IsEdit } from '@/types/index.types';

export default function ProjectCreateEditPage({ isEdit }: IsEdit) {
  useDocumentTitle(isEdit ? 'Edit Project' : 'Create Project');
  const { data, isLoading, error } = useFetchSingle('project', fetchProject);

  if (isLoading) return <PageLoader loaderText="Fetching project details..." />;

  return (
    <ContentWrapper>
      <div className="y-spacing">
        <BackButton />
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title={isEdit ? 'Edit project' : 'Create new project'}
          className="max-w-xl mx-4 md:mx-auto"
          hasSearch={false}
        >
          <ProjectForm isEdit={!!isEdit} data={data} />
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
