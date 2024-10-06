import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CustomAlertDialog } from '@/components/ui/custom-alert-dialog';
import CustomDropdownContent from '@/components/ui/custom-dropdown-content';
import { DataTable } from '@/components/ui/datatable';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatDateLong, numberFormat } from '@/lib/formatters';
import type { InvoiceRow } from '@/features/transactions/types/invoice.types';
import { useDelete } from '@/hooks/use-delete';
import { deleteInvoice } from '../../api/invoice';

interface InvoicesTableProps {
  data: InvoiceRow[];
}

export default function InvoicesTable({ data }: InvoicesTableProps) {
  const { destroy } = useDelete('invoices', deleteInvoice);
  const columns: ColumnDef<InvoiceRow>[] = [
    {
      accessorKey: 'invoiceno',
      header: 'Invoice No',
      cell: ({ row }) => (
        <div className="row-font">{row.original.invoiceno}</div>
      ),
    },
    {
      accessorKey: 'invoicedate',
      header: 'Invoice Date',
      cell: ({ row }) => (
        <div className="row-font">
          {formatDateLong(row.original.invoicedate)}
        </div>
      ),
    },
    {
      accessorKey: 'duedate',
      header: 'Due Date',
      cell: ({ row }) => (
        <div className="row-font">
          {formatDateLong(row.original.duedate || new Date())}
        </div>
      ),
    },
    {
      accessorKey: 'clientname',
      header: 'Client',
      cell: ({ row }) => (
        <div className="row-font">
          {row.original.clientname.toUpperCase() || ''}
        </div>
      ),
    },
    {
      accessorKey: 'invoicebalance',
      id: 'invoiceamount',
      header: 'Invoice Amount',
      cell: ({ row }) => (
        <div className="row-font">
          {numberFormat(row.original.invoicebalance || 0)}
        </div>
      ),
    },
    {
      accessorKey: 'invoicebalance',
      header: 'Pay Status',
      cell: ({ row }) => {
        const invoiceStatus =
          +row.original.invoicebalance === +row.original.invoiceamount
            ? 'Unpaid'
            : row.original.invoicebalance > 0
            ? 'Partially Paid'
            : 'Settled';
        return (
          <Badge
            variant={
              invoiceStatus === 'Unpaid'
                ? 'error'
                : invoiceStatus === 'Partially Paid'
                ? 'warning'
                : 'success'
            }
          >
            {invoiceStatus}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const invoiceNotPaid =
          +row.original.invoicebalance === +row.original.invoiceamount;

        return (
          <DropdownMenu>
            {invoiceNotPaid && (
              <DropdownMenuTrigger asChild>
                <button className="more-btn">
                  <MoreVertical className="icon-muted" />
                </button>
              </DropdownMenuTrigger>
            )}
            <CustomDropdownContent>
              <DropdownMenuItem asChild>
                <Link to={`/transactions/invoices/edit/${row.original.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
              {invoiceNotPaid && (
                <CustomAlertDialog onConfirm={() => destroy(row.original.id)}>
                  <button className="delete-menu-item">Delete</button>
                </CustomAlertDialog>
              )}
            </CustomDropdownContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return <DataTable data={data} columns={columns} />;
}
