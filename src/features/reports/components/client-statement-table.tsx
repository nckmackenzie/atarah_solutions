import { type ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Button } from '@/components/ui/button';

import type { ClientStatementItem } from '@/features/reports/types/index.types';
import {
  fileSuffix,
  formatDateReporting,
  numberFormat,
} from '@/lib/formatters';
import { useExportExcel } from '@/hooks/use-export-excel';
import usePdfConverter from '@/hooks/use-pdf';

interface ClientStatementTableProps {
  data: ClientStatementItem[];
}

const columns: ColumnDef<ClientStatementItem>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <div className="row-font">{formatDateReporting(row.original.date)}</div>
    ),
  },
  {
    accessorKey: 'reference',
    header: 'Reference',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.reference}</div>
    ),
  },
  {
    accessorKey: 'debit',
    header: () => <div className="text-right">Debit</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {+row.original.debit !== 0
          ? numberFormat(row.original.debit)
          : undefined}
      </div>
    ),
  },
  {
    accessorKey: 'credit',
    header: () => <div className="text-right">Credit</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {+row.original.credit !== 0
          ? numberFormat(row.original.credit)
          : undefined}
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => (
      <div className="text-right">{numberFormat(row.original.balance)}</div>
    ),
  },
];

export default function ClientStatementTable({
  data,
}: ClientStatementTableProps) {
  const exportToExcel = useExportExcel(`client_statement_${fileSuffix()}`);
  const { convertToPdf, isConverting } = usePdfConverter(
    'print-document',
    `client-statement_${fileSuffix()}`
  );
  const formattedData = data.map(row => ({
    Date: formatDateReporting(row.date),
    Reference: row.reference?.toUpperCase(),
    debit: numberFormat(row.debit),
    credit: numberFormat(row.credit),
    balance: numberFormat(row.balance),
  }));
  return (
    <div className="space-y-4">
      <div className="-space-x-2">
        <Button variant="excel" onClick={() => exportToExcel(formattedData)}>
          Export to Excel
        </Button>
        <Button
          variant="destructive"
          disabled={isConverting}
          onClick={convertToPdf}
        >
          <FileText className="icon mr-2" />
          <span>PDF</span>
        </Button>
      </div>
      <div id="print-document">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}
