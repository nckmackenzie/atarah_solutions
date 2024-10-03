import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/datatable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomAlertDialog } from '@/components/ui/custom-alert-dialog';

import { useDelete } from '@/hooks/use-delete';
import { deleteClient } from '@/features/admin/api/customer';
import type { Customer } from '@/features/admin/types/customer.types';

interface ClientTableProps {
  data: Customer[];
}
export default function ClientTable({ data }: ClientTableProps) {
  const { destroy } = useDelete('clients', deleteClient);
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="row-font">{row.original.email}</div>,
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => <div className="row-font">{row.original.contact}</div>,
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
          <DropdownMenuContent className="[&>*]:cursor-pointer [&>*]:text-xs [&>*]:font-medium">
            <DropdownMenuItem asChild>
              <Link
                to={`/admin/customers/edit/${row.original.id}`}
                className="w-full"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <CustomAlertDialog onConfirm={() => destroy(row.original.id)}>
              <button className="delete-menu-item">Delete</button>
            </CustomAlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
