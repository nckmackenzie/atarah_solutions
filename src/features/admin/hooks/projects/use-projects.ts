import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/features/admin/api/project';

export function useProjects() {
  const {
    data,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(),
  });

  const projects =
    data
      ?.filter(dt => dt.active)
      .map(project => ({
        label: project.projectName.toUpperCase(),
        value: project.id,
      })) || [];

  return { projects, isLoadingProjects, projectsError };
}
