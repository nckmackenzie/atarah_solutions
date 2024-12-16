import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import { TableCell } from '@/components/ui/table';

import { useExportExcel } from '@/hooks/use-export-excel';
import {
  fileSuffix,
  formatDateReporting,
  numberFormat,
} from '@/lib/formatters';
import type { OutstandingInvoice } from '@/features/reports/types/index.types';

interface OutstandingInvoicesTableProps {
  data: OutstandingInvoice[];
}

const columns: ColumnDef<OutstandingInvoice>[] = [
  {
    accessorKey: 'invoiceNo',
    header: 'Invoice No',
    cell: ({ row }) => <div className="row-font">{row.original.invoiceNo}</div>,
  },
  {
    accessorKey: 'invoiceDate',
    header: 'Invoice Date',
    cell: ({ row }) => (
      <div>{formatDateReporting(row.original.invoiceDate)}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Client',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => (
      <div className="row-font">
        <span>{formatDateReporting(row.original.dueDate)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'exclusiveAmount',
    header: () => <div className="text-right">Invoice Value</div>,
    cell: ({ row }) => (
      <div className="row-font text-right">
        {numberFormat(row.original.exclusiveAmount)}
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance(Inc VAT)</div>,
    cell: ({ row }) => (
      <div className="row-font text-right">
        {numberFormat(row.original.balance)}
      </div>
    ),
  },
];

export default function OutstandingInvoicesTable({
  data,
}: OutstandingInvoicesTableProps) {
  const exportToExcel = useExportExcel(`outstanding_invoices_${fileSuffix()}`);
  const dataToExport = data.map(row => ({
    'Invoice No': `'${row.invoiceNo}`,
    'Invoice Date': formatDateReporting(row.invoiceDate),
    Client: row.name.toUpperCase(),
    'Due Date': formatDateReporting(row.dueDate),
    'Invoice Value': numberFormat(row.exclusiveAmount),
    'Balance(Inc VAT)': numberFormat(row.balance),
  }));
  return (
    <div className="space-y-4">
      <Button variant="excel" onClick={() => exportToExcel(dataToExport)}>
        Export to Excel
      </Button>
      <DataTable
        columns={columns}
        data={data}
        hasTotalsFooter
        customFooter={
          <>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {numberFormat(
                data.reduce(
                  (acc, curr) => acc + Number(curr.exclusiveAmount),
                  0
                )
              )}
            </TableCell>
            <TableCell className="text-right">
              {numberFormat(
                data.reduce((acc, curr) => acc + Number(curr.balance), 0)
              )}
            </TableCell>
          </>
        }
      />
    </div>
  );
}
