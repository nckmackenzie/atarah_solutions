import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import CustomDropdownContent from '@/components/ui/custom-dropdown-content';
import { CustomAlertDialog } from '@/components/ui/custom-alert-dialog';

import { numberFormat } from '@/lib/formatters';
import { useDelete } from '@/hooks/use-delete';
import { deleteService } from '@/features/admin/api/service';
import type { Service } from '@/features/admin/types/service';

interface ServicesDatatableProps {
  data: Service[];
}

export default function ServicesDatatable({ data }: ServicesDatatableProps) {
  const { destroy } = useDelete('services', deleteService);
  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'serviceName',
      header: 'Service Name',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.serviceName}</div>
      ),
    },
    {
      accessorKey: 'serviceRate',
      header: 'Service Rate',
      cell: ({ row }) => (
        <div className="row-font">{numberFormat(row.original.serviceRate)}</div>
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
          <DropdownMenuTrigger asChild>
            <button className="more-btn">
              <MoreVertical className="icon-muted" />
            </button>
          </DropdownMenuTrigger>
          <CustomDropdownContent>
            <DropdownMenuItem asChild>
              <Link to={`/admin/services/edit/${row.original.id}`}>Edit</Link>
            </DropdownMenuItem>
            <CustomAlertDialog onConfirm={() => destroy(row.original.id)}>
              <button className="delete-menu-item">Delete</button>
            </CustomAlertDialog>
          </CustomDropdownContent>
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
