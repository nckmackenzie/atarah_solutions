import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import CustomDropdownTrigger from '@/components/ui/custom-dropdown-trigger';
import CustomRegularDropdownContent from '@/components/ui/custom-regular-dropdown-content';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/datatable';

import { deleteProject } from '@/features/admin/api/project';
import type { Project } from '@/features/admin/types/project.types';

interface ProjectsTableProps {
  data: Project[];
}

export default function ProjectsTable({ data }: ProjectsTableProps) {
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'projectName',
      header: 'Project Name',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.projectName}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="row-font capitalize">{row.original.description}</div>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.active ? 'success' : 'error'}>
          {row.original.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <CustomDropdownTrigger />
          <CustomRegularDropdownContent
            id={row.original.id}
            to={`/admin/projects/edit/${row.original.id}`}
            queryKey="projects"
            deleteFn={deleteProject}
          />
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
