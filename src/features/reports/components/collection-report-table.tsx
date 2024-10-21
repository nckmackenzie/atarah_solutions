import { type ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';

import {
  fileSuffix,
  formatDateReporting,
  numberFormat,
} from '@/lib/formatters';
import type { PaymentCollection } from '@/features/reports/types/index.types';
import { useExportExcel } from '@/hooks/use-export-excel';

interface CollectionReportTableProps {
  data: PaymentCollection[];
}

const columns: ColumnDef<PaymentCollection>[] = [
  {
    accessorKey: 'paymentDate',
    header: 'Payment Date',
    cell: ({ row }) => (
      <div className="row-font">
        {formatDateReporting(row.original.paymentDate)}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Client Name',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.name}</div>
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
    header: 'Payment Reference',
    cell: ({ row }) => (
      <div className="row-font uppercase">{row.original.paymentReference}</div>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="row-font text-right">
        {numberFormat(row.original.totalAmount)}
      </div>
    ),
  },
];

export default function CollectionReportTable({
  data,
}: CollectionReportTableProps) {
  const exportToExcel = useExportExcel(`collection_report_${fileSuffix()}`);
  const formattedData = data.map(row => ({
    'Payment Date': formatDateReporting(row.paymentDate),
    Client: row.name.toUpperCase(),
    'Payment Method': row.paymentMethod,
    'Payment Reference': row.paymentReference,
    Amount: numberFormat(row.totalAmount),
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
        footerColspan={4}
        footerTotalValue={numberFormat(
          data.reduce((acc, curr) => acc + Number(curr.totalAmount), 0)
        )}
      />
    </div>
  );
}
