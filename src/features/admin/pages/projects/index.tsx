import { Kanban } from 'lucide-react';

import ContentWrapper from '@/components/layout/content-wrapper';
import { CreateNewButton } from '@/components/ui/button';
import PageCard from '@/components/ui/page-card';
import { ErrorAlert } from '@/components/ui/custom-alert';
import ProjectsTable from '@/features/admin/components/projects/projects-table';
import { TableSkeleton } from '@/components/ui/table-skeleton';

import { useDocumentTitle } from '@/hooks/use-title';
import { usePageFetch } from '@/hooks/use-page-fetch';
import { fetchProjects } from '@/features/admin/api/project';

export default function ProjectsIndexPage() {
  useDocumentTitle('Projects');
  const { data, isLoading, error } = usePageFetch('projects', fetchProjects);
  return (
    <ContentWrapper>
      <div className="y-spacing">
        <CreateNewButton href="/admin/projects/new">
          <Kanban className="icon mr-2" />
          <span>Create new project</span>
        </CreateNewButton>
        {error && <ErrorAlert error={error.message} />}
        <PageCard
          title="Projects"
          description="List of all created projects"
          searchPlaceholder="Search by project name"
        >
          {isLoading ? (
            <TableSkeleton
              columnWidths={['w-56', 'w-72', 'w-16', 'w-1']}
              rowCount={10}
            />
          ) : (
            <ProjectsTable data={data || []} />
          )}
        </PageCard>
      </div>
    </ContentWrapper>
  );
}
