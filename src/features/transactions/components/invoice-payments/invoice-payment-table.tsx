import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { CustomAlertDialog } from '@/components/ui/custom-alert-dialog';
import CustomDropdownContent from '@/components/ui/custom-dropdown-content';
import { DataTable } from '@/components/ui/datatable';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatDateLong, numberFormat } from '@/lib/formatters';
import type { InvoicePaymentRow } from '@/features/transactions/types/invoice.types';

interface InvoicePaymentTableProps {
  data: InvoicePaymentRow[];
}

function InvoicePaymentTable({ data }: InvoicePaymentTableProps) {
  const columns: ColumnDef<InvoicePaymentRow>[] = [
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <div className="row-font">
          {formatDateLong(row.original.paymentDate)}
        </div>
      ),
    },
    {
      accessorKey: 'clients',
      header: 'Client',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.clients?.name}</div>
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Payment Reference',
      cell: ({ row }) => (
        <div className="row-font uppercase">
          {row.original.paymentReference}
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => (
        <div className="row-font">
          {numberFormat(row.original.totalAmount || 0)}
        </div>
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
              <Link
                to={`/transactions/invoices/payments/edit/${row.original.id}`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <CustomAlertDialog>
              <button className="delete-menu-item">Delete</button>
            </CustomAlertDialog>
          </CustomDropdownContent>
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable columns={columns} data={data} />;
}

export default InvoicePaymentTable;
