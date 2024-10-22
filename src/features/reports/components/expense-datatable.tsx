import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';

import { useExportExcel } from '@/hooks/use-export-excel';
import {
  fileSuffix,
  formatDateReporting,
  numberFormat,
} from '@/lib/formatters';
import type { ExpenseReportItem } from '@/features/reports/types/index.types';

interface ExpenseDataTableProps {
  data: ExpenseReportItem[];
}

const columns: ColumnDef<ExpenseReportItem>[] = [
  {
    accessorKey: 'expenseDate',
    header: 'Date',
    cell: ({ row }) => (
      <div className="row-font">
        {formatDateReporting(row.original.expenseDate)}
      </div>
    ),
  },
  {
    accessorKey: 'payee',
    header: 'Payee',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.payee}</div>
    ),
  },
  {
    accessorKey: 'accountName',
    header: 'Account',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.accountName}</div>
    ),
  },
  {
    accessorKey: 'projectName',
    header: 'Project',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original?.projectName}</div>
    ),
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.paymentMethod}</div>
    ),
  },
  {
    accessorKey: 'paymentReference',
    header: 'Reference',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original?.paymentReference}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="row-font text-right">
        {numberFormat(row.original.amount)}
      </div>
    ),
  },
];

export default function ExpenseDataTable({ data }: ExpenseDataTableProps) {
  const exportToExcel = useExportExcel(`expense_report_${fileSuffix()}`);
  const formattedData = data.map(row => ({
    'Expense Date': formatDateReporting(row.expenseDate),
    Payee: row.payee.toUpperCase(),
    Account: row.accountName.toUpperCase(),
    Project: row.projectName?.toUpperCase(),
    'Payment Method': row.paymentMethod,
    'Payment Reference': row.paymentReference,
    Amount: numberFormat(row.amount),
  }));
  return (
    <div className="space-y-4">
      <Button variant="excel" onClick={() => exportToExcel(formattedData)}>
        Export to Excel
      </Button>
      <DataTable
        data={data}
        columns={columns}
        hasTotalsFooter
        footerColspan={6}
        footerTotalValue={numberFormat(
          data.reduce((acc, curr) => acc + Number(curr.amount), 0)
        )}
      />
    </div>
  );
}
