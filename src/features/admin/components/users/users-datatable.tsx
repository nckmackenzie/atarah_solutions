import { startTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/datatable';
import { toast } from 'sonner';

import { changeUserStatus } from '@/features/admin/api/user';
import type { User } from '@/features/admin/types/user.types';

export default function UsersDataTable({ data }: { data: User[] }) {
  const queryClient = useQueryClient();
  function handleChangeStatus(status: User['active'], userId: string) {
    startTransition(() => {
      changeUserStatus(status, userId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          toast.success('User status updated successfully');
        })
        .catch(err => toast.error(err.message));
    });
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: 'User Name',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.username}</div>
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
        <Badge
          variant={
            row.original.active === 'active'
              ? 'success'
              : row.original.active === 'inactive'
              ? 'error'
              : 'warning'
          }
        >
          {row.original.active?.replace('_', ' ').toUpperCase()}
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
          <DropdownMenuContent className="[&>*]:text-xs [&>*]:font-medium [&>*]:cursor-pointer">
            {row.original.active !== 'active' ? (
              <DropdownMenuItem
                onClick={() => handleChangeStatus('active', row.original.id)}
              >
                Activate
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    handleChangeStatus('inactive', row.original.id)
                  }
                >
                  Deactivated
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
