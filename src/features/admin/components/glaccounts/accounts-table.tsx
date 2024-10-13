import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import CustomDropdownTrigger from '@/components/ui/custom-dropdown-trigger';
import CustomRegularDropdownContent from '@/components/ui/custom-regular-dropdown-content';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

import { deleteAccount } from '@/features/admin/api/glaccounts';
import type { GlAccount } from '@/features/admin/types/glaccount.types';
import { DataTable } from '@/components/ui/datatable';

interface AccountsTableProps {
  data: GlAccount[];
}

export default function AccountsTable({ data }: AccountsTableProps) {
  const columns: ColumnDef<GlAccount>[] = [
    {
      accessorKey: 'accountName',
      header: 'Account Name',
      cell: ({ row }) => (
        <div className="row-font">{row.original.accountName.toUpperCase()}</div>
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
            to={`/admin/glaccounts/edit/${row.original.id}`}
            id={row.original.id}
            queryKey="gl accounts"
            deleteFn={deleteAccount}
          />
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}
