import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/ui/datatable';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import CustomDropdownTrigger from '@/components/ui/custom-dropdown-trigger';
import CustomRegularDropdownContent from '@/components/ui/custom-regular-dropdown-content';

import { formatDateLong, numberFormat } from '@/lib/formatters';
import { deleteExpense } from '@/features/transactions/api/expense';
import type { ExpenseIndexTableRow } from '@/features/transactions/types/expense.types';

interface ExpensesDatatableProps {
  data: ExpenseIndexTableRow[];
}

export default function ExpensesDatatable({ data }: ExpensesDatatableProps) {
  const columns: ColumnDef<ExpenseIndexTableRow>[] = [
    {
      accessorKey: 'expenseNo',
      header: 'Expense No',
      cell: ({ row }) => (
        <div className="row-font">{row.original.expenseNo}</div>
      ),
    },
    {
      accessorKey: 'expenseDate',
      header: 'Expense Date',
      cell: ({ row }) => (
        <div className="row-font">
          {formatDateLong(row.original.expenseDate!)}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="row-font">{numberFormat(row.original.amount!)}</div>
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
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <div className="row-font uppercase">{row.original.paymentMethod}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <CustomDropdownTrigger />
          <CustomRegularDropdownContent
            id={row.original.id as string}
            queryKey="expenses"
            to={`/transactions/expenses/edit/${row.original.id}`}
            deleteFn={deleteExpense}
          />
        </DropdownMenu>
      ),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}
