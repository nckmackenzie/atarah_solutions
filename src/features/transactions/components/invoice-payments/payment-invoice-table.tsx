import { format } from 'date-fns';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

import { numberFormat } from '@/lib/formatters';
import type { InvoicePaymentFormValues } from '@/features/transactions/types/invoice.types';
import type { IsEditRequired, IsPending } from '@/types/index.types';
interface PaymentInvoiceTableProps extends IsPending, IsEditRequired {
  form: UseFormReturn<InvoicePaymentFormValues>;
}

export default function PaymentInvoiceTable({
  form,
  isPending,
  isEdit,
}: PaymentInvoiceTableProps) {
  const { fields } = useFieldArray({
    control: form.control,
    name: 'invoices',
  });

  return (
    <div className="col-span-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Invoice Amount</TableHead>
            {!isEdit && <TableHead>Balance</TableHead>}
            <TableHead className="w-56">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.invoiceId}>
              <TableCell>{field.invoiceNo}</TableCell>
              <TableCell>{format(field.dueDate, 'dd/MMM/yyyy')}</TableCell>
              <TableCell>{numberFormat(field.invoiceAmount)}</TableCell>
              {!isEdit && <TableCell>{numberFormat(field.balance)}</TableCell>}
              <TableCell>
                <Input
                  className="w-56"
                  disabled={isPending}
                  {...form.register(`invoices.${index}.amountPaid`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
